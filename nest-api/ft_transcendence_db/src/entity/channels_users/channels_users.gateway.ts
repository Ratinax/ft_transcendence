import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelsUsersService } from './channels_users.service';
import { Server, Socket } from 'socket.io';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { MessageService } from '../messages/message.service';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
  namespace: 'chat'
})
export class ChannelsUsersGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly messageService: MessageService) {}

  @SubscribeMessage('findUsersOfChannel')
  async findUsersOfChannel(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, channel: {name: string, channel_id: number}})
  {
	if (!body || !body.sessionCookie || !body.channel || !body.channel.channel_id || !body.channel.name)
		return ;
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      throw new UnauthorizedException('You are not connected');
    }
    try 
    {
        const res = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.to(client.id).emit('updateListUsers', {users: res});
    }
    catch (e)
    {
  
    }
  }

  @SubscribeMessage('banUser')
  async ban(@MessageBody() body: {sessionCookie: string, userBanned: {id: number, pseudo: string}, channel: {channel_id: number, name: string}}) 
  {
	if (!body || !body.sessionCookie || !body.userBanned || !body.userBanned.id || !body.channel || !body.channel.channel_id || !body.channel.name)
		return ;
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      throw new UnauthorizedException('You are not connected');
    }
    if (await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id)
      && (!(await this.checkOwnerPerms(body.userBanned.id, body.channel.channel_id))))
    {}
    else if (!(await this.checkUserAdminPerms(body.sessionCookie, body.channel.channel_id)))
      return (false);
    else if (await this.checkAdminPerms(body.userBanned.id, body.channel.channel_id))
      return (false);
    
    const res = await this.channelsUsersService.ban(body.channel, body.userBanned);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.to(body.channel.name).emit('updateAfterPart', {
      users: users,
      channel: body.channel,
      sessionCookie: await this.sessionService.getSessionKey(body.userBanned.id)});
    const messageRemoved = await this.messageService.removeGameInviteById(body.userBanned.id);
    if (messageRemoved)
      this.server.to(body.channel.name).emit('removeMessage', {message_id: messageRemoved.id});
    this.channelsUsersService.getSocket(body.userBanned.pseudo)?.leave(body.channel.name);
  
    return (res);
  }

  @SubscribeMessage('kickUser')
  async kick(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, userKicked: {id: number, pseudo: string}, channel: {channel_id: number, name: string}}) 
  {
	if (!body || !body.sessionCookie || !body.userKicked || !body.userKicked.id || !body.channel || !body.channel.channel_id || !body.channel.name)
	 return ;
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      throw new UnauthorizedException('You are not connected');
    }
    if (await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id)
      && (!(await this.checkOwnerPerms(body.userKicked.id, body.channel.channel_id))))
    {}
    else if (!(await this.checkUserAdminPerms(body.sessionCookie, body.channel.channel_id)))
      return (false);
    else if (await this.checkAdminPerms(body.userKicked.id, body.channel.channel_id))
      return (false);

    const res = await this.channelsUsersService.leave(body.channel, body.userKicked);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.to(body.channel.name).emit('updateAfterPart', {
      users: users,
      channel: body.channel,
      sessionCookie: await this.sessionService.getSessionKey(body.userKicked.id)});
    const messageRemoved = await this.messageService.removeGameInviteById(body.userKicked.id);
    if (messageRemoved)
      this.server.to(body.channel.name).emit('removeMessage', {message_id: messageRemoved.id});
    this.channelsUsersService.getSocket(body.userKicked.pseudo)?.leave(body.channel.name);
    return (res);
  }

  @SubscribeMessage('giveMySocket')
  async giveMySocket(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string})
  {
	if (!body || !body.sessionCookie)
		return ;
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
		  throw new UnauthorizedException('You are not connected')
    }
    const user = await this.sessionService.getUser(body.sessionCookie);
    if (!user)
      return (null);
    
    this.channelsUsersService.updateUserSocketList(client, user.pseudo);
  }

  @SubscribeMessage('setAdmin')
  async setAdmin(@MessageBody() body: {sessionCookie: string, userSetAdmin: {id: number}, channel: {channel_id: number, name: string}}) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      throw new UnauthorizedException('You are not connected');
    }
    if (!await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id))
      return (false)
    const res = await this.channelsUsersService.setAdmin(body.channel, body.userSetAdmin);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);

    this.server.to(body.channel.name).emit('updateListUsers', {
      users: users});
    return (res);
  }

  @SubscribeMessage('removeAdmin')
  async removeAdmin(@MessageBody() body: {sessionCookie: string, userRemovedAdmin: {id: number}, channel: {channel_id: number, name: string}}) 
  {
	if (!body || !body.sessionCookie || !body.userRemovedAdmin || !body.userRemovedAdmin.id || !body.channel || !body.channel.channel_id || !body.channel.name)
		return ;
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      throw new UnauthorizedException('You are not connected');
    }
    if (!await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id))
      return (false);
    else if (await this.checkOwnerPerms(body.userRemovedAdmin.id, body.channel.channel_id))
      return (false);

    const res = await this.channelsUsersService.removeAdmin(body.channel, body.userRemovedAdmin);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.to(body.channel.name).emit('updateListUsers', {
      users: users});
    return (res);
  }

  @SubscribeMessage('timeoutUser')
  async timeoutUser(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, userTimeouted: {id: number}, channel: {channel_id: number, name: string}, duration_timeout: number})
  {
	if (!body || !body.sessionCookie || !body.userTimeouted || !body.userTimeouted.id || !body.duration_timeout || !body.channel || !body.channel.channel_id || !body.channel.name)
	{
		return ;
	}
		
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      throw new UnauthorizedException('You are not connected');
    }
    
    if (await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id)
    && (!(await this.checkOwnerPerms(body.userTimeouted.id, body.channel.channel_id))))
    {}
    else if (!(await this.checkUserAdminPerms(body.sessionCookie, body.channel.channel_id)))
      return (false);
    else if (await this.checkAdminPerms(body.userTimeouted.id, body.channel.channel_id))
      return (false);
    
    if (body.duration_timeout >= 2592000 || body.duration_timeout < 10) // 30 days and 10 seconds
    {
      this.server.to(client.id).emit('timeoutWrongAmount');
      return ;
    }
    await this.channelsUsersService.timeoutUser(body.channel, body.userTimeouted, body.duration_timeout);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    
    this.server.to(body.channel.name).emit('updateListUsers', {users: users});
    this.server.to(client.id).emit('timeoutGoodRequest');
  }

  async checkUserAdminPerms(sessionCookie: string, channel_id: number)
  {
    const user = await this.sessionService.getUser(sessionCookie);
    if (!user)
      return (false);
    const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
    if (!relation || !relation.isAdmin)
      return (false);
    return (true);
  }
  async checkUserOwnerPerms(sessionCookie: string, channel_id: number)
  {
    const user = await this.sessionService.getUser(sessionCookie);
    if (!user)
      return (false);
    const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
    if (!relation || !relation.isOwner)
      return (false);
    return (true);
  }
  async checkAdminPerms(user_id: number, channel_id: number)
  {
    const relation = (await this.channelsUsersService.findRelation(user_id, channel_id))[0];
    if (!relation || !relation.isAdmin)
      return (false);
    return (true);
  }
  async checkOwnerPerms(user_id: number, channel_id: number)
  {
    const relation = (await this.channelsUsersService.findRelation(user_id, channel_id))[0];
    if (!relation || !relation.isOwner)
      return (false);
    return (true);
  }
}

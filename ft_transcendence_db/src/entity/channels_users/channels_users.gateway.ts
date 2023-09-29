import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway(3001, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
})
export class ChannelsUsersGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}

  @SubscribeMessage('findUsersOfChannel')
  async findUsersOfChannel(@MessageBody() body)
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    try 
    {
        const res = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
        this.server.emit('updateListUsers', {users: res, channel: body.channel});
    }
    catch (e)
    {
    }
  }

  @SubscribeMessage('banUser')
  async ban(@MessageBody() body) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
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
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      sessionCookie: await this.sessionService.getSessionKey(body.userBanned.id)});
    return (res);
  }
  @SubscribeMessage('kickUser')
  async kick(@MessageBody() body) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
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
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      sessionCookie: await this.sessionService.getSessionKey(body.userKicked.id)});
    return (res);
  }
  
  @SubscribeMessage('setAdmin')
  async setAdmin(@MessageBody() body) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    if (!await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id))
      return (false)
    const res = await this.channelsUsersService.setAdmin(body.channel, body.userSetAdmin);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);

    this.server.emit('updateListUsers', {
      users: users, 
      channel: body.channel});
    return (res);
  }
  
  @SubscribeMessage('removeAdmin')
  async removeAdmin(@MessageBody() body) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    if (!await this.checkUserOwnerPerms(body.sessionCookie, body.channel.channel_id))
      return (false);
    else if (await this.checkOwnerPerms(body.userRemovedAdmin.id, body.channel.channel_id))
      return (false);

    const res = await this.channelsUsersService.removeAdmin(body.channel, body.userRemovedAdmin);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateListUsers', {
      users: users, 
      channel: body.channel});
    return (res);
  }

  @SubscribeMessage('timeoutUser')
  async timeoutUser(@MessageBody() body)
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
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
      this.server.emit('timeoutWrongAmount', {channel: body.channel, sessionCookie: body.sessionCookie});
      return ;
    }
    await this.channelsUsersService.timeoutUser(body.channel, body.userTimeouted, body.duration_timeout);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    
    this.server.emit('updateListUsers', {channel: body.channel, users: users});
    this.server.emit('timeoutGoodRequest', {channel: body.channel, sessionCookie: body.sessionCookie});
  }
  async checkUserAdminPerms(sessionCookie: string, channel_id: number)
  {
    const user = await this.sessionService.getUser(sessionCookie);
    const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
    if (!relation.isAdmin)
      return (false);
    return (true);
  }
  async checkUserOwnerPerms(sessionCookie: string, channel_id: number)
  {
    const user = await this.sessionService.getUser(sessionCookie);
    const relation = (await this.channelsUsersService.findRelation(user.id, channel_id))[0];
    if (!relation.isOwner)
      return (false);
    return (true);
  }
  async checkAdminPerms(user_id: number, channel_id: number)
  {
    const relation = (await this.channelsUsersService.findRelation(user_id, channel_id))[0];
    if (!relation.isAdmin)
      return (false);
    return (true);
  }
  async checkOwnerPerms(user_id: number, channel_id: number)
  {
    const relation = (await this.channelsUsersService.findRelation(user_id, channel_id))[0];
    if (!relation.isOwner)
      return (false);
    return (true);
  }
}

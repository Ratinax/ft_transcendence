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

  /**
   * Gets the users that are in the channel passed as param
   * 
   * @param body - {channel, sessionCookie}
   * @emits 'updateListUsers' {users, channel}
   */
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
  /**
   * Modify the relation of a user to a channel to set isBanned = true 
   * 
   * @param {Object} body - {channel, userBanned, sessionCookie}
   * @returns result of request
   * @emits updateAfterPart {users, channel, user}
   */
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
  /**
   * Delete the relation of a user to a channel
   * 
   * @param body - {channel, userKicked, sessionCookie}
   * @returns result of request kick
   * @emits updateAfterPart {users, channel, user}
   */
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
  /**
   * Delete the relation of a user to a channel
   * 
   * @param body - {channel, sessionCookie}
   * @returns result of request leave
   * @emits updateAfterPart {users, channel, user}
   */
  @SubscribeMessage('leaveChannel')
  async leaveChannel(@MessageBody() body) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    const user = await this.sessionService.getUser(body.sessionCookie);
    const res = await this.channelsUsersService.leave(body.channel, user);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      body: body.sessionCookie});
    return (res);
  }
  /**
   * set user of channel to Admin
   * 
   * @param body - {channel, userSetAdmin, sessionCookie}
   * @returns result of request
   * @emits updateListUsers {users, channel}
   */
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
  
  /**
   * remove admin rights on a user
   * 
   * @param body - {channel, userRemovedAdmin, sessionCookie}
   * @returns result of request
   * @emits updateListUsers {users, channel}
   */
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
  /**
   * 
   * @param body {userTimeouted, duration_timeout, sessionCookie}
   * @emits timeoutWrongAmount {channel, user}
   * @emits updateListUsers {channel, users}
   * @emits timeoutGoodRequest {channel, user}
   */
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

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChannelsUsersGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelsUsersService: ChannelsUsersService) {}

  /**
   * Gets the users that are in the channel passed as param
   * 
   * @param body - {channel}
   * @emits 'updateListUsers' {users, channel}
   */
  @SubscribeMessage('findUsersOfChannel')
  async findUsersOfChannel(@MessageBody() body) {
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
   * @param {Object} body - {user, channel}
   * @returns result of request
   * @emits updateAfterPart {users, channel, user}
   */
  @SubscribeMessage('banUser')
  async ban(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.ban(body.channel, body.user);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      user: body.user});
    return (res);
  }
  /**
   * Delete the relation of a user to a channel
   * 
   * @param body - {user, channel}
   * @returns result of request kick
   * @emits updateAfterPart {users, channel, user}
   */
  @SubscribeMessage('kickUser')
  async kick(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.leave(body.channel, body.user);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      user: body.user});
    return (res);
  }
  /**
   * Delete the relation of a user to a channel
   * 
   * @param body - {user, channel}
   * @returns result of request leave
   * @emits updateAfterPart {users, channel, user}
   */
  @SubscribeMessage('leaveChannel')
  async leaveChannel(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.leave(body.channel, body.user);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      user: body.user});
    return (res);
  }
  /**
   * set user of channel to Admin
   * 
   * @param body - {channel, user}
   * @returns result of request
   * @emits updateListUsers {users, channel}
   */
  @SubscribeMessage('setAdmin')
  async setAdmin(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.setAdmin(body.channel, body.user);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);

    this.server.emit('updateListUsers', {
      users: users, 
      channel: body.channel});
    return (res);
  }
  
  /**
   * remove admin rights on a user
   * 
   * @param body - {channel, user}
   * @returns result of request
   * @emits updateListUsers {users, channel}
   */
  @SubscribeMessage('removeAdmin')
  async removeAdmin(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.removeAdmin(body.channel, body.user);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);

    this.server.emit('updateListUsers', {
      users: users, 
      channel: body.channel});
    return (res);
  }
  /**
   * 
   * @param body {user, userTimeouted, duration_timeout}
   * @emits timeoutWrongAmount {channel, user}
   * @emits updateListUsers {channel, users}
   * @emits timeoutGoodRequest {channel, user}
   */
  @SubscribeMessage('timeoutUser')
  async timeoutUser(@MessageBody() body)
  {
    if (body.duration_timeout >= 2592000 || body.duration_timeout < 10) // 30 days and 10 seconds
    {
      this.server.emit('timeoutWrongAmount', {channel: body.channel, user: body.user});
      return ;
    }
    await this.channelsUsersService.timeoutUser(body.channel, body.userTimeouted, body.duration_timeout);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    
    this.server.emit('updateListUsers', {channel: body.channel, users: users});
    this.server.emit('timeoutGoodRequest', {channel: body.channel, user: body.user});
  }
}

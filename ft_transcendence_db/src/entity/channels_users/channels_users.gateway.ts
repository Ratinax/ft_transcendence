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
      console.log(e);
    }
  }
  /**
   * Modify the relation of a user to a channel to set isBanned = true 
   * 
   * @param {Object} body - {userBanned, channel}
   * @returns result of request
   * @emits updateAfterBan {users, channel, userBanned}
   */
  @SubscribeMessage('banUser')
  async ban(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.ban(body.channel, body.userBanned);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterBan', {
      users: users, 
      channel: body.channel,
      userBanned: body.userBanned});
    return (res);
  }
  /**
   * Delete the relation of a user to a channel
   * 
   * @param body - {userKicked, channel}
   * @returns result of request kick
   * @emits updateAfterBan {users, channel, userKicked}
   */
  @SubscribeMessage('kickUser')
  async kick(@MessageBody() body) 
  {
    const res = await this.channelsUsersService.kick(body.channel, body.userKicked);
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterKick', {
      users: users, 
      channel: body.channel,
      userKicked: body.userKicked});
    return (res);
  }
}

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChannelGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService) {}

  /**
   * 
   * @param data - {channel, user}
   * @returns responses of request | 'Error'
   * @emits updateListChannels {channel, user}
   */
  @SubscribeMessage('createChannel')
  async create(
    @MessageBody() data: {channel: any, user: any}) {
      const channel = data.channel.channel;
      const user = data.user;
      try 
      {
        const response = await this.channelService.createChannel(channel);
        this.server.emit('updateListChannels', {channel: response, user: user});
        const response2 = await this.channelsUsersService.createNew({
          user: user,
          channel: response,
          isAdmin: true,
          isOwner: true,
          isInvited: false,
        });
        return ({response, response2});
      }
      catch (e)
      {
        return ('Error');
      }
  }
  /**
   * 
   * @param body channel to join {password, channelName, user}
   * 
   * @emits joinNoSuchChannel {user} - in case of failing
   * @emits joinBanned {user} - in case of failing
   * @emits joinAlreadyIn {user} - in case of failing
   * @emits joinWrongPassword {user} - in case of failing
   * @emits updateListChannels {channel, user}
   * @emits joinGoodRequest {channel, user}
   */
  @SubscribeMessage('joinChannel')
  async join(@MessageBody() body)
  {
    const password = body.password;
    const channelName = body.channelName;
    const user = body.user;
    let channel;

    try
    {
      const channels = await this.channelService.findByName(channelName);
      if (!channels || !channels[0])
        throw new InternalServerErrorException('no such channel'); 
      channel = channels[0];
    }
    catch (e)
    {
      this.server.emit('joinNoSuchChannel', {user: user});
    }

    const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);

    if (relation && relation[0])
    {
      if (relation[0].isBanned === true)
        this.server.emit('joinBanned', {user: user})
      else
        this.server.emit('joinAlreadyIn', {user: user})
      return ;
    }
    if (password != channel.password) // TODO comparer avec les mdp hash
    {
      this.server.emit('joinWrongPassword', {user: user})
      return ;
    }
    await this.channelsUsersService.createNew({
      user: user,
      channel: channel,
      isAdmin: false,
      isOwner: false,
      isInvited: false,
    });
    this.server.emit('updateListChannels', {channel: channel, user: user});
    this.server.emit('joinGoodRequest', {channel: channel, user: user});
  }
  // @SubscribeMessage
}

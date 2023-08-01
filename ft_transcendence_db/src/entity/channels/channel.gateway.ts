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
        console.error('une erreur :', e)
        return ('Error');
      }
  }
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
    console.log(channel);
    const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);
    console.log('relation :', relation)
    if (relation && relation[0])
    {
      this.server.emit('joinAlreadyIn', {user: user})
      return ;
    }
    const res = await this.channelsUsersService.createNew({
      user: user,
      channel: channel,
      isAdmin: false,
      isOwner: false,
      isInvited: false,
    });
    this.server.emit('updateListChannels', {channel: channel, user: user});

  }

  @SubscribeMessage('findAllChannels')
  findAll() 
  {
    return this.channelService.findAll();
  }

}

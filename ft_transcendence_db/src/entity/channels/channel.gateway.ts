import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { ChannelsUsers } from '../channels_users/channels_users.entity';
import { Channels } from './channel.entity';


function getWebSocketGatewayOptions() {
  return {
    cors: {
      origin: `http://${ConfigIp.IP}:8080`,
      credentials: true,
    },
  };
}

@WebSocketGateway(3001, getWebSocketGatewayOptions()
)

export class ChannelGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}

  /**
   * Create a channel according to the provided params
   * 
   * @param data data of request
   * @emits updateListChannels {channel: {isADm, name, category, channel_id}, sessionCookie}
   * @emits createGoodRequest {sesssionCookie}
   * @emits createAlreadyExists {sessionCookie}
   * @returns result of request
   */
  @SubscribeMessage('createChannel')
  async create(@MessageBody() data: {sessionCookie: string, channel: {name: string, password: string, category: string}})
  {
    if (await this.sessionService.getIsSessionExpired(data.sessionCookie))
    {
      return ('not connected');
    }
    const user = await this.sessionService.getUser(data.sessionCookie);
    if (!this.createGoodInputs(data.channel, data.sessionCookie))
      return ('input error');
    const channel = data.channel;
    try 
    {
      const response = await this.channelService.createChannel(channel);
      this.server.emit('updateListChannels', {channel: response, sessionCookie: data.sessionCookie});
      const response2 = await this.channelsUsersService.createNew({
        user: user,
        channel: response,
        isAdmin: true,
        isOwner: true,
      });
      this.server.emit('createGoodRequest', {sessionCookie: data.sessionCookie});
      return ({response, response2});
    } 
    catch (e)
    {
      this.server.emit('createAlreadyExists', {sessionCookie: data.sessionCookie});
    }
  }

  /**
   * check if good inputs on channel creation
   * 
   * @param channel channel inputs
   * @param sessionCookie sessionCookie of the user making the request
   * @emits createPasswordOrNameWrongSize {sessionCookie}
   * @emits createWrongCategory {sessionCookie}
   * @emits createNotAllowedChars {sessionCookie}
   * @returns result
   */
  createGoodInputs(channel: {name: string, password: string, category: string}, sessionCookie: string): Boolean
  {
    if (channel.name.length < 3 
      || channel.name.length > 20 ||
      ((channel.password.length < 3 
        || channel.password.length > 20) && channel.category === 'Protected by password'))
    {
      this.server.emit('createPasswordOrNameWrongSize', {sessionCookie: sessionCookie});
      return (false);
    }
    if (channel.category !== 'Private'
    && channel.category !== 'Public'
    && channel.category !== 'Protected by password')
    {
      this.server.emit('createWrongCategory', {sessionCookie: sessionCookie});
      return (false);
    }
    const regex = /^[A-Za-z0-9_.]+$/;
    if (!regex.test(channel.name))
    {
      this.server.emit('createNotAllowedChars', {sessionCookie: sessionCookie});
      return (false);
    }
    return (true);
  }

  /**
   * join channel
   * 
   * @param body channels infos
   * @emits joinNoSuchChannel {sessionCookie}
   * @emits updateListChannels {channel: {channel_id, name} sessionCookie}
   * @emits joinGoodRequest {sessionCookie}
   * @returns result
   */
  @SubscribeMessage('joinChannel')
  async join(@MessageBody() body: {sessionCookie: string, password: string, channelName: string})
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      return ('not connected');
    const user = await this.sessionService.getUser(body.sessionCookie);
    if (!user)
      return ('no such user')

    const channels = await this.channelService.findByName(body.channelName);
    if (!channels || !channels[0])
    {
      this.server.emit('joinNoSuchChannel', {sessionCookie: body.sessionCookie});
      return ;
    }

    const channel = channels[0];
    const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);

    if (!await this.checkJoinGoodInput(relation, body.sessionCookie, channel, body.password))
      return ;

    await this.channelsUsersService.createNew({
      user: user,
      channel: channel,
      isAdmin: false,
      isOwner: false,
    });
    const channelToReturn = {
      channel_id: channel.channel_id,
      name: channel.name,
    }
    this.server.emit('updateListChannels', {channel: channelToReturn, sessionCookie: body.sessionCookie});
    this.server.emit('joinGoodRequest', {sessionCookie: body.sessionCookie});
  }
  /**
   * Check the input of join request
   * 
   * @param relation relation of channelsUsers
   * @param sessionCookie 
   * @param channel 
   * @param password 
   * @emits joinBanned {sessionCookie}
   * @emits joinAlreadyIn {sessionCookie}
   * @emits joinPrivateMode {sessionCookie}
   * @emits joinWrongPassword {sessionCookie}
   * @returns result Boolean
   */
  async checkJoinGoodInput(relation: ChannelsUsers[], sessionCookie: string, channel: Channels, password: string)
  {
    if (relation && relation[0])
    {
      if (relation[0].isBanned === true)
        this.server.emit('joinBanned', {sessionCookie: sessionCookie})
      else
        this.server.emit('joinAlreadyIn', {sessionCookie: sessionCookie})
      return (false);
    }
    if (channel.category === 'Private')
    {
      this.server.emit('joinPrivateMode', {sessionCookie: sessionCookie})
      return (false);
    }
    if (channel.category === 'Protected by password' && !await this.channelService.comparePasswords(channel, password))
    {
      this.server.emit('joinWrongPassword', {sessionCookie: sessionCookie})
      return (false);
    }
    return (true);
  }
  /**
   * Make user leave the channel
   * 
   * @param body sessionCookie and channel
   * @emits updateAfterPart {users, channel, sessionCookie}
   * @returns result
   */
  @SubscribeMessage('leaveChannel')
  async leaveChannel(@MessageBody() body: {sessionCookie: string, channel: {channel_id: number, name: string}}) 
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    const user = await this.sessionService.getUser(body.sessionCookie);
    if (!user)
      return (null);
    const res = await this.channelsUsersService.leave(body.channel, user);
    if (res === 'Empty')
    {
      await this.channelsUsersService.cleanChan(body.channel.name);
      await this.channelService.removeChan(body.channel.channel_id);
    }
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.emit('updateAfterPart', {
      users: users, 
      channel: body.channel,
      sessionCookie: body.sessionCookie});
    return (res);
  }
}

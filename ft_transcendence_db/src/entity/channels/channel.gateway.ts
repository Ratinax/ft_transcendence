import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';

@WebSocketGateway(3001, {
  cors: {
    origin: `http://192.168.1.159:8080`,
    credentials: true,
  },
})
export class ChannelGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}

  /**
   * 
   * @param data - {channel, user, cookie}
   * @returns responses of request | 'Error'
   * @emits updateListChannels {channel, user}
   * @emits createGoodRequest {user}
   * @emits createAlreadyExists  {user} - in case of failing
   * @emits createPasswordOrNameWrongSize {user} - in case of failing
   * @emits createWrongCategory {user} - in case of failing
   */
  @SubscribeMessage('createChannel')
  async create(@MessageBody() data)
  {
    // console.log('data :', data, '\n est expire :', await this.sessionService.getIsSessionExpired(data.sessionCookie))
    if (await this.sessionService.getIsSessionExpired(data.sessionCookie))
    {
      // TODO redirect to log page
      return ('not connected');
    }
    if (!this.createGoodInputs(data.channel, data.user))
      return ('input error');
    const channel = data.channel;
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
      this.server.emit('createGoodRequest', {user: user});
      return ({response, response2});
    }
    catch (e)
    {
      this.server.emit('createAlreadyExists', {user: user});
    }
  }
  /**
   * check if good args for create
   * 
   * @param channel channel
   * @param user user
   * @returns true if succeed
   */
  createGoodInputs(channel, user): Boolean
  {
    if (channel.name.length < 3 
      || channel.name.length > 20 ||
      ((channel.password.length < 3 
        || channel.password.length > 20) && channel.category === 'Protected by password'))
    {
      this.server.emit('createPasswordOrNameWrongSize', {user: user});
      return (false);
    }
    if (channel.category !== 'Private'
    && channel.category !== 'Public'
    && channel.category !== 'Protected by password')
    {
      this.server.emit('createWrongCategory', {user: user});
      return (false);
    }
    return (true);
  }
  /**
   * 
   * @param body channel to join {password, channelName, user, sessionCookie}
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
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      // TODO redirect to log page
      return ('not connected');
    }

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
    if (channel.category === 'Private')
    {
      this.server.emit('joinPrivateMode', {user: user})
      return ;
    }
    if (!await this.channelService.comparePasswords(channel, password))
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
}

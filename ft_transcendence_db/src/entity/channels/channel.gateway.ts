import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';


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
   * 
   * @param data - {channel, cookie}
   * @returns responses of request | 'Error'
   * @emits updateListChannels {channel, user}
   * @emits createGoodRequest {user}
   * @emits createAlreadyExists  {user} - in case of failing
   * @emits createPasswordOrNameWrongSize {user} - in case of failing
   * @emits createWrongCategory {user} - in case of failing
   */
  @SubscribeMessage('createChannel') // TODO handle no special caractere because errors can happend like in : 'ah ouais ??'
  async create(@MessageBody() data)
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
        isInvited: false,
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
   * check if good args for create
   * 
   * @param channel channel
   * @param user user
   * @returns true if succeed
   */
  createGoodInputs(channel, sessionCookie): Boolean
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
    return (true);
  }
  /**
   * 
   * @param body channel to join {password, channelName, sessionCookie}
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
      return ('not connected');
    }
    const user = await this.sessionService.getUser(body.sessionCookie);
    const password = body.password;
    const channelName = body.channelName;
    // const user = body.user;
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
      this.server.emit('joinNoSuchChannel', {sessionCookie: body.sessionCookie});
      return ;
    }

    const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);

    if (relation && relation[0])
    {
      if (relation[0].isBanned === true)
        this.server.emit('joinBanned', {sessionCookie: body.sessionCookie})
      else
        this.server.emit('joinAlreadyIn', {sessionCookie: body.sessionCookie})
        return ;
      }
    if (channel.category === 'Private')
    {
      this.server.emit('joinPrivateMode', {sessionCookie: body.sessionCookie})
      return ;
    }
    if (!await this.channelService.comparePasswords(channel, password))
    {
      this.server.emit('joinWrongPassword', {sessionCookie: body.sessionCookie})
      return ;
    }
    await this.channelsUsersService.createNew({
      user: user,
      channel: channel,
      isAdmin: false,
      isOwner: false,
      isInvited: false,
    });
    console.log(channel);
    const channelToReturn = {
      channel_id: channel.channel_id,
    }
    this.server.emit('updateListChannels', {channel: channelToReturn, sessionCookie: body.sessionCookie});
    this.server.emit('joinGoodRequest', {sessionCookie: body.sessionCookie});
  }
}

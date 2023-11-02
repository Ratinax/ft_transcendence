import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server, Socket } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { ChannelsUsers } from '../channels_users/channels_users.entity';
import { Channels } from './channel.entity';
import { MessageService } from '../messages/message.service';

@WebSocketGateway({
    cors: {
      origin: `http://${ConfigIp.IP}:8080`,
      credentials: true,
    },
	namespace: 'chat'
  })

export class ChannelGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelService: ChannelService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly messageService: MessageService) {}


  @SubscribeMessage('createChannel')
  async create(@ConnectedSocket() client: Socket, @MessageBody() data: {sessionCookie: string, channel: {name: string, password: string, category: string}})
  {
    if (await this.sessionService.getIsSessionExpired(data.sessionCookie))
    {
      return ('not connected');
    }
    const user = await this.sessionService.getUser(data.sessionCookie);
    if (!user)
      return ('not connected')
    if (!this.createGoodInputs(data.channel, client))
      return ('input error');
    const channel = data.channel;
    try
    {
      const response = await this.channelService.createChannel(channel);
      this.server.to(client.id).emit('addChannel', {channel: {...response, isUserOwner: true}});
      const response2 = await this.channelsUsersService.createNew({
        user: user,
        channel: response,
        isAdmin: true,
        isOwner: true,
      });
      client.join(channel.name);
      this.server.to(client.id).emit('createGoodRequest');
    } 
    catch (e)
    {
      this.server.to(client.id).emit('createAlreadyExists');
    }
  }


  createGoodInputs(channel: {name: string, password: string, category: string}, client: Socket): Boolean
  {
    if (channel.name.length < 3 
      || channel.name.length > 20 ||
      ((channel.password.length < 3 
        || channel.password.length > 20) && channel.category === 'Protected by password'))
    {
      this.server.to(client.id).emit('createPasswordOrNameWrongSize');
      return (false);
    }
    if (channel.category !== 'Private'
    && channel.category !== 'Public'
    && channel.category !== 'Protected by password')
    {
      this.server.to(client.id).emit('createWrongCategory');
      return (false);
    }
    const regex = /^[A-Za-z0-9_\- ]+$/;
    if (!regex.test(channel.name))
    {
      this.server.to(client.id).emit('createNotAllowedChars');
      return (false);
    }
    return (true);
  }

  @SubscribeMessage('joinChannel')
  async join(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, password: string, channelName: string})
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      return ('not connected');

    const user = await this.sessionService.getUser(body.sessionCookie);
    const regex = /^[A-Za-z0-9_\- ]+$/;
    if (!user)
    {
      this.server.to(client.id).emit('joinNotConnected');
      return ('not connected')
    }
    if (!regex.test(body.channelName))
    {
      this.server.to(client.id).emit('joinNotGoodChars');
      return ('notGoodChars');
    }
    
    const channels = await this.channelService.findByName(body.channelName);
    if (!channels || !channels[0])
    {
      this.server.to(client.id).emit('joinNoSuchChannel');
      return ;
    }

    const channel = channels[0];
    const relation = await this.channelsUsersService.findRelation(user.id, channel.channel_id);

    if (!await this.checkJoinGoodInput(relation, client, channel, body.password))
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
    const users = await this.channelsUsersService.findUsersOfChannel(channel.name);

    this.server.to(client.id).emit('addChannel', {channel: {...channelToReturn, isUserOwner: false}});
    this.server.to(channel.name).emit('updateListUsers', {users: users});
    client.join(channel.name);
    this.server.to(client.id).emit('joinGoodRequest', {channel: {...channelToReturn, isUserOwner: false}});
  }

  async checkJoinGoodInput(relation: ChannelsUsers[], client: Socket, channel: Channels, password: string)
  {
    if (relation && relation[0])
    {
      if (relation[0].isBanned === true)
        this.server.to(client.id).emit('joinBanned')
      else
        this.server.to(client.id).emit('joinAlreadyIn')
      return (false);
    }
    if (channel.category === 'Private')
    {
      this.server.to(client.id).emit('joinPrivateMode')
      return (false);
    }
    if (channel.category === 'Protected by password' && !await this.channelService.comparePasswords(channel, password))
    {
      this.server.to(client.id).emit('joinWrongPassword')
      return (false);
    }
    return (true);
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, channel: {channel_id: number, name: string}}) 
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
      await this.messageService.cleanMessages(body.channel.channel_id);
      await this.channelsUsersService.cleanChan(body.channel.name);
      await this.channelService.removeChan(body.channel.channel_id);
    }
    const users = await this.channelsUsersService.findUsersOfChannel(body.channel.name);
    this.server.to(body.channel.name).except(client.id).emit('updateAfterPart', {
      users: users,
      sessionCookie: body.sessionCookie});
    this.server.to(client.id).emit('updateAfterPart', {
      users: users,
      sessionCookie: body.sessionCookie});
    const messageRemoved = await this.messageService.removeGameInvite(user.pseudo);
    if (messageRemoved)
      this.server.to(body.channel.name).emit('removeMessage', {message_id: messageRemoved.id});
    console.log(res);
    return (res);
  }
  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() body: {channelName: string, sessionCookie: string})
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    const user = await this.sessionService.getUser(body.sessionCookie);
    if (!user)
      return (null);
    const relation = await this.channelsUsersService.findRelationByCName(user.id, body.channelName);
    if (!relation || !relation[0])
      return ('not authorized');
    client.leave(body.channelName)
  }
  @SubscribeMessage('joinRoom')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: {channelName: string, sessionCookie: string})
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    {
      return ('not connected');
    }
    const user = await this.sessionService.getUser(body.sessionCookie);
    if (!user)
      return (null);
    const relation = await this.channelsUsersService.findRelationByCName(user.id, body.channelName);
    if (!relation || !relation[0])
      return ('not authorized');
    client.join(body.channelName)
  }
}

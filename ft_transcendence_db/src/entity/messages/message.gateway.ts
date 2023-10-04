import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { BlockshipService } from '../blockships/blockship.service';
import { Channels } from '../channels/channel.entity';

@WebSocketGateway(3001, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly blockshipService: BlockshipService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() body: {sessionCookie: string, channel_id: number, dateSent: Date, message: string, isAGameInvite: boolean}) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      if (!user)
        return ('not connected');

      const relation = (await this.channelsUsersService.findRelation(user.id, body.channel_id))[0];
      if (!relation)
        return ('no such relation');

      if (relation.channel.isADm && await this.isBlockedRelation(relation))
      {
        this.server.emit('sendMessageBlocked', {sessionCookie: body.sessionCookie})
        return ;
      }
      else if (relation.channel.isADm && !(await this.isBlockedRelation(relation)))
      {
        this.unHide(user.id, relation.channel);
      }
      const timeoutDate = new Date(relation.dateTimeout);
      const currentDate = new Date(body.dateSent);
      const timeoutDuration = relation.durationTimeout;

      const timeoutSeconds = timeoutDate.getTime() / 1000;
      const currentSeconds = currentDate.getTime() / 1000;
      
      if (timeoutSeconds + +timeoutDuration > currentSeconds)
      {
        this.server.emit('sendMessageTimeout', {sessionCookie: body.sessionCookie, duration: timeoutSeconds + +timeoutDuration - currentSeconds})
        return 'user timeout';
      }

      await this.messagesService.post({
        content: body.message,
        dateSent: body.dateSent,
        channel: {channel_id: body.channel_id},
        user: {
          ...user,
        },
        isAGameInvite: body.isAGameInvite,
      });
      
      this.server.emit('updateMessage', {channel_id: body.channel_id});
      this.server.emit('sendMessageGoodRequest', {channel_id: body.channel_id, sessionCookie: body.sessionCookie});
  }
  async unHide(user_id: number, channel: Partial<Channels>)
  {
    const users = await this.channelsUsersService.findUsersOfChannel(channel.name);
      for (let i = 0; i < users.length; i++)
      {
        if (users[i].id !== user_id)
        {
          await this.channelsUsersService.unHide(users[i].id, channel.channel_id);
          break ;
        }
      }
  }
  async isBlockedRelation(relation: {channel: Partial<Channels>})
  {
    const users = await this.channelsUsersService.findUsersOfChannel(relation.channel.name);
    if (!users)
      return (false);
    const result = await this.blockshipService.getIsBlocked(users[0].id, users[1].id);
    const result2 = await this.blockshipService.getIsBlocked(users[1].id, users[0].id);
    if (result || result2)
      return (true);
    return (false);
  }
}

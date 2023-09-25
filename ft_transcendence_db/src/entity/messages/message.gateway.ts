import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway(3001, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService) {}

  /**
   * create a new message
   * 
   * @param body - {channel_id, message, dateSent, isAGameInvite, sessionCookie}
   * @returns response of request
   * @emits 'updateMessage' {channel_id}
   * @emits 'sendMessageTimeout' {channel_id, user_id, duration}
   * @emits 'sendMessageGoodRequest {channel_id, user_id}
   * @throws new InternalServerErrorException('no such relation')
   */
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() body) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      
      const relation = (await this.channelsUsersService.findRelation(user.id, body.channel_id))[0];
      if (!relation)
        throw new InternalServerErrorException('no such relation');

      if (relation.channel.isADm)
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
        this.server.emit('sendMessageTimeout', {channel_id: body.channel_id, sessionCookie: body.sessionCookie, duration: timeoutSeconds + +timeoutDuration - currentSeconds})
        return 'user timeout';
      }

      const response = await this.messagesService.post({
        content: body.message,
        dateSent: body.dateSent,
        channel: body.channel_id,
        user: {
          ...user,
        },
        isAGameInvite: body.isAGameInvite,
      });
      
      this.server.emit('updateMessage', {channel_id: body.channel_id});
      this.server.emit('sendMessageGoodRequest', {channel_id: body.channel_id, sessionCookie: body.sessionCookie});

      return response;
  }
  async unHide(user_id: number, channel)
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
}

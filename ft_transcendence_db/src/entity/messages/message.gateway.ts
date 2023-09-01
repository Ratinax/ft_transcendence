import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
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
      
      const relation = await this.channelsUsersService.findRelation(user.id, body.channel_id);
      if (!relation || !relation[0])
        throw new InternalServerErrorException('no such relation');
      
      const timeoutDate = new Date(relation[0].dateTimeout);
      const currentDate = new Date(body.dateSent);
      const timeoutDuration = relation[0].durationTimeout;

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
          password: 'random useless string', // TODO seems like we can put a random useless string
        },
        isAGameInvite: body.isAGameInvite,
      });
      
      this.server.emit('updateMessage', {channel_id: body.channel_id});
      this.server.emit('sendMessageGoodRequest', {channel_id: body.channel_id, sessionCookie: body.sessionCookie});

      return response;
  }
}

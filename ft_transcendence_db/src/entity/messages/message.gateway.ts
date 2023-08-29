import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway(3002, {
  cors: {
    origin: `http://192.168.1.159:8080`,
    credentials: true,
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService, private readonly channelsUsersService: ChannelsUsersService) {}

  /**
   * create a new message
   * 
   * @param body - {channel_id, user_id, message, dateSent, isAGameInvite}
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
      const relation = await this.channelsUsersService.findRelation(body.user_id, body.channel_id);
      if (!relation || !relation[0])
        throw new InternalServerErrorException('no such relation');
      
      const timeoutDate = new Date(relation[0].dateTimeout);
      const currentDate = new Date(body.dateSent);
      const timeoutDuration = relation[0].durationTimeout;

      const timeoutSeconds = timeoutDate.getTime() / 1000;
      const currentSeconds = currentDate.getTime() / 1000;

      if (timeoutSeconds + +timeoutDuration > currentSeconds)
      {
        this.server.emit('sendMessageTimeout', {channel_id: body.channel_id, user_id: body.user_id, duration: timeoutSeconds + +timeoutDuration - currentSeconds})
        return 'user timeout';
      }

      const response = await this.messagesService.post({
        content: body.message,
        dateSent: body.dateSent,
        channel: body.channel_id,
        user: body.user_id,
        isAGameInvite: body.isAGameInvite,
      });
      
      this.server.emit('updateMessage', {channel_id: body.channel_id});
      this.server.emit('sendMessageGoodRequest', {channel_id: body.channel_id, user_id: body.user_id});

      return response;
  }
}

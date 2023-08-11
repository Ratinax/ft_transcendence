import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService, private readonly channelsUsersService: ChannelsUsersService) {}

  /**
   * create a new message
   * 
   * @param body {channel, user, message, dateSent}
   * @returns response of request
   * @emits 'updateMessage' {channel_id}
   * @throws new InternalServerErrorException('no such relation')
   */
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() body) 
    {
      console.log(body);
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
      });
      
      this.server.emit('updateMessage', {channel_id: body.channel_id});

      return response;
  }
}

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { Messages } from './message.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService) {}

  /**
   * create a new message
   * 
   * @param message message to be created
   * @returns response of request
   * @emits 'updateMessage' {channel_id}
   */
  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() message: Messages) {
    const response = await this.messagesService.post(message);
    
    this.server.emit('updateMessage', {channel_id: message.channel});

    return response;
  }
}

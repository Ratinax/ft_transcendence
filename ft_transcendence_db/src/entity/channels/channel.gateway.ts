import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelService } from './channel.service';
import { Server } from 'socket.io';
import { Channels } from './channel.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChannelGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelService: ChannelService) {}

  @SubscribeMessage('createChannel')
  async create(
    @MessageBody() channel: Channels) {
      try 
      {
        const response = await this.channelService.createChannel(channel);
        this.server.emit('updateChannel', response);
        return (response);
      }
      catch (e)
      {
        return ('Error');
      }
    
  }

  @SubscribeMessage('findAllChannels')
  findAll() {
    return this.channelService.findAll();
  }

}

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChannelsUsersService } from './channels_users.service';
import { Server } from 'socket.io';
import { Channels } from '../channels/channel.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChannelsUsersGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly channelsUsersService: ChannelsUsersService) {}

  @SubscribeMessage('findUsersOfChannel')
  async findUsersOfChannel(@MessageBody() channel: Channels) {
    try 
    {
        const res = await this.channelsUsersService.findUsersOfChannel(channel.name);
        this.server.emit('listUsers', res);
    }
    catch (e)
    {
        // console.log(e);
    }
  }

}

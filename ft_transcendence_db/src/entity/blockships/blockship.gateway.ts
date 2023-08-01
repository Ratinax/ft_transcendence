import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { BlockshipService } from './blockship.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BlockshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly blockshipService: BlockshipService) {}

    @SubscribeMessage('removeBlockship')
    async refuseBlockship(@MessageBody() body) 
    {
        // console.log(body);
        const res = await this.blockshipService.deleteBlockship(body.userblocking_id, body.userblocked_id);
        this.server.emit('deleteBlockship', res);
    }
}

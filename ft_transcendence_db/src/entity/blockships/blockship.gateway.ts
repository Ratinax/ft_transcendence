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

    /**
     * remove blockship
     * 
     * @param body blockship to be removed {userblocking_id, userblocked_id}
     * @emits deleteBlockship result of request
     */
    @SubscribeMessage('removeBlockship')
    async refuseBlockship(@MessageBody() body) 
    {
        const res = await this.blockshipService.deleteBlockship(body.userblocking_id, body.userblocked_id);
        this.server.emit('deleteBlockship', res);
    }
}

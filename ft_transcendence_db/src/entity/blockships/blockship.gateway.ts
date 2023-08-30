import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { BlockshipService } from './blockship.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';

@WebSocketGateway(3002, {
  cors: {
    origin: `http://192.168.1.159:8080`,
    credentials: true,
  },
})
export class BlockshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService) {
    }

    /**
     * remove blockship
     * 
     * @param body blockship to be removed {userblocking_id, userblocked_id, sessionCookie}
     * @emits deleteBlockship result of request
     */
    @SubscribeMessage('removeBlockship')
    async refuseBlockship(@MessageBody() body) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        // TODO redirect to log page
        return ('not connected');
      }
        const res = await this.blockshipService.deleteBlockship(body.userblocking_id, body.userblocked_id);
        this.server.emit('deleteBlockship', res);
    }
}

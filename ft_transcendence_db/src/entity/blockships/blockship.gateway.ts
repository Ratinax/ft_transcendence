import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { BlockshipService } from './blockship.service';
import { Server } from 'socket.io';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway(3002, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
})
export class BlockshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService) {
    }

    @SubscribeMessage('removeBlockship')
    async refuseBlockship(@MessageBody() body) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      await this.blockshipService.deleteBlockship(user.id, body.userblocked_id);
      this.server.emit('deleteBlockship', {sessionCookie: body.sessionCookie});
    }
}

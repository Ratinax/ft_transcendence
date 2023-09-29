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

    /**
     * remove blockship
     * 
     * @param body sessionCookie of user making request and user blocked
     * @returns 
     */
    @SubscribeMessage('removeBlockship')
    async refuseBlockship(@MessageBody() body: {sessionCookie: string, userblocked_id: number}) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      if (!user)
        return (null);
      await this.blockshipService.deleteBlockship(user.id, body.userblocked_id);
      this.server.emit('deleteBlockship', {sessionCookie: body.sessionCookie});
    }
}

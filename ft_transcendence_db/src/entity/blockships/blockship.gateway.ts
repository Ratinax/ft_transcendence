import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { BlockshipService } from './blockship.service';
import { Server, Socket } from 'socket.io';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { BadGatewayException, UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
  namespace: 'relation'
})
export class BlockshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly blockshipService: BlockshipService, private readonly sessionService: SessionService) {
    }

    @SubscribeMessage('removeBlockship')
    async refuseBlockship(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, userblocked_id: number}) 
    {
		if (!body || !body.sessionCookie || !body.userblocked_id)
			return ;
    	if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    	{
    	  throw new UnauthorizedException('You are not connected');
    	}
    	const user = await this.sessionService.getUser(body.sessionCookie);
    	if (!user)
    	  throw new BadGatewayException('User not found');
    	await this.blockshipService.deleteBlockship(user.id, body.userblocked_id);
    	this.server.to(client.id).emit('deleteBlockship');
    	return (true); 
    }
}

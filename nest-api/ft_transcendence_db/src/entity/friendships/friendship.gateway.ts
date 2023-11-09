import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendshipService } from './friendship.service';
import { Server, Socket } from 'socket.io';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway({
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
  namespace: 'relation'
})
export class FriendshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly friendshipService: FriendshipService, private readonly sessionService: SessionService) {}

    @SubscribeMessage('acceptFriendship')
    async acceptFriendship(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, friend_id: number}) 
    {
		if (!body || !body.sessionCookie || !body.friend_id)
			return ;
    	if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    	{
    	  throw new UnauthorizedException('You are not connected');
    	}
    	const user = await this.sessionService.getUser(body.sessionCookie);
    	if (!user)
    	  throw new BadRequestException('Ressource not found');
    	await this.friendshipService.acceptFriendship(user.id, body.friend_id);
    	this.server.to(client.id).emit('acceptFriendship');
    }

    @SubscribeMessage('removeFriendship')
    async removeFriendship(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string, friend_id: number}) 
    {
		if (!body || !body.sessionCookie || !body.friend_id)
			return ;
    	if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
    	{
    	  throw new UnauthorizedException('You are not connected');
    	}
    	const user = await this.sessionService.getUser(body.sessionCookie);
    	if (!user)
    	  throw new BadRequestException('Ressource not found');
    	try
    	{
    	  await this.friendshipService.deleteFriendship(body.friend_id, user.id);
    	  this.server.to(client.id).emit('deleteFriendship');
    	}
    	catch (e)
    	{
    	  throw new BadRequestException(e);
    	}
    }
}

import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway(3002, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
})
export class FriendshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly friendshipService: FriendshipService, private readonly sessionService: SessionService) {}

    @SubscribeMessage('acceptFriendship')
    async acceptFriendship(@MessageBody() body: {sessionCookie: string, friend_id: number}) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      if (!user)
        return (null);
      await this.friendshipService.acceptFriendship(user.id, body.friend_id);
      this.server.emit('acceptFriendship', {sessionCookie: body.sessionCookie});
    }

    @SubscribeMessage('removeFriendship')
    async removeFriendship(@MessageBody() body: {sessionCookie: string, friend_id: number}) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      if (!user)
        return (null);
      try
      {
        await this.friendshipService.deleteFriendship(body.friend_id, user.id);
        this.server.emit('deleteFriendship', {sessionCookie: body.sessionCookie});
      }
      catch (e)
      {
        throw new InternalServerErrorException(e);
      }
    }
}

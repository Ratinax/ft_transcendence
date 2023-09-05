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

    /**
     * makes a request to accept a friend request
     * 
     * @param body - {friend_id}
     * @emits 'acceptFriendship' with the result of the request as content
     */
    @SubscribeMessage('acceptFriendship')
    async acceptFriendship(@MessageBody() body) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      await this.friendshipService.acceptFriendship(user.id, body.friend_id);
      this.server.emit('acceptFriendship', {sessionCookie: body.sessionCookie});
    }
    /**
     * makes a request to remove a friendShip (the friendship can be either accepted or pending)
     * 
     * @param body - {friend_id}
     * @emits 'deleteFriendship' with the result of the request as content
     * @throws InternalServerErrorException when error in request
     */
    @SubscribeMessage('removeFriendship')
    async removeFriendship(@MessageBody() body) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
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

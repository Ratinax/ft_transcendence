import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';

@WebSocketGateway(3002, {
  cors: {
    origin: `http://192.168.1.159:8080`,
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
        // TODO redirect to log page
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      const res = await this.friendshipService.acceptFriendship(body.friend_id, user.id);
      this.server.emit('acceptFriendship', res);
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
        // TODO redirect to log page
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      try
      {
        const res = await this.friendshipService.deleteFriendship(body.friend_id, user.id);
        this.server.emit('deleteFriendship', res);
      }
      catch (e)
      {
        throw new InternalServerErrorException(e);
      }
    }
}

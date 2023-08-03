import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';
import { InternalServerErrorException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly friendshipService: FriendshipService) {}

    /**
     * makes a request to accept a friend request
     * 
     * @param body - {friend_id, user_id}
     * @emits 'acceptFriendship' with the result of the request as content
     */
    @SubscribeMessage('acceptFriendship')
    async acceptFriendship(@MessageBody() body) 
    {
        const res = await this.friendshipService.acceptFriendship(body.friend_id, body.user_id);
        this.server.emit('acceptFriendship', res);
    }
    /**
     * makes a request to remove a friendShip (the friendship can be either accepted or pending)
     * 
     * @param body - {friend_id, user_id}
     * @emits 'deleteFriendship' with the result of the request as content
     * @throws InternalServerErrorException when error in request
     */
    @SubscribeMessage('removeFriendship')
    async removeFriendship(@MessageBody() body) 
    {
      try
      {
        const res = await this.friendshipService.deleteFriendship(body.friend_id, body.user_id);
        this.server.emit('deleteFriendship', res);
      }
      catch (e)
      {
        throw new InternalServerErrorException(e);
      }
    }
}

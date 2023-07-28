import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';
import { Friendships } from './friendship.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly friendshipService: FriendshipService) {}

    @SubscribeMessage('accept')
    async acceptFriendship(@MessageBody() body) 
    {
        const res = await this.friendshipService.acceptFriendship(body.friend_id, body.user_id);
        this.server.emit('acceptFriendship', res);
    }
    @SubscribeMessage('refuse')
    @SubscribeMessage('delete')
    async refuseFriendship(@MessageBody() body) 
    {
        const res = await this.friendshipService.deleteFriendship(body.friend_id, body.user_id);
        this.server.emit('deleteFriendship', res);
    }
}

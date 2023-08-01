import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { FriendshipService } from './friendship.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendshipGateway {

    @WebSocketServer()
    server: Server;

    constructor(private readonly friendshipService: FriendshipService) {}

    @SubscribeMessage('acceptFriendship')
    async acceptFriendship(@MessageBody() body) 
    {
        const res = await this.friendshipService.acceptFriendship(body.friend_id, body.user_id);
        this.server.emit('acceptFriendship', res);
    }
    @SubscribeMessage('removeFriendship')
    async removeFriendship(@MessageBody() body) 
    {
        const res = await this.friendshipService.deleteFriendship(body.friend_id, body.user_id);
        this.server.emit('deleteFriendship', res);
    }
}

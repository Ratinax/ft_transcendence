import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { ConfigIp } from 'src/config-ip';
import { Socket } from 'socket.io';
import { UserService } from '../users/user.service';
import { FriendshipService } from '../friendships/friendship.service';

@WebSocketGateway({
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
  namespace: 'session'
})
export class SessionGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    constructor(private readonly sessionService: SessionService, private readonly friendshipService: FriendshipService, private readonly userService: UserService) {
    }
    onModuleInit() {
        this.pingUsersThread();
    }

    pingUsersThread() {
        setInterval(() => {
            this.pingUsers();
        }, 7500);
    }
    async pingUsers()
    {
        setTimeout(async () =>
        {
            this.server.emit('pingAlive');
        }, 2500)
        setTimeout(async () =>
        {
            this.server.emit('pingAlive');
        }, 5000)
        setTimeout(async () =>
        {
            const res = await this.sessionService.removeNoMoreConnected();

            const noMoreConnected = res.noMoreConnected;
            const connected = res.connected;
            for (let i = 0; i < noMoreConnected.length; i++)
            {       
                this.server.to('statuOfUser:' + noMoreConnected[i]).emit('noMoreConnected', {pseudo: noMoreConnected[i]});
            }
            for (let i = 0; i < connected.length; i++)
            {
                this.server.to('statuOfUser:' + noMoreConnected[i]).emit('isConnected', {pseudo: connected[i]});
            }
        }, 7500)
    }
    @SubscribeMessage('pingBack')
    async pingBack(@ConnectedSocket() client: Socket, @MessageBody() body: {sessionCookie: string})
    {
        if (!body || await this.sessionService.getIsSessionExpired(body.sessionCookie))
    	{
            this.server.to(client.id).emit('notGoodCookie');
            return (null);
    	}
        const user = await this.sessionService.getUser(body.sessionCookie);
        this.sessionService.updateSession({id: client.id, sessionCookie: body.sessionCookie, pseudo: user.pseudo});
        this.server.to('statuOfUser:' + user.pseudo).emit('isConnected', {pseudo: user.pseudo});
    }
    @SubscribeMessage('joinRoomFriendStatu')
    async joinRoomFriendStatu(@ConnectedSocket() client: Socket, @MessageBody() body: {pseudo: string, sessionCookie: string})
    {
        if (!body || !body.pseudo || !body.sessionCookie || await this.sessionService.getIsSessionExpired(body.sessionCookie))
    	{
            return (null);
    	}
        const user = await this.sessionService.getUser(body.sessionCookie);
        const friend = (await this.userService.getUser(body.pseudo));
        if (!friend)
        	return (null);
        try
        {
            const resFriend = await this.friendshipService.getFriendRelation(friend.id, user.id);
            if (!resFriend || resFriend !== 'accepted')
                return ('cannot do that because not friend');
        }
        catch
        {
            return ('cannot do that because not friend');
        }
        client.join('statuOfUser:' + body.pseudo);
    }
}

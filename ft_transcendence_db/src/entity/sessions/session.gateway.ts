import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Server } from 'socket.io';
import { InternalServerErrorException, OnModuleInit, Req } from '@nestjs/common';
import { ConfigIp } from 'src/config-ip';

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

    constructor(private readonly sessionService: SessionService) {
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
                this.server.emit('noMoreConnected', {pseudo: noMoreConnected[i]});
            }
            for (let i = 0; i < connected.length; i++)
            {
                this.server.emit('isConnected', {pseudo: connected[i]});
            }
        }, 7500)
    }
}

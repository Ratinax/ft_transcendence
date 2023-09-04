import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Server } from 'socket.io';
import { InternalServerErrorException, OnModuleInit, Req } from '@nestjs/common';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway(3003, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
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
        }, 5000);
    }
    async pingUsers()
    {
        setTimeout(async () => 
        {
            this.server.emit('pingAlive');
        }, 2500)
        setTimeout(async () => 
        {
            await this.sessionService.removeNoMoreConnected();
        }, 5000)
    }
}
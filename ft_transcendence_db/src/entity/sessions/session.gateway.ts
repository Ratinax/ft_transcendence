import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { ConfigIp } from 'src/config-ip';
import { MessageService } from '../messages/message.service';

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

    constructor(private readonly sessionService: SessionService, private readonly messageService: MessageService) {
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
                // const message = await this.messageService.removeGameInvite(noMoreConnected[i]);
                console.log
                // if (message)
                //     this.messageGateway.removeGameInviteOfDisconnected({message_id: message.id, channelName: message.channel.name});
                this.server.emit('noMoreConnected', {pseudo: noMoreConnected[i]});
            }
            for (let i = 0; i < connected.length; i++)
            {
                this.server.emit('isConnected', {pseudo: connected[i]});
            }
        }, 7500)
    }
}

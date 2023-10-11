import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { ConfigIp } from 'src/config-ip';
import { SessionService } from '../sessions/session.service';

@WebSocketGateway(3004, {
	cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
	}
})
export class GamesGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly gameService: GameService, private readonly sessionService: SessionService) {}

	updateGameFromIndex(index: number) {
		const	updateData = this.gameService.games[index].update();
		this.server.to(this.gameService.games[index].player.socket).emit('update', {update: updateData});
		this.server.to(this.gameService.games[index].opponent.socket).emit('update', {update: updateData});
	}

	@SubscribeMessage('quickPlay')
	quickPlay(@ConnectedSocket() client: Socket, @MessageBody() body) {
		if (this.gameService.getGameIndexFromSocket(client.id) === -1)
		{
			this.sessionService.getUser(body.sessionKey).then(res => {
				const	options = this.gameService.joinQuickPlay(res.id, body.name, body.mode, client.id);
				this.server.to(client.id).emit('joinGame', options);

				const	gameIndex = this.gameService.getGameIndexFromSocket(client.id);
				if (this.gameService.games[gameIndex].isFull)
				{
					this.server.to(this.gameService.games[gameIndex].player.socket).emit('full', {opponentName: this.gameService.games[gameIndex].opponent.name, opponentSide: this.gameService.games[gameIndex].opponent.side});
					this.server.to(this.gameService.games[gameIndex].opponent.socket).emit('full', {opponentName: this.gameService.games[gameIndex].player.name, opponentSide: this.gameService.games[gameIndex].player.side});
				}
			});
		}
	}

	@SubscribeMessage('updateSocket')
	updateSocket(@ConnectedSocket() client: Socket, @MessageBody() body) {
		this.sessionService.getUser(body.sessionKey).then(res => {
			const	gameIndex = this.gameService.getGameIndexFromId(res.id);

			if (gameIndex === -1)
				return ;
			if (this.gameService.games[gameIndex].player.id === res.id)
				this.gameService.games[gameIndex].player.socket = client.id;
			else if (this.gameService.games[gameIndex].opponent.id === res.id)
				this.gameService.games[gameIndex].opponent.socket = client.id;
		});
	}

	@SubscribeMessage('state')
	async updateGame(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gameService.getGameIndexFromSocket(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].player.socket === client.id)
			this.gameService.games[gameIndex].player.racket.y = body.pos;
		else
			this.gameService.games[gameIndex].opponent.racket.y = body.pos;
		this.updateGameFromIndex(gameIndex);
	}

}

import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway(3004, {
	cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
	}
})
export class GamesGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly gameService: GameService) {
		
	}

	updateGameFromIndex(index: number) {
		const	updateData = this.gameService.games[index].update();
		this.server.to(this.gameService.games[index].player.id).emit('update', {update: updateData});
		this.server.to(this.gameService.games[index].opponent.id).emit('update', {update: updateData});
	}

	@SubscribeMessage('quickPlay')
	quickPlay(@ConnectedSocket() client: Socket, @MessageBody() body) {
		console.log('join queue')
		if (this.gameService.getGameIndex(client.id) === -1)
		{
			const	options = this.gameService.joinQuickPlay(client.id, body.name, body.mode);
			this.server.to(client.id).emit('joinGame', options);
		}
		const	gameIndex = this.gameService.getGameIndex(client.id);
		if (this.gameService.games[gameIndex].isFull)
		{
			this.server.to(this.gameService.games[gameIndex].player.id).emit('full', {opponentName: this.gameService.games[gameIndex].opponent.name, opponentSide: this.gameService.games[gameIndex].opponent.side});
			this.server.to(this.gameService.games[gameIndex].opponent.id).emit('full', {opponentName: this.gameService.games[gameIndex].player.name, opponentSide: this.gameService.games[gameIndex].player.side});
		}
	}
	


	@SubscribeMessage('state')
	async updateGame(@ConnectedSocket() client: Socket, @MessageBody() body) {
		console.log(body);
		console.log('update');
		console.log(client.id);
		const	gameIndex = this.gameService.getGameIndex(client.id);
		console.log(gameIndex);
		if (this.gameService.games[gameIndex].player.id === client.id)
			this.gameService.games[gameIndex].player.racket.y = body.pos;
		else
			this.gameService.games[gameIndex].opponent.racket.y = body.pos;
		this.updateGameFromIndex(gameIndex);
	}

}

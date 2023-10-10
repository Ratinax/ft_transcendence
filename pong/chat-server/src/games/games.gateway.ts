import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*'
	}
})
export class GamesGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly gamesService: GamesService) {
		
	}

	updateGameFromIndex(index: number) {
		const	updateData = this.gamesService.games[index].update();
		this.server.to(this.gamesService.games[index].player.id).emit('update', {update: updateData});
		this.server.to(this.gamesService.games[index].opponent.id).emit('update', {update: updateData});
	}

	@SubscribeMessage('quickPlay')
	quickPlay(@ConnectedSocket() client: Socket, @MessageBody() body) {
		if (this.gamesService.getGameIndex(client.id) === -1)
		{
			const	options = this.gamesService.joinQuickPlay(client.id, body.name, body.mode);
			this.server.to(client.id).emit('join', options);
		}
		const	gameIndex = this.gamesService.getGameIndex(client.id);
		if (this.gamesService.games[gameIndex].isFull)
		{
			this.server.to(this.gamesService.games[gameIndex].player.id).emit('full', {opponentName: this.gamesService.games[gameIndex].opponent.name, opponentSide: this.gamesService.games[gameIndex].opponent.side});
			this.server.to(this.gamesService.games[gameIndex].opponent.id).emit('full', {opponentName: this.gamesService.games[gameIndex].player.name, opponentSide: this.gamesService.games[gameIndex].player.side});
		}
	}
	
	@SubscribeMessage('')
	joinGame() {
		
	}

	@SubscribeMessage('ready')
	ready() {

	}

	@SubscribeMessage('startGame')
	startGame() {

	}

	@SubscribeMessage('state')
	async updateGame(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gamesService.getGameIndex(client.id);
		if (this.gamesService.games[gameIndex].player.id === client.id)
			this.gamesService.games[gameIndex].player.racket.y = body.pos;
		else
			this.gamesService.games[gameIndex].opponent.racket.y = body.pos;
		this.updateGameFromIndex(gameIndex);
	}

	@SubscribeMessage('endGame')
	endGame(@ConnectedSocket() client: Socket) {
		
	}
}

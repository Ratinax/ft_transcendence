import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*'
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
		if (this.gameService.getGameIndex(client.id) === -1)
		{
			const	options = this.gameService.joinQuickPlay(client.id, body.name, body.mode);
			this.server.to(client.id).emit('join', options);
		}
		const	gameIndex = this.gameService.getGameIndex(client.id);
		if (this.gameService.games[gameIndex].isFull)
		{
			this.server.to(this.gameService.games[gameIndex].player.id).emit('full', {opponentName: this.gameService.games[gameIndex].opponent.name, opponentSide: this.gameService.games[gameIndex].opponent.side});
			this.server.to(this.gameService.games[gameIndex].opponent.id).emit('full', {opponentName: this.gameService.games[gameIndex].player.name, opponentSide: this.gameService.games[gameIndex].player.side});
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
		const	gameIndex = this.gameService.getGameIndex(client.id);
		if (this.gameService.games[gameIndex].player.id === client.id)
			this.gameService.games[gameIndex].player.racket.y = body.pos;
		else
			this.gameService.games[gameIndex].opponent.racket.y = body.pos;
		this.updateGameFromIndex(gameIndex);
	}

	@SubscribeMessage('endGame')
	endGame(@ConnectedSocket() client: Socket) {
		
	}
}

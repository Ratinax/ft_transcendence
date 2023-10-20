import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { ConfigIp } from 'src/config-ip';

@WebSocketGateway({
	cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
	},
	namespace: 'game'
})
export class GamesGateway {
	@WebSocketServer()
	server: Server;

	constructor(private readonly gameService: GameService) {}

	@SubscribeMessage('quickPlay')
	quickPlay(@ConnectedSocket() client: Socket, @MessageBody() body) {
		if (this.gameService.getGameIndex(body.name) === -1) {
			const infos = this.gameService.addToGame(body.name, body.mode, client.id);
			this.server.to(client.id).emit('successJoin', infos);
			const	gameIndex = this.gameService.getGameIndex(body.name);
			if (this.gameService.games[gameIndex].isFull) {
				this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('gameFull', {opponentName: this.gameService.games[gameIndex].rightPlayer.name});
				this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('gameFull', {opponentName: this.gameService.games[gameIndex].leftPlayer.name});
			}
		}
	}

	@SubscribeMessage('cancelQuickPlay')
	cancelQuickPlay(@ConnectedSocket() client: Socket) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;

		if (!this.gameService.games[gameIndex].isFull) {
			this.gameService.games.splice(gameIndex, 1);
		}
	}

	@SubscribeMessage('updateSocket')
	updateSocket(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gameService.getGameIndex(body.name);

		if (gameIndex === -1)
			return ;

		if (this.gameService.games[gameIndex].leftPlayer.name === body.name) {
			this.gameService.games[gameIndex].leftPlayer.id = client.id;
		}
		else if (this.gameService.games[gameIndex].rightPlayer.name === body.name) {
			this.gameService.games[gameIndex].rightPlayer.id = client.id;
		}
	}

	@SubscribeMessage('updatePlayerPos')
	updatePlayerPos(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].leftPlayer.id === client.id)
			this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('updateOpponent', body);
		else
			this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('updateOpponent', body);
	}

	@SubscribeMessage('latency')
	updateLatency(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].leftPlayer.id === client.id)
			this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('opponentLatency', {latency: body.latency});
		else
			this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('opponentLatency', {latency: body.latency});
	}

	@SubscribeMessage('ping')
	pong(@ConnectedSocket() client: Socket) {
		this.server.to(client.id).emit('pong');
	}

	@SubscribeMessage('spawnBallInfos')
	spawnBall(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].leftPlayer.id === client.id)
			this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('spawnBall', body);
		else
			this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('spawnBall', body);
	}

	@SubscribeMessage('score')
	score(@ConnectedSocket() client: Socket) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].leftPlayer.id === client.id)
		{
			this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('opponentScore');
			this.gameService.games[gameIndex].rightPlayer.score++;
		}
		else
		{
			this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('opponentScore');
			this.gameService.games[gameIndex].leftPlayer.score++;
		}
	}

	@SubscribeMessage('endGame')
	endGame(@ConnectedSocket() client: Socket) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('gameOver');
		this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('gameOver');
		// console.log(this.gameService.games[gameIndex]);
		this.gameService.games.splice(gameIndex, 1);
	}

	@SubscribeMessage('bounce')
	bounce(@ConnectedSocket() client: Socket, @MessageBody() body) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].leftPlayer.id === client.id)
			this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('ballBounce', body);
		else
			this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('ballBounce', body);
	}

	@SubscribeMessage('imInGame')
	isConnected(@ConnectedSocket() client: Socket) {
		if (this.gameService.getGameIndexFromId(client.id) !== -1)
			this.server.to(client.id).emit('isInGame', {isInGame: false});
		else
			this.server.to(client.id).emit('isInGame', {isInGame: true});
	}

	// updateGameFromIndex(index: number) {
		// const	updateData = this.gameService.games[index].update();
		// this.server.to(this.gameService.games[index].player.socket).emit('update', {update: updateData});
		// this.server.to(this.gameService.games[index].opponent.socket).emit('update', {update: updateData});
	// }
// 
	// @SubscribeMessage('quickPlay')
	// quickPlay(@ConnectedSocket() client: Socket, @MessageBody() body) {
		// if (this.gameService.getGameIndexFromSocket(client.id) === -1)
		// {
			// this.sessionService.getUser(body.sessionKey).then(res => {
				// const	options = this.gameService.joinQuickPlay(res.id, body.name, body.mode, client.id);
				// this.server.to(client.id).emit('joinGame', options);
// 
				// const	gameIndex = this.gameService.getGameIndexFromSocket(client.id);
				// if (this.gameService.games[gameIndex].isFull)
				// {
					// this.server.to(this.gameService.games[gameIndex].player.socket).emit('full', {opponentName: this.gameService.games[gameIndex].opponent.name, opponentSide: this.gameService.games[gameIndex].opponent.side});
					// this.server.to(this.gameService.games[gameIndex].opponent.socket).emit('full', {opponentName: this.gameService.games[gameIndex].player.name, opponentSide: this.gameService.games[gameIndex].player.side});
				// }
			// });
		// }
	// }
// 
	// @SubscribeMessage('updateSocket')
	// updateSocket(@ConnectedSocket() client: Socket, @MessageBody() body) {
		// this.sessionService.getUser(body.sessionKey).then(res => {
			// const	gameIndex = this.gameService.getGameIndexFromId(res.id);
// 
			// if (gameIndex === -1)
				// return ;
			// if (this.gameService.games[gameIndex].player.id === res.id)
				// this.gameService.games[gameIndex].player.socket = client.id;
			// else if (this.gameService.games[gameIndex].opponent.id === res.id)
				// this.gameService.games[gameIndex].opponent.socket = client.id;
		// });
	// }
// 
	// @SubscribeMessage('state')
	// async updateGame(@ConnectedSocket() client: Socket, @MessageBody() body) {
		// const	gameIndex = this.gameService.getGameIndexFromSocket(client.id);
		// if (gameIndex === -1)
			// return ;
		// if (this.gameService.games[gameIndex].player.socket === client.id)
			// this.gameService.games[gameIndex].player.racket.y = body.pos;
		// else
			// this.gameService.games[gameIndex].opponent.racket.y = body.pos;
		// this.updateGameFromIndex(gameIndex);
	// }

}

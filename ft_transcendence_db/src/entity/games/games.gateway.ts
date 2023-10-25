import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { ConfigIp } from 'src/config-ip';
import { UserService } from '../users/user.service';

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

	constructor(private readonly gameService: GameService, private readonly userService: UserService) {
		setInterval(() => {
			this.gameService.checkConnection(this.server);
			console.log(this.gameService.games)
		}, 500)
	}

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

		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		if (this.gameService.games[gameIndex].leftPlayer.id === client.id)
		{
			if (this.gameService.games[gameIndex].leftPlayer.nbLoop === 0)
			{
				this.gameService.games[gameIndex].leftPlayer.firstPing = true;
			}
			else
			{
				this.gameService.games[gameIndex].leftPlayer.secondPing = true;
			}
		}
		else if (this.gameService.games[gameIndex].rightPlayer.id === client.id)
		{
			if (this.gameService.games[gameIndex].rightPlayer.nbLoop === 0)
			{
				this.gameService.games[gameIndex].rightPlayer.firstPing = true;
			}
			else
			{
				this.gameService.games[gameIndex].rightPlayer.secondPing = true;
			}
		}
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
	async endGame(@ConnectedSocket() client: Socket) {
		const	gameIndex = this.gameService.getGameIndexFromId(client.id);
		if (gameIndex === -1)
			return ;
		this.server.to(this.gameService.games[gameIndex].rightPlayer.id).emit('gameOver');
		this.server.to(this.gameService.games[gameIndex].leftPlayer.id).emit('gameOver');
		try
		{
			const user2 = (await this.userService.getUser(this.gameService.games[gameIndex].rightPlayer.name))[0];
			const user1 = (await this.userService.getUser(this.gameService.games[gameIndex].leftPlayer.name))[0];
			this.gameService.createGame({playerOne: {id: user1.id},
				playerTwo: {id: user2.id},
				scorePTwo: this.gameService.games[gameIndex].rightPlayer.score,
				scorePOne: this.gameService.games[gameIndex].leftPlayer.score,
				mode: this.gameService.games[gameIndex].mode});
		}
		catch (e)
		{
			console.error(e);
		}
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
}

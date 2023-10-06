import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { BlockshipService } from '../blockships/blockship.service';
import { Channels } from '../channels/channel.entity';
import { Games } from '../games/game.entity';
import { GameService } from '../games/game.service';

@WebSocketGateway(3001, {
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly blockshipService: BlockshipService, private readonly gameService: GameService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() body: {sessionCookie: string, channel_id: number, dateSent: Date, message: string, isAGameInvite: boolean, game: Partial<Games> | undefined}) 
    {
      if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      if (!user)
        return ('not connected');

      const relation = (await this.channelsUsersService.findRelation(user.id, body.channel_id))[0];
      if (!relation)
        return ('no such relation');

      if (relation.channel.isADm && await this.isBlockedRelation(relation))
      {
        this.server.emit('sendMessageBlocked', {sessionCookie: body.sessionCookie})
        return ;
      }
      else if (relation.channel.isADm && !(await this.isBlockedRelation(relation)))
      {
        this.unHide(user.id, relation.channel);
      }
      const timeoutDate = new Date(relation.dateTimeout);
      const currentDate = new Date(body.dateSent);
      const timeoutDuration = relation.durationTimeout;

      const timeoutSeconds = timeoutDate.getTime() / 1000;
      const currentSeconds = currentDate.getTime() / 1000;
      
      if (timeoutSeconds + +timeoutDuration > currentSeconds)
      {
        this.server.emit('sendMessageTimeout', {sessionCookie: body.sessionCookie, duration: timeoutSeconds + +timeoutDuration - currentSeconds})
        return 'user timeout';
      }

      if (body.game)
      {
        const reelGame = await this.gameService.createGame(this.toGoodInputGame(body.game));
        await this.messagesService.post({
          content: body.message,
          dateSent: body.dateSent,
          channel: {channel_id: body.channel_id},
          user: {
            ...user,
          },
          isAGameInvite: body.isAGameInvite,
          game: {
            id: reelGame.id,
          },
        });
      }
      else
      {

        await this.messagesService.post({
          content: body.message,
          dateSent: body.dateSent,
          channel: {channel_id: body.channel_id},
          user: {
            ...user,
          },
          isAGameInvite: body.isAGameInvite,
        });
      }
      
      this.server.emit('updateMessage', {channel_id: body.channel_id});
      this.server.emit('sendMessageGoodRequest', {channel_id: body.channel_id, sessionCookie: body.sessionCookie});
  }
  @SubscribeMessage('removeGameInvite')
  async removeGameInvite(@MessageBody() body: {id: number, sessionCookie: string})
  {
    if (await this.sessionService.getIsSessionExpired(body.sessionCookie))
      {
        return ('not connected');
      }
      const user = await this.sessionService.getUser(body.sessionCookie);
      if (!user)
        return ('not connected');
    const isGoodUser = await this.messagesService.getIsUserSenderOfMessage(user.id, body.id);
    if (!isGoodUser)
      return ('Not the user that sent the game invite')
    const res = await this.messagesService.removeMessage(body.id);
    if (res)
    {
      this.server.emit('updateMessage', {channel_id: res.channel.channel_id});
    }
  }

  toGoodInputGame(game: Partial<Games>)
  {
    if (Number.isNaN(game.ballAccel - 0) || game.ballAccel > 500 || game.ballAccel < 5)
      game.ballAccel = 50;
    if (Number.isNaN(game.ballSize - 0) || game.ballSize > 50 || game.ballSize < 15)
      game.ballSize = 30;
    if (Number.isNaN(game.ballSpeed - 0) || game.ballSpeed > 1500 || game.ballSpeed < 600)
      game.ballSpeed = 1200;
    if (Number.isNaN(game.maxAngle - 0) || game.maxAngle > 80 || game.maxAngle < 50)
      game.maxAngle = 45;
    if (Number.isNaN(game.playerSize - 0) || game.playerSize > 500 || game.playerSize < 100)
      game.playerSize = 300;
    if (Number.isNaN(game.playerSpeed - 0) || game.playerSpeed > 3700 || game.playerSpeed < 600)
      game.playerSpeed = 1300;
    if (Number.isNaN(game.winScore - 0) || game.winScore > 21 || game.winScore < 1)
      game.winScore = 5;
    return (game);
  }
  async unHide(user_id: number, channel: Partial<Channels>)
  {
    const users = await this.channelsUsersService.findUsersOfChannel(channel.name);
      for (let i = 0; i < users.length; i++)
      {
        if (users[i].id !== user_id)
        {
          await this.channelsUsersService.unHide(users[i].id, channel.channel_id);
          break ;
        }
      }
  }
  async isBlockedRelation(relation: {channel: Partial<Channels>})
  {
    const users = await this.channelsUsersService.findUsersOfChannel(relation.channel.name);
    if (!users)
      return (false);
    const result = await this.blockshipService.getIsBlocked(users[0].id, users[1].id);
    const result2 = await this.blockshipService.getIsBlocked(users[1].id, users[0].id);
    if (result || result2)
      return (true);
    return (false);
  }
}

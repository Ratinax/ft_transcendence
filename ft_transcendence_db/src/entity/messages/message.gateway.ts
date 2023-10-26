import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { Server, Socket } from 'socket.io';
import { ChannelsUsersService } from '../channels_users/channels_users.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SessionService } from '../sessions/session.service';
import { ConfigIp } from 'src/config-ip';
import { BlockshipService } from '../blockships/blockship.service';
import { Channels } from '../channels/channel.entity';
import { Games } from '../games/game.entity';
import { GameService } from '../games/game.service';

@WebSocketGateway({
  cors: {
    origin: `http://${ConfigIp.IP}:8080`,
    credentials: true,
  },
  namespace: 'chat'
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessageService, private readonly channelsUsersService: ChannelsUsersService, private readonly sessionService: SessionService, private readonly blockshipService: BlockshipService, private readonly gameService: GameService) {}

  @SubscribeMessage('createMessage')
  async create(@ConnectedSocket() client: Socket,
    @MessageBody() body: {sessionCookie: string, channel_id: number, channelName: string, dateSent: Date, message: string, isAGameInvite: boolean, game: Partial<Games> | undefined}) 
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
      if (body.message.length > 1024)
      {
        this.server.to(client.id).emit('messageTooLong');
        return ('messageTooLong');
      }
      if (relation.channel.isADm && await this.isBlockedRelation(relation))
      {
        this.server.to(client.id).emit('sendMessageBlocked', {sessionCookie: body.sessionCookie})
        return ;
      }
      else if (relation.channel.isADm && !(await this.isBlockedRelation(relation)))
      {
        this.unHide(user.id, relation.channel);
        this.server.emit('unHideChannel', {channel_id: relation.channel.channel_id})
      }
      const timeoutDate = new Date(relation.dateTimeout);
      const currentDate = new Date(body.dateSent);
      const timeoutDuration = relation.durationTimeout;

      const timeoutSeconds = timeoutDate.getTime() / 1000;
      const currentSeconds = currentDate.getTime() / 1000;
      let message;
      
      if (timeoutSeconds + +timeoutDuration > currentSeconds)
      {
        this.server.to(client.id).emit('sendMessageTimeout', {sessionCookie: body.sessionCookie, duration: timeoutSeconds + +timeoutDuration - currentSeconds})
        return 'user timeout';
      }

      if (body.game)
      {
        message = await this.messagesService.post({
          content: body.message,
          dateSent: body.dateSent,
          channel: {channel_id: body.channel_id},
          user: {
            id: user.id,
            pseudo: user.pseudo
          },
          isAGameInvite: body.isAGameInvite,
        });
      }
      else
      {

        message = await this.messagesService.post({
          content: body.message,
          dateSent: body.dateSent,
          channel: {channel_id: body.channel_id},
          user: {
            id: user.id,
            pseudo: user.pseudo
          },
          isAGameInvite: body.isAGameInvite,
        });
      }
      // if (body.isAGameInvite)
        
      this.server.to(body.channelName).except(client.id).emit('addMessage', {message: message});
      this.server.to(client.id).emit('addMessage', {message: {...message, isSender: true}});
      this.server.to(client.id).emit('sendMessageGoodRequest');
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
      this.server.emit('removeMessage', {message_id: body.id});
    }
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

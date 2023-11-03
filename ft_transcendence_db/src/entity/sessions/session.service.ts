import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sessions } from './session.entity';

@Injectable()
export class SessionService{
    constructor(
        @Inject('SESSION_REPOSITORY')
        private sessionRepository: Repository<Sessions>,
    ) {}
    async createSession(user_id: number)
    {
        const preSession = await this.sessionRepository.findOne({where: {user: {
            id: user_id,
        }}});
        if (preSession)
        {
            preSession.expirationDate = new Date(Date.now() + 10000);
            return (await this.sessionRepository.save(preSession));
        }
        const sessionKey = this.generateRandomString(42);
        const session = {
            user: {
                id: user_id,
            },
            sessionKey: sessionKey,
            expirationDate: new Date(Date.now() + 11000),
        }
        const newSession = this.sessionRepository.create(session);
        return (await this.sessionRepository.save(newSession));

    }
    async getUser(sessionKey: string)
    {
        if (await this.getIsSessionExpired(sessionKey))
        	throw new UnauthorizedException('You are not able to access this data')
        const relations = await this.sessionRepository
        .createQueryBuilder('sessions')
        .innerJoinAndSelect('sessions.user', 'user')
        .where('session_key LIKE :sessionKey', { sessionKey : sessionKey })
        .getMany();
        const user = relations.map((sessions) => ({
                id: sessions.user.id,
                pseudo: sessions.user.pseudo,
                profilPic: sessions.user.profilPic,
                is42User: sessions.user.is42User,
                doubleFaURL: sessions.user.doubleFaURL,
                doubleFa: sessions.user.doubleFa,
            }));
        return (user[0]);
    }
    async getSessionKey(user_id: number)
    {
        const relation = await this.sessionRepository.findOne({where: {user: {id: user_id}}})
        if (!relation)
            return ('');
        return (relation.sessionKey);
    }


    async getIsSessionExpired(sessionKey: string)
    {
        const relation = await this.sessionRepository.findOne({
            where: { sessionKey: sessionKey },
          });
        if (!relation)
        {
            return (true);
        }
        if (new Date(Date.now()) > relation.expirationDate)
        {
            return (true);
        }
        return (false);
    }
    async getIsPseudoExpired(pseudo: string)
    {
        const relations = await this.sessionRepository
            .createQueryBuilder('sessions')
            .innerJoinAndSelect('sessions.user', 'user')
            .where('user.pseudo = :pseudo', { pseudo: pseudo })
            .getMany();
        if (!relations || !relations[0])
        {
            return (true);
        }
        return (false);
    }
    async refreshSessionKey(sessionKey: string)
    {
        const relation = await this.sessionRepository.findOne({
            where: { sessionKey: sessionKey },
          });
        if (!relation)
            return (null);
        relation.expirationDate = new Date(Date.now() + 11000);
        const res = this.sessionRepository.save(relation);
        return (res);
    }

    async removeNoMoreConnected()
    {
        let connected = [];
        let noMoreConnected = [];
        const relations = await this.sessionRepository
        .createQueryBuilder('sessions')
        .innerJoinAndSelect('sessions.user', 'user')
        .getMany();
        for (let i = 0; i < relations.length; i++)
        {
            if (relations[i].expirationDate < new Date(Date.now()))
            {
                noMoreConnected.push(relations[i].user.pseudo);
                await this.sessionRepository.delete(relations[i].id);
            }
            else
                connected.push(relations[i].user.pseudo);
        }
        return ({noMoreConnected: noMoreConnected, connected: connected});
    }

    generateRandomString(length: number): string
    {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        return result;
    }
}

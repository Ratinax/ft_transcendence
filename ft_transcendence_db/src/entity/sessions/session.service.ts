import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sessions } from './session.entity';

@Injectable()
export class SessionService{
    constructor(
        @Inject('SESSION_REPOSITORY')
        private sessionRepository: Repository<Sessions>,
    ) {}
    sessions: Array<{id: string, pseudo: string, sessionCookie: string, time: Date}> = [];
    async createSession(user_id: number)
    {
        const preSession = await this.sessionRepository.findOne({where: {user: {
            id: user_id,
        }}});
        if (preSession)
        {
            preSession.expirationDate = new Date(Date.now() + 2592000000);
            return (await this.sessionRepository.save(preSession));
        }
        const sessionKey = this.generateRandomString(42);
        const session = {
            user: {
                id: user_id,
            },
            sessionKey: sessionKey,
            expirationDate: new Date(Date.now() + 2592000000),
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
                nickname: sessions.user.nickname,
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

    getIsConnected(pseudo: string)
    {
        for (let i = 0; i < this.sessions.length; i++)
        {
            if (this.sessions[i].pseudo === pseudo)
                return (true);
        }
        return (false);
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
        relation.expirationDate = new Date(Date.now() + 2592000000);
        const res = this.sessionRepository.save(relation);
        return (res);
    }
    async removeSessionCookie(sessionCookie: string)
    {
        for (let i = 0; i < this.sessions.length; i++)
        {
            if (this.sessions[i].sessionCookie === sessionCookie)
                this.sessions.splice(i, 1);
        }
        const session = await this.sessionRepository.findOne({where: {sessionKey: sessionCookie}})
        session.expirationDate = new Date(Date.now());
        this.sessionRepository.save(session);
    }
    async removeNoMoreConnected()
    {
        let connected = [];
        let noMoreConnected = [];
        const relations = await this.sessionRepository
        .createQueryBuilder('sessions')
        .innerJoinAndSelect('sessions.user', 'user')
        .getMany();
        const sessionsLength = this.sessions.length; 
        for (let i = sessionsLength - 1 ; i > -1; i--)
        {
            if (this.sessions[i].time < new Date(Date.now()))
                this.sessions.splice(i, 1);    
        } 
        for (let i = 0; i < relations.length; i++)
        {
            let isSocketConnected = false;
            for (let j = 0; j < this.sessions.length; j++)
            {
                if (this.sessions[j].pseudo === relations[i].user.pseudo)
                {
                    isSocketConnected = true;
                    break ;
                }
            }
            if (!isSocketConnected)
                noMoreConnected.push(relations[i].user.pseudo);
            if (relations[i].expirationDate < new Date(Date.now()))
            {
                for (let j = 0 ; j < this.sessions.length; j++)
                {
                    if (this.sessions[j].pseudo === relations[i].user.pseudo)
                        this.sessions.splice(j, 1);    
                } 
                noMoreConnected.push(relations[i].user.pseudo);
                await this.sessionRepository.delete(relations[i].id);
            }
            else if (isSocketConnected)
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
    updateSession(session: {id: string, pseudo: string, sessionCookie: string})
    {
        let allreadyExists = false;
        for (let i = 0; i < this.sessions.length; i++)
        {
            if (this.sessions[i].pseudo === session.pseudo && this.sessions[i].id === session.id)
            {
                this.sessions[i].sessionCookie = session.sessionCookie;  
                this.sessions[i].id = session.id;
                this.sessions[i].time = new Date(Date.now() + 12000);
                allreadyExists = true;
                break;
            }
            else if (this.sessions[i].pseudo === session.pseudo && this.sessions[i].id !== session.id)
            {
                this.sessions.splice(i, 1);
                break ;
            }
        }
        if (!allreadyExists)
        {
            const newSession = {...session, time: new Date(Date.now() + 12000)}
            this.sessions.push(newSession);
        }
    }
}

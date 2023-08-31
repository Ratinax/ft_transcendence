import { Inject, Injectable } from '@nestjs/common';
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
        const sessionKey = this.generateRandomString(42);
        const session = {
            user: {
                id: user_id,
            },
            sessionKey: sessionKey,
            expirationDate: new Date(Date.now() + 10000),
        }
        const newSession = this.sessionRepository.create(session);
        const res = await this.sessionRepository.save(newSession);
        return (res);
    }
    async getUser(sessionKey: string)
    {
        if (await this.getIsSessionExpired(sessionKey))
        {
            return (null);
        }
        const relations = await this.sessionRepository
        .createQueryBuilder('sessions')
        .innerJoinAndSelect('sessions.user', 'user')
        .where('session_key LIKE :sessionKey', { sessionKey : sessionKey })
        .getMany();
        const user = relations.map((sessions) => ({
                id: sessions.user.id,
                pseudo: sessions.user.pseudo,
                // password: sessions.user.password,
                profilPic: sessions.user.profilPic,
                is42User: sessions.user.is42User,
            }));
        return (user[0]);
    }
    async getSessionKey(user_id: number)
    {
        const relation = await this.sessionRepository.findOne({where: {user: {id: user_id}}})
        
        return (relation.sessionKey);
    }
    async getIsSessionExpired(sessionKey)
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
    async refreshSessionKey(sessionKey)
    {
        const relation = await this.sessionRepository.findOne({
            where: { sessionKey: sessionKey },
          });
        if (!relation)
            return (null);
        relation.expirationDate = new Date(Date.now() + 10000);
        const res = this.sessionRepository.save(relation);
        return (res);
    }
    
    async removeNoMoreConnected() // TODO check if work
    {
        const relations = await this.sessionRepository
        .createQueryBuilder('sessions')
        .getMany();
        for (let i = 0; i < relations.length; i++)
        {
            if (relations[i].expirationDate < new Date(Date.now()))
                await this.sessionRepository.delete(relations[i].id);
        }
    }
    /**
     * generate a random string
     * 
     * @param length length of the string to be created
     * @returns the random string created
     */
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

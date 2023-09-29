import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blockships } from './blockship.entity';

@Injectable()
export class BlockshipService {
    constructor(
        @Inject('BLOCKSHIP_REPOSITORY')
        private blockshipRepository: Repository<Blockships>,
    ) {}
    /**
     * get blocklist of user
     * 
     * @param id id of user
     * @returns blocklist of user
     */
    async findUserblockedFromId(id: number)
    {
        const blockships = await this.blockshipRepository
            .createQueryBuilder('blockships')
            .innerJoinAndSelect('blockships.userblocking', 'userblocking')
            .innerJoinAndSelect('blockships.userblocked', 'userblocked')
            .where('userblocking.id = :id', { id: id })
            .getMany();
        const users = blockships.map((blockship) => ({
            id: blockship.userblocked.id, 
            pseudo: blockship.userblocked.pseudo, 
            profilPic: blockship.userblocked.profilPic, 
            }));
        return (users);
    }
    /**
     * delete blockship
     * 
     * @param user_id user blocking
     * @param blocked_id user blocked
     * @returns result of request | null
     */
    async deleteBlockship(user_id: number, blocked_id: number)
    {
        const blockship = await this.blockshipRepository.findOne({
            where: { userblocking: { id: user_id }, userblocked: { id: blocked_id } },
          });
        if (blockship)
            return (await this.blockshipRepository.delete(blockship.id));
        return (null);
    }
    /**
     * create blockship
     * 
     * @param userblocking_id user blocking
     * @param userblocked_id user blocked
     * @returns result of request (Blockship)
     */
    async blockUser(userblocking_id, userblocked_id)
    {
        const blockship = { userblocking: { id: userblocking_id }, userblocked: { id: userblocked_id } };
        const newBlockship = this.blockshipRepository.create(blockship);
        const res = await this.blockshipRepository.save(newBlockship);
        return (res);
    }
    /**
     * get blockship if blockship exists
     * 
     * @param user_id user blocking
     * @param blocked_id user blocked
     * @returns result of request
     */
    async getIsBlocked(user_id: number, blocked_id: number)
    {
        const blockship = await this.blockshipRepository.findOne({
            where: { userblocking: { id: user_id }, userblocked: { id: blocked_id } },
          });
        return (blockship);
    }
}

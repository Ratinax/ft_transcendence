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
     * get users blocked from user
     * 
     * @param id user id
     * @returns result of request
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
     * @param blocked_id id of user blocked
     * @param user_id id of user blocking
     * @returns result of request
     */
    async deleteBlockship(user_id: number, blocked_id: number)
    {
        const blockship = await this.blockshipRepository.findOne({
            where: { userblocking: { id: user_id }, userblocked: { id: blocked_id } },
          });
        const res = await this.blockshipRepository.delete(blockship.id);
        return (res);
    }
    async blockUser(userblocking_id, userblocked_id)
    {
        const blockship = { userblocking: { id: userblocking_id }, userblocked: { id: userblocked_id } };
        const res = await this.blockshipRepository.save(blockship);
        return (res);
    }
    async getIsBlocked(user_id: number, blocked_id: number)
    {
        const blockship = await this.blockshipRepository.findOne({
            where: { userblocking: { id: user_id }, userblocked: { id: blocked_id } },
          });
        return (blockship);
    }
}

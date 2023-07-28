import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Blockships } from './blockship.entity';

@Injectable()
export class BlockshipService {
    constructor(
        @Inject('BLOCKSHIP_REPOSITORY')
        private blockshipRepository: Repository<Blockships>,
    ) {}
    async findAll(): Promise<Blockships[]>
    {
        return this.blockshipRepository.find();
    }
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
            isConnected: blockship.userblocked.isConnected}));
        return (users);
    }
    async deleteBlockship(friend_id: number, user_id: number)
    {
        const blockship = await this.blockshipRepository.findOne({
            where: { userblocking: { id: user_id }, userblocked: { id: friend_id } },
          });

        const res = await this.blockshipRepository.delete(blockship.id);
        return (res);
    }
}

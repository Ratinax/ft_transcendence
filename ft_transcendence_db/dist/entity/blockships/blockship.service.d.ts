import { Repository } from 'typeorm';
import { Blockships } from './blockship.entity';
export declare class BlockshipService {
    private blockshipRepository;
    constructor(blockshipRepository: Repository<Blockships>);
    findUserblockedFromId(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
    deleteBlockship(user_id: number, blocked_id: number): Promise<import("typeorm").DeleteResult>;
}

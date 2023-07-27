import { Repository } from 'typeorm';
import { Blockships } from './blockship.entity';
export declare class BlockshipService {
    private blockshipRepository;
    constructor(blockshipRepository: Repository<Blockships>);
    findAll(): Promise<Blockships[]>;
    findUserblockedFromId(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
        isConnected: boolean;
    }[]>;
}

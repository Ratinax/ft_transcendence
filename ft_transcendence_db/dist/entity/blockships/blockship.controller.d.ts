import { BlockshipService } from './blockship.service';
export declare class BlockshipController {
    private readonly blockshipService;
    constructor(blockshipService: BlockshipService);
    findUserblockedFromId(id: number): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
}

import { BlockshipService } from './blockship.service';
import { SessionService } from '../sessions/session.service';
export declare class BlockshipController {
    private readonly blockshipService;
    private readonly sessionService;
    constructor(blockshipService: BlockshipService, sessionService: SessionService);
    findUserblockedFromId(req: any): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
}

import { BlockshipService } from './blockship.service';
export declare class BlockshipController {
    private readonly blockshipService;
    constructor(blockshipService: BlockshipService);
    findAll(): Promise<import("./blockship.entity").Blockships[]>;
}

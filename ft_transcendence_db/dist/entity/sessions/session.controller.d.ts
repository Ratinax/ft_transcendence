import { SessionService } from './session.service';
import { Response } from 'express';
export declare class SessionController {
    private readonly sessionService;
    constructor(sessionService: SessionService);
    pingBack(req: any, res: Response): Promise<any>;
    getCookies(req: any): any;
}

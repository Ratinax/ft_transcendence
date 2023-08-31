import { UserService } from './user.service';
import { Response } from 'express';
import { SessionService } from '../sessions/session.service';
export declare class UserController {
    private readonly userService;
    private readonly sessionService;
    constructor(userService: UserService, sessionService: SessionService);
    callFunction(fct: any, body: any): Promise<any>;
    signUp(body: any, res: Response): Promise<boolean>;
    signIn(body: any, res: Response): Promise<boolean>;
    login42(code: any, res: Response): Promise<any>;
    logOut(body: any): Promise<any>;
    getImageName(req: any): Promise<string>;
    getImage(imageName: string, res: Response): Promise<void>;
}

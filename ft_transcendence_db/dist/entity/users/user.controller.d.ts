import { UserService } from './user.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    callFunction(fct: any, body: any): Promise<any>;
    signUp(body: any): Promise<any>;
    signIn(body: any): Promise<any>;
    logOut(body: any): Promise<any>;
    getImage(imageName: string, res: Response): Promise<void>;
}

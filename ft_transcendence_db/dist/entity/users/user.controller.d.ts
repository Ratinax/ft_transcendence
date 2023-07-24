import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./user.entity").Users[]>;
    callFunction(fct: any, body: any): Promise<any>;
    signUp(body: any): Promise<any>;
    signIn(body: any): Promise<any>;
    logOut(body: any): Promise<any>;
}

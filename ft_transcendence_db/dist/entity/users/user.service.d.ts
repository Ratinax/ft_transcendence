import { Repository } from 'typeorm';
import { Users } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<Users>);
    callFunction(fct: any, body: any): Promise<any>;
    findAll(): Promise<Users[]>;
    signUp(user: Partial<Users>): Promise<Users | "allready exists">;
    signIn(user: Partial<Users>): Promise<false | Users | "Wrong password">;
    logOut(user: Partial<Users>): Promise<false | Users>;
}

import { Repository } from 'typeorm';
import { Users } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<Users>);
    callFunction(fct: any, body: any): Promise<any>;
    signUp(body: any): Promise<{
        pseudo: string;
        profilPic: string;
        isConnected: boolean;
        id: number;
    }>;
    signIn(user: Partial<Users>): Promise<false | Users | "Wrong password">;
    logOut(user: Partial<Users>): Promise<false | Users>;
    generateRandomString(length: number): string;
    uploadImage(image: string): Promise<string>;
}

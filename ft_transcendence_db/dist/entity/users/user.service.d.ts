import { Repository } from 'typeorm';
import { Users } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<Users>);
    callFunction(fct: any, body: any): Promise<any>;
    signUp(body: any): Promise<{
        pseudo: string;
        profilPic: string;
        id: number;
    }>;
    signIn(user: Partial<Users>): Promise<false | Users | "Wrong password">;
    logOut(user: Partial<Users>): Promise<false | Users>;
    login42(code: any): Promise<void | import("axios").AxiosResponse<any, any>>;
    generateRandomString(length: number): string;
    uploadImage(image: string): Promise<string>;
    comparePasswords(user: any, password: string): Promise<any>;
    hashedPassword(password: string): Promise<any>;
}

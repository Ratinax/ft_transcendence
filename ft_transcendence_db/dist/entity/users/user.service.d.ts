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
    login42(user: Partial<Users>): Promise<Users | {
        pseudo: string;
        profilPic: string;
        id: number;
    }>;
    logOut(user: Partial<Users>): Promise<false | Users>;
    getToken(code: any): Promise<import("axios").AxiosResponse<any, any>>;
    generateRandomString(length: number): string;
    uploadImage(image: string): Promise<string>;
    comparePasswords(user: any, password: string): Promise<any>;
    hashedPassword(password: string): Promise<any>;
    getMyInfos(token: any): Promise<any>;
    getUsers(userPart: string): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }[]>;
}

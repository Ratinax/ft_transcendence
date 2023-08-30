import { Repository } from 'typeorm';
import { Sessions } from './session.entity';
export declare class SessionService {
    private sessionRepository;
    constructor(sessionRepository: Repository<Sessions>);
    createSession(user_id: number): Promise<Sessions>;
    getUser(sessionKey: string): Promise<{
        id: number;
        pseudo: string;
        profilPic: string;
    }>;
    getIsSessionExpired(sessionKey: any): Promise<boolean>;
    refreshSessionKey(sessionKey: any): Promise<Sessions>;
    removeNoMoreConnected(): Promise<void>;
    generateRandomString(length: number): string;
}

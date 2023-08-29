import { Users } from "../users/user.entity";
export declare class Sessions {
    id: number;
    user: Partial<Users>;
    sessionKey: string;
    expirationDate: Date;
}

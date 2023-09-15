import { Users } from "../users/user.entity";
export declare class Statistics {
    id: number;
    playerOne: Users;
    playerTwo: Users;
    scorePOne: number;
    scorePTwo: number;
    isGameOver: Boolean;
}

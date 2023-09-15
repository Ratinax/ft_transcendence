import { Users } from "../users/user.entity";
export declare class Games {
    id: number;
    playerOne: Users;
    playerTwo: Users;
    scorePOne: number;
    scorePTwo: number;
    isGameOver: Boolean;
    ballSpeed: number;
    ballSpeedInc: number;
    racketSpeed: number;
    racketSize: number;
    scoreToWin: number;
}

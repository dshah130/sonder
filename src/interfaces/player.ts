import { pointScalar } from "../handler/playerTypes";
// Define the player interface
export interface Player {
    UID: string;
    SE: number;
    SL: number;
    IE: number;
    IL: number;
    Type: string;
    Health: number;
    Damage: number;
    Timer: number;
    IsBlocking:boolean
}

export const BaseStatsPlayer : Player = {
    UID: "",
    SE: 0 *pointScalar,
    SL: 0 *pointScalar,
    IE: 0 *pointScalar,
    IL: 0 *pointScalar,
    Type: "",
    Health: 5 *pointScalar,
    Damage: 1 *pointScalar,
    Timer: 5,
    IsBlocking:false
}
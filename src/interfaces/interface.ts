// Define the player interface
export interface Player {
    UID: string;
    Level: number;
    SE: number;
    SL: number;
    IE: number;
    IL: number;
    Type: string;
    Health: number;
    Damage: number;
    decisionTimer: number;
}
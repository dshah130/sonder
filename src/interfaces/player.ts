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
    Timer: number;
}

export const BaseStatsPlayer : Player = {
    UID: "",
    Level: 0,
    SE: 0,
    SL: 0,
    IE: 0,
    IL: 0,
    Type: "",
    Health: 5,
    Damage: 1,
    Timer: 3
}
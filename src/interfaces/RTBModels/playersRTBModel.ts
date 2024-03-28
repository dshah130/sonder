import { Connections } from "./connectionRTBModel";
import { InGameRTBModel } from "./inGameRTBModel";

export interface playerRTBModel {
    connections:Connections,
    inGame:InGameRTBModel
}
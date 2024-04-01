import { ActionEnum } from "../../enums/actionEnum"
import { Player } from "../player"
export interface gameRTBModel {
    turn:string,
    timer:number,
    actionList:actionList[],
}

// export interface actionList{
//     [key:string]:actionListItem,
// }
export interface actionList {

    actionList:ActionEnum[]
    startPlayerData:Player
}


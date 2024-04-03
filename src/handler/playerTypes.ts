import { firestore } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { BaseStatsPlayer, Player } from "../interfaces/player";

export const MBTI_TYPES = ['ENFP', 'ISTJ', 'ISFP', 'INTJ', 'INFJ', 'INTP', 'ENFJ', 'ENTJ', 'ENTP', 'ESFP', 'ESTP', 'ESFJ', 'ESTJ', 'ISFJ', 'INFP', 'ISTP'];

// Function to randomly select a type
function getRandomMBTIType(): string {
  const randomIndex = Math.floor(Math.random() * MBTI_TYPES.length);
  return MBTI_TYPES[randomIndex];
}

// Function to assign an MBTI type to a player and return it
async function assignMBTIToPlayer(playerId: string): Promise<string> {
  const playerMBTI = getRandomMBTIType();
  // const playerRef = doc(firestore, "players", playerId);

  // await updateDoc(playerRef, {
  //   type: playerMBTI 
  // });

  return playerMBTI; 
}
export { assignMBTIToPlayer };

export interface typeMetaData{
  SEAFFECT:number,
  SELOSE:number,
  SEGAIN:number,

  SLAFFECT:number,
  SLGAIN:number,
  SLLOSE:number,

  IEAFFECT:number,
  IELOSE:number,
  IEGAIN:number,

  ILAFFECT:number
  ILGAIN:number,
  ILLOSE:number
}

export function getTypeBreakDown(playerData:Player){

  const types = playerData.Type.split('') 
  displayConsoleMessage("Your Character will:")
  types.forEach(element => {
    
      switch(element){

        case "E":{
          displayConsoleMessage("E: Improves Intimacy Interactions, reducing losses of stats in those interactions")
          break;
        }
        case "I":{
          displayConsoleMessage("I: Improves Sensitive Interactions, reducing losses of stats in those interactions")
          break;
        }
        case "N":{
          displayConsoleMessage("N: Increases the stats of Drivers of each emotion")
          break;
        }
        case "S":{
          displayConsoleMessage("S: Increases the stats of Handlers of each emotion")
          break;
        }
        case "F":{
          displayConsoleMessage("F:  Increase Emotion Stats and Reduces Emotion Loss")
          break;
        }
        case "T":{
          displayConsoleMessage("T: Increase Logic Stats and Reduces Logic Loss")
          break;
        }
        case "P":{
          displayConsoleMessage("P: Reduces Loses in general")
          break;
        }        
        case "J":{
          displayConsoleMessage("J: Increase Gains in general")
          break;
        }

        default:
          console.log("=====================\nThere seems to an error with your type display")
      }

  });
}

export const pointScalar = 10

export function getTypeMetaData(playerData:Player):typeMetaData{
  const newTypeMetaData:typeMetaData ={
    SEAFFECT: 0,
    SELOSE: 0,
    SEGAIN: 0,
    SLAFFECT: 0,
    SLGAIN: 0,
    SLLOSE: 0,
    IEAFFECT: 0,
    IELOSE: 0,
    IEGAIN: 0,
    ILAFFECT: 0,
    ILGAIN: 0,
    ILLOSE: 0
  }

  const scalar = 0.25 
  const types = playerData.Type.split('') 
  types.forEach(element => {
    
      switch(element){

        case "E":{
          // playerData.IE += scalar*pointScalar
          // playerData.IL += scalar*pointScalar
          newTypeMetaData.IEAFFECT += scalar
          newTypeMetaData.ILAFFECT += scalar
          newTypeMetaData.IELOSE += scalar
          newTypeMetaData.ILLOSE += scalar
          newTypeMetaData.IEGAIN += scalar
          newTypeMetaData.ILGAIN += scalar
          break;
        }
        case "I":{
          // playerData.SE += scalar*pointScalar
          // playerData.SL += scalar*pointScalar
          newTypeMetaData.SEAFFECT += scalar
          newTypeMetaData.SLAFFECT += scalar
          newTypeMetaData.SELOSE += scalar
          newTypeMetaData.SLLOSE += scalar
          newTypeMetaData.SEGAIN += scalar
          newTypeMetaData.SLGAIN += scalar
          break;
        }
        case "N":{
          // playerData.SL += scalar*pointScalar
          // playerData.IE += scalar*pointScalar
          newTypeMetaData.SLAFFECT += scalar
          newTypeMetaData.IEAFFECT += scalar
          break;
        }
        case "S":{
          // playerData.IL += scalar*pointScalar
          // playerData.SE += scalar*pointScalar
          newTypeMetaData.SEAFFECT += scalar
          newTypeMetaData.ILAFFECT += scalar
          break;
        }
        case "F":{
          // playerData.SE += scalar*pointScalar
          // playerData.IE += scalar*pointScalar
          newTypeMetaData.IEAFFECT += scalar
          newTypeMetaData.SEAFFECT += scalar
          newTypeMetaData.IELOSE += scalar
          newTypeMetaData.SELOSE += scalar
          newTypeMetaData.IEGAIN += scalar
          newTypeMetaData.SEGAIN += scalar

          break;
        }
        case "T":{
          // playerData.SL += scalar*pointScalar
          // playerData.IL += scalar*pointScalar
          newTypeMetaData.ILAFFECT += scalar
          newTypeMetaData.SLAFFECT += scalar
          newTypeMetaData.ILLOSE += scalar
          newTypeMetaData.SLLOSE += scalar
          newTypeMetaData.ILGAIN += scalar
          newTypeMetaData.SLGAIN += scalar
          break;
        }
        case "P":{
          newTypeMetaData.ILLOSE += scalar
          newTypeMetaData.SLLOSE += scalar
          newTypeMetaData.SELOSE += scalar
          newTypeMetaData.SELOSE += scalar
          break;
        }        
        case "J":{
          newTypeMetaData.ILGAIN += scalar
          newTypeMetaData.SLGAIN += scalar
          newTypeMetaData.SEGAIN += scalar
          newTypeMetaData.SEGAIN += scalar
          break;
        }

        default:
          console.log("=====================\nThere seems to an error with your type display")
      }

  });
  console.log("remove this",newTypeMetaData)

  return newTypeMetaData
}

export function getNewPlayer():Player{

  let newPlayer:Player = BaseStatsPlayer
  newPlayer.Type = getRandomMBTIType()
  getTypeBreakDown(newPlayer)
  getTypeMetaData(newPlayer);
  newPlayer = updatePlayerType(newPlayer,newPlayer.Type)
  return newPlayer
}

export function updatePlayerType(player:Player,type:string):Player{

  player.Type = type;
  const meta = getTypeMetaData(player);
  player.SE = meta.SEAFFECT * pointScalar
  player.SL = meta.SLAFFECT * pointScalar

  player.IE = meta.IEAFFECT * pointScalar
  player.IL = meta.ILAFFECT * pointScalar

  return player
}

function displayConsoleMessage(mes:string){
  console.log(`=====================\n${mes}`)
}
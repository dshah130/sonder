import { firestore } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

const MBTI_TYPES = ['ENFP', 'ISTJ', 'ISFP', 'INTJ', 'INFJ', 'INTP', 'ENFJ', 'ENTJ', 'ENTP', 'ESFP', 'ESTP', 'ESFJ', 'ESTJ', 'ISFJ', 'INFP', 'ISTP'];

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

export function getTypeBreakDown(MBTIType:string){
  const types = MBTIType.split('')
}
 import {firestore } from "../firebase/firebase";
 import firebaseApp from "../firebase/firebase";
 import { getDoc, doc, setDoc, onSnapshot, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
 import { Player } from "../interfaces/player";

 export function updatePlayerRef(uid:string, playerStateUpdate:any):void{
    setDoc(doc(firestore,'players', uid), playerStateUpdate);
    getPlayerRef(uid)
 }

 export function getPlayerRef(playerUID:string){
   const playerRef = doc(firestore, "players", playerUID);
   return playerRef;
 }

 // Setup real time listener for player stats
 export async function getPlayerData(playerUID: string):Promise<Player | null> {
   const playerRef = getPlayerRef(playerUID);

   const playerSnapshot = await getDoc(playerRef);
   const patientData = playerSnapshot.data() as Player;
   //console.log("Player Data Retrieved:",patientData);
   return patientData
}

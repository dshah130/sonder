 import {firestore } from "../firebase/firebase";
 import firebaseApp from "../firebase/firebase";
 import { doc, setDoc, onSnapshot } from "firebase/firestore";
 import { Player } from "../interfaces/interface";

 export function updatePlayerRef(uid:string, playerStateUpdate:any):void{
    setDoc(doc(firestore,'players', uid), playerStateUpdate);
    getPlayerRef(uid)
 }

 export function getPlayerRef(uid:string){
   let playerRef;
   const unsub = onSnapshot(doc(firestore, "players", uid), (doc) => {
      playerRef = doc.data()
      console.log(uid,"Current Player Data: ", doc.data()?.UID);
  })

  //mapDocumentToInterface(doc.data(), Player)
  //console.log(playerRef)

   return playerRef;
 }

// //  // Define a generic function to map Firestore documents to interfaces
// function mapDocumentToInterface<T>(doc: any, interfaceType: new () => T): T | null {
//    if (!doc?.exists) {
//        return null; // Return null if the document does not exist
//    }

//    const data = doc;
//    const mappedObject = new interfaceType();

//    // Assuming the interfaceType has properties matching the Firestore document fields
//    for (const key in data) {
//        if (Object.prototype.hasOwnProperty.call(data, key)) {
//          (mappedObject as any)[key]  = data[key];
//        }
//    }

//    return mappedObject;
// }

// function mapFirestoreDocToInterface<T>(doc: firebaseApp.firestore.DocumentSnapshot): T | null {
//    if (!doc.exists) return null;
 
//    const data = doc.data();
//    // Assuming you have a field called 'type' to determine the document type
//    switch (data.type) {
//      case 'user':
//        return data as User;
//      case 'post':
//        return data as Post;
//      // Add other cases for different document types
//      default:
//        return null;
//    }
//  }
import {database} from "../firebase/firebase";
import { 
    ref, 
    onDisconnect, 
    onValue, 
    push, 
    set , 
    serverTimestamp, 
    onChildAdded, 
    onChildRemoved, 
    DatabaseReference , 
    get,
    child,
    update 
} from "firebase/database";

import { printErrorMsg } from "./errorHandler";
import { playerRTBModel } from "../interfaces/RTBModels/playersRTBModel";
import { InGameRTBModel } from "../interfaces/RTBModels/inGameRTBModel";
import { gameRTBModel, actionList } from "../interfaces/RTBModels/gamesRTBModel";

let playersConnectedListCurrent : string [] = [];


export function getPlayerConnectionRef(UID:string){
    let playerConRef = ref(database, `players/${UID}/connections`);
    //console.log(playerConRef)
    return playerConRef;
}

export function getPlayerInGameRef(UID:string){
    let playerInGameRef = ref(database, `players/${UID}/inGame`);
    console.log(playerInGameRef)
    return playerInGameRef;
}

export function getGameRef(gameUID:string){
  let playerInGameRef = ref(database, `games/${gameUID}`);
  console.log(playerInGameRef)
  return playerInGameRef;
}


export function handleDataBaseConnection(UID:string){
    const connectedRef = ref(database, '.info/connected');
    const myConnectionsRef = getPlayerConnectionRef(UID);
    const playerConnectionListRef = ref(database, 'players');
    //const lastOnlineRef = getLastOnlineRef(UID);

    console.log("fire")
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
          const con = push(myConnectionsRef);
          
          console.log("Connected to DB");

        async function waitOneSecond(): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000); // Wait for 1 second (1000 milliseconds)
        });
        }

        // // Usage
        // async function exampleUsage() {
        //     getPlayerConnectionList(playerConnectionListRef);
        //     await waitOneSecond(); // Wait for 1 second
        //     console.log("pls", playersConnectedListCurrent)
        // }

        // exampleUsage(); // Call the exampleUsage function
        // console.log("pls", playersConnectedListCurrent)

        // let test = getPlayerConnectionList(playerConnectionListRef);
        // await waitOneSecond(); // Wait for 1 second
        // console.log("pls", test, playersConnectedListCurrent)


        //   When I disconnect, update the last time I was seen online
          //onDisconnect(lastOnlineRef).set(serverTimestamp());
          onDisconnect(con)
        // When I disconnect, remove this device
          .remove()
          .then(() => {
            console.log("Client was removed")
            })
            .catch((error)=>{
            printErrorMsg(error)
          });
      
          // Add this device to my connections list
          // this value could contain info about the device or a timestamp too
          set(con, true);
      

        }else {
            console.log("not connected");
        }
    });
}

export function createConnection(UID:string){

    //Find connected Info
    const connectedRef = ref(database, '.info/connected');

    const myConnectionsRef = getPlayerConnectionRef(UID);

    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
          console.log("Connected to DB");

          //Add connection to Real Time Db
          const con = push(myConnectionsRef);


            //const gameRef =  push(childref(database, `players/${UID}/`)).key;
           // const gameRef = push(child(ref(database), `players/${UID}/`)).key;

            // interface UpdateInGame {
            //     [key:string]:InGame
            // }

            // const updates: UpdateInGame = {};


            // updates[ `players/${UID}/inGame`] = inGame;

            // update(ref(database), updates)
            // .then(()=>{
            //     console.log("Updated Succesfully")
            // });
        //   When I disconnect, update the last time I was seen online
          //onDisconnect(lastOnlineRef).set(serverTimestamp());

          onDisconnect(con)
        // When I disconnect, remove this device
          .remove()
          .then(() => {
            console.log("Client was removed")
            })
            .catch((error)=>{
            printErrorMsg(error)
          });
      
          // Add this device to my connections list
          // this value could contain info about the device or a timestamp too
          set(con, true);
      

        }else {
            console.log("Not Connected");
        }
    });


    return connectedRef;
}

export function createInGame(currentPlayerUID:string,GameUID:string,targetPlayerUID:string){
  
  const inGame:InGameRTBModel = {
    OpponentUID: targetPlayerUID,
    GameUID: GameUID 
  }
  interface UpdateInGame {
        [key:string]:InGameRTBModel
  }

  const updates: UpdateInGame = {};
  updates[ `players/${currentPlayerUID}/inGame`] = inGame;

  update(ref(database), updates)
  .then(()=>{
      console.log("Updated Succesfully")
  });

}

export async function createGame(currentPlayerUID:string):Promise<string | null>{
  
  const player1ActionList: string[] = [];
  const player2ActionList: string[] = [];

  const game:gameRTBModel ={
    turn: currentPlayerUID,
    player1ActionList: player1ActionList,
    player2ActionList: player2ActionList
  }

  interface UpdateGame {
    [key:string] : gameRTBModel
  }

  const newGameID = push(child(ref(database), 'games')).key;

  const updates: UpdateGame = {};
  updates[`games/${newGameID}/`] = game

  update(ref(database), updates)
  .then(()=>{
      console.log("Updated Succesfully")
  });
  console.log(newGameID)
  return newGameID
}

export function readInGame(currentPlayerUID:string){

  onValue( getPlayerInGameRef(currentPlayerUID), (snapshot) =>{
    const data = snapshot.val();
    console.log(data)
  })
}

// export async function readGame(gameUID:string):Promise<gameRTBModel>{

//   try{
//     onValue( getGameRef(gameUID), (snapshot) =>{
//       const data = snapshot.val();
//       console.log(data)
//     })
    
//   }catch(error){

//   }

// }

// Modify the function to accept a callback
export function getPlayerConnectionList(callback: (playersList: string[]) => void) {
  const playerConnectionListRef = ref(database, 'players');

  onValue(playerConnectionListRef, (snapshot) => {
      const data = snapshot.val();
      const playersList = Object.keys(data); // Assuming the data structure allows this
      callback(playersList); // Call the callback with the players list
  }, {
      onlyOnce: true // If you only want to fetch the list once; remove this if you want continuous updates
  });
}

// export function getLastOnlineRef(UID:string){
//     const lastOnlineRef = ref(database, `players/${UID}/lastOnline`);
//     //console.log(lastOnlineRef)
//     //Latency
//     onDisconnect(lastOnlineRef).set(serverTimestamp());
//     return lastOnlineRef;
// }

//=========SIGN IN

//========CREATE CONNECTION

//========READ=> OWN STATS

//========READ=> ALL OTHER PLAYERS


// players
// CREATE:  connection

// READ:  connection

// DELETE:  connection

//========INV PLAYER TO GAME =>  PLAYER ACCEPTS








//======GAME STARTED=======
// CREATE: inGame: 
// READ:  inGame:
// CREATE: Opponent : UID
// READ: Opponent : UID


// CREATE: Game UID
// READ: Game : UID



// game 
// CREATE: game id
// READ: game id
// DELETE: game id
// CREATE: turn: playerId
// READ: turn: playerId
// UPDATE: turn: playerId


// CREATE: action player1: actionList
// READ: action player1: actionList
// UPDATE:  action player1: actionList


// CREATE: action player2: actionList
// READ: action player2: actionList
// UPDATE:  action player2: actionList

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
import { InGame } from "../interfaces/RTBModels/inGameRTBModel";

let playersConnectedListCurrent : string [] = [];


export function getPlayerConnectionRef(UID:string){
    let playerConRef = ref(database, `players/${UID}/connections`);
    //console.log(playerConRef)
    return playerConRef;
}

export function getPlayerInGameRef(UID:string){
    let playerInGameRef = ref(database, `players/${UID}/inGame`);
    //console.log(playerConRef)
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


            // const inGame:InGame = {
            //    OpponentUID: "danger",
            //    GameUID: 'Test' 
            // }



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

export function getPlayerConnectionList() {
    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
    const playerConnectionListRef = ref(database, 'players');

    onValue(playerConnectionListRef, (snapshot) => {
        const data = snapshot.val();
        //updateStarCount(postElement, data);
        //console.log(data)
    });
    // onChildAdded(ref, (data) => {
    //     console.log("Added",data.key);
    // });

    // onChildRemoved(ref, (data) => {
    //     console.log("Removed", data.key);
    //     //checkPlayerList()
    // });

    // onValue(ref, (snap)=>{
    //     const data = snap.val();
    //     playersConnectedListCurrent = data || {}; // If data is null or undefined, initialize activePlayers as an empty object
    //     console.log("finish", playersConnectedListCurrent)

    //     return data
    // },{
    //     onlyOnce: true
    // });

    // function checkPlayerList(){
    //     let playersConnectedList : string [] = [];

    // }

    //     // onValue(ref, (snap) => {
    //     //     if (snap.val()){
    //     //         const con = push(ref);
    //     //         playersConnectedList = [];
    
    //     //         snap.forEach((childSnapshot) => {
    //     //             const childKey = childSnapshot.key;
    //     //             playersConnectedList.push(childKey)
    //     //         });       
    
    //     //         playersConnectedListCurrent = playersConnectedList
    //     //         console.log("retrieved list", playersConnectedListCurrent)

    //     //         //onDisconnect(lastOnlineRef).set(serverTimestamp());
    //     //         onDisconnect(con)
    //     //         // When I disconnect report it
    //     //         .remove()
    //     //         .then(() => {
    //     //             console.log("Client was removed when getting list")
    //     //             })
    //     //             .catch((error)=>{
    //     //             console.log("Disconnected getting list")
    //     //             printErrorMsg(error)
    //     //         });
                
    //     //         return playersConnectedListCurrent
    //     //     }else{
    //     //         console.log("not connected");
    //     //     }
    //     // },{
    //     //     onlyOnce: true
    //     // });
    // }


    return playersConnectedListCurrent;
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






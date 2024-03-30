import { database } from "../firebase/firebase";
import {
  ref,
  onDisconnect,
  onValue,
  push,
  set,
  serverTimestamp,
  onChildAdded,
  onChildRemoved,
  DatabaseReference,
  get,
  child,
  update
} from "firebase/database";

import { printErrorMsg } from "./errorHandler";
import { playerRTBModel } from "../interfaces/RTBModels/playersRTBModel";
import { InGameRTBModel } from "../interfaces/RTBModels/inGameRTBModel";
import { gameRTBModel, actionList } from "../interfaces/RTBModels/gamesRTBModel";

let playersConnectedListCurrent: string[] = [];


export function getPlayerConnectionRef(UID: string) {
  let playerConRef = ref(database, `players/${UID}/connections`);
  //console.log(playerConRef)
  return playerConRef;
}

export function getPlayerInGameRef(UID: string) {
  let playerInGameRef = ref(database, `players/${UID}/inGame`);
  console.log(playerInGameRef)
  return playerInGameRef;
}

export function getGameRef(gameUID: string) {
  let playerInGameRef = ref(database, `games/${gameUID}`);
  console.log(playerInGameRef)
  return playerInGameRef;
}


// export function handleDataBaseConnection(UID: string) {
//   const connectedRef = ref(database, '.info/connected');
//   const myConnectionsRef = getPlayerConnectionRef(UID);
//   const playerConnectionListRef = ref(database, 'players');
//   //const lastOnlineRef = getLastOnlineRef(UID);

//   console.log("fire")
//   onValue(connectedRef, (snap) => {
//     if (snap.val() === true) {
//       // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
//       const con = push(myConnectionsRef);

//       console.log("Connected to DB");

//       async function waitOneSecond(): Promise<void> {
//         return new Promise<void>((resolve) => {
//           setTimeout(() => {
//             resolve();
//           }, 1000); // Wait for 1 second (1000 milliseconds)
//         });
//       }

//       // // Usage
//       // async function exampleUsage() {
//       //     getPlayerConnectionList(playerConnectionListRef);
//       //     await waitOneSecond(); // Wait for 1 second
//       //     console.log("pls", playersConnectedListCurrent)
//       // }

//       // exampleUsage(); // Call the exampleUsage function
//       // console.log("pls", playersConnectedListCurrent)

//       // let test = getPlayerConnectionList(playerConnectionListRef);
//       // await waitOneSecond(); // Wait for 1 second
//       // console.log("pls", test, playersConnectedListCurrent)


//       //   When I disconnect, update the last time I was seen online
//       //onDisconnect(lastOnlineRef).set(serverTimestamp());
//       onDisconnect(con)
//         // When I disconnect, remove this device
//         .remove()
//         .then(() => {
//           console.log("Client was removed")
//         })
//         .catch((error) => {
//           printErrorMsg(error)
//         });

//       // Add this device to my connections list
//       // this value could contain info about the device or a timestamp too
//       set(con, true);

//     } else {
//       console.log("not connected");
//     }
//   });
// }

export function createConnection(UID: string) {

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

    //   onDisconnect(con)
    //     // When I disconnect, remove this device
    //     .remove()
    //     .then(() => {
    //       console.log("Client was removed")
    //     })
    //     .catch((error) => {
    //       printErrorMsg(error)
    //     });

      // Add this device to my connections list
      // this value could contain info about the device or a timestamp too
      set(con, true);

    } else {
      console.log("Not Connected");
    }
  });

  return connectedRef;
}

export async function createInGame(currentPlayerUID: string, GameUID: string, targetPlayerUID: string) : Promise<InGameRTBModel> {

  const inGame: InGameRTBModel = {
    OpponentUID: targetPlayerUID,
    GameUID: GameUID
  }
  interface UpdateInGame {
    [key: string]: InGameRTBModel
  }

  const updates: UpdateInGame = {};
  updates[`players/${currentPlayerUID}/inGame`] = inGame;

  update(ref(database), updates)
    .then(() => {
      console.log("Updated Succesfully")
    });

    return inGame

}

export async function createGame(currentPlayerUID: string): Promise<string | null> {
  // Generate a new game ID
  const newGameID = push(child(ref(database), 'games')).key;
  //const connectedRef = ref(database, '.info/connected');

  if (newGameID) {
    const gameRef = ref(database, `games/${newGameID}`);
    const playerInGameRef = ref(database, `players/${currentPlayerUID}/inGame`);

    // Initialize the game model with the current player as player1
    const game: gameRTBModel = {
      turn: currentPlayerUID,
      player1ActionList: [], // Assuming these are initialized empty
      player2ActionList: []  // Assuming these are initialized empty
    };

    //console.log("fire",game)
    // Write the new game to the database
    await set(gameRef, game);

    // Set up onDisconnect to remove the game if this player is still the only one when they disconnect
    //onDisconnect(connectedRef).remove();

    // Write the player's in-game reference
    await set(playerInGameRef, { gameUID: newGameID });

    // Set up onDisconnect to remove the player's in-game status
    //onDisconnect(connectedRef).remove();

    console.log("New GameID", newGameID);
    return newGameID;
  } else {
    console.error("Failed to create new game ID");
    return null;
  }
}


// export async function readInGame(currentPlayerUID: string) {
//   onValue(getPlayerInGameRef(currentPlayerUID), (snapshot) => {
//     const data = snapshot.val();
//     console.log(data)
//   })
// }

export async function readInGame(currentPlayerUID: string): Promise<InGameRTBModel | null> {
    const gameRef = getPlayerInGameRef(currentPlayerUID)//ref(database, `player/inGame/`);
    try {
      const snapshot = await get(gameRef);
      if (snapshot.exists()) {
        const data: InGameRTBModel = snapshot.val();
        console.log(data);
        return data; // Return the fetched game data
      } else {
        console.log(`No data found for ingame file with UID: ${currentPlayerUID}`);
        return null; // Return null if no data found
      }
    } catch (error) {
      console.error("Error reading game:", error);
      return null; // Return null in case of error
    }
}

export async function readGame(gameUID: string): Promise<gameRTBModel | null> {
  const gameRef = ref(database, `games/${gameUID}`);
  try {
    const snapshot = await get(gameRef);
    if (snapshot.exists()) {
      const data: gameRTBModel = snapshot.val();
      console.log(data);
      return data; // Return the fetched game data
    } else {
      console.log(`No data found for game with UID: ${gameUID}`);
      return null; // Return null if no data found
    }
  } catch (error) {
    console.error("Error reading game:", error);
    return null; // Return null in case of error
  }
}

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

export async function joinGame(gameUID: string, currentPlayerUID: string) {
  const gameRef = ref(database, `games/${gameUID}`);
  const playerInGameRef = ref(database, `players/${currentPlayerUID}/inGame`);

  console.log("fire")

  readGame(gameUID).then((game)=>{
    createInGame(currentPlayerUID, gameUID,game!.turn)
    console.log(game)
  })
  try {
    const snapshot = await get(gameRef);
    if (snapshot.exists() && !snapshot.val().player2UID) {
      // Update the game to include the second player
      await update(gameRef, { player2UID: currentPlayerUID });
      console.log(`Player ${currentPlayerUID} joined game ${gameUID}`);

      // Update the player's in-game status
      await set(playerInGameRef, { gameUID: gameUID });

      // Set up onDisconnect to possibly allow another player to join if this one disconnects
      //onDisconnect(playerInGameRef).remove();
      onDisconnect(gameRef).update({ player2UID: null }).then(() => {
        console.log("On disconnect setup complete");
      });

      // Additional setup for the player joining the game
      await createInGame(currentPlayerUID, gameUID, "ready to play");
    } else {
      console.error(`Game ${gameUID} is full or doesn't exist.`);
    }
  } catch (error) {
    console.error("Error joining game:", error);
  }
}

// export function listenToGameUpdates(gameUID: string, callback: (gameData: any) => void): void {
//   const gameRef = ref(database, `games/${gameUID}`);

//   onValue(gameRef, (snapshot) => {
//     if (snapshot.exists()) {
//       const gameData = snapshot.val();
//       callback(gameData); // Invoke the callback with the game data
//     } else {
//       console.log(`No data found for game with UID: ${gameUID}`);
//     }
//   });
// }
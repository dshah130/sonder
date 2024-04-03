//Firebase
import { signInAnonymously, onAuthStateChanged } from '@firebase/auth'
import { auth, firestore, database, } from "../firebase/firebase";
import { joinGame, readGame,createGame, createConnection, getPlayerConnectionList, createInGame } from '../handler/firebaseDatabaseHandler';
//Enum
import { Player, BaseStatsPlayer } from '../interfaces/player';

//Handlers
import { printErrorMsg } from '../handler/errorHandler';
import { updatePlayerRef, getPlayerRef } from '../handler/firestoreHandler';
import { MBTI_TYPES, assignMBTIToPlayer, getNewPlayer, getTypeBreakDown } from "../handler/playerTypes"
import { gameRTBModel } from '../interfaces/RTBModels/gamesRTBModel';
import { gameParams } from '../interfaces/broswerModels/gameParams';
import { updatePlayerStatsUI } from './game';

export let MyPlayer: Player = BaseStatsPlayer;

export const newgameParams : gameParams = {
  targetPlayerUID: "",
  currentPlayerUID: "",
  gameUID:""
} 

function signInClient() {
  //=========SIGN IN
  signInAnonymously(auth)
    .then(() => {
      console.log("Client Signed in..")
    })
    .catch((error) => {
      printErrorMsg(error)
    });
}

export function initClient() {
  console.log("client init")
  signInClient();

  // After successful sign-in
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      createConnection(user.uid); // Assuming createConnection sets up the necessary Firebase real-time database connections

      MyPlayer = getNewPlayer()

      MyPlayer.UID = user.uid

      //getTypeBreakDown(MyPlayer)
      updatePlayerStatsUI("player1",MyPlayer)


      updatePlayerRef(user.uid, MyPlayer)
      document.getElementById('GameID')!.innerHTML = "Game ID: " + user.uid

      newgameParams.currentPlayerUID = user.uid

      //updateTypeDropdown(MBTI_TYPES)

      // Now fetch and use the player connections list
      getPlayerConnectionList((playersList) => {
        // Here, you have access to the updated players list
        //console.log("Players connected:", playersList);
        updateDropdown(playersList);
        // You can now do something with this list, like displaying it in the UI or making game-related decisions
      });
    }
  });
  setupUIListeners();
}

export function updateDropdown(playersList: string[]) {
  const playersDropdown = document.getElementById('playersDropdown') as HTMLSelectElement | null;

  if (playersDropdown) {
    playersDropdown.length = 1; // Clear existing options except the first one

    playersList.forEach((playerUid) => {
      if (playerUid !== MyPlayer.UID) {
        const option = new Option(playerUid, playerUid); // Assuming playerUid is what you want to display
        playersDropdown.add(option);
      }
    });
  } else {
    console.error("Dropdown element not found.");
  }
}

// export function updateTypeDropdown(typeList: string[]) {
//   const TypeUpdateInput = document.getElementById('TypeUpdate') as HTMLSelectElement | null;

//   if (TypeUpdateInput) {
//     TypeUpdateInput.length = 1; // Clear existing options except the first one

//     typeList.forEach((t) => {
//       if (t !== MyPlayer.Type) {
//         const option = new Option(t, t); // Assuming playerUid is what you want to display
//         TypeUpdateInput.add(option);
//       }
//     });
//   } else {
//     console.error("Dropdown element not found.");
//   }
// }

function setupUIListeners() {
  document.getElementById("createGameBtn")?.addEventListener('click', async () => {
    createGame(newgameParams).then((gameUID) => {
      if(gameUID){
        newgameParams.gameUID = gameUID
        console.log(`Game created with ID: ${gameUID}`);
      }

    }).then(()=>{
      createInGame(newgameParams.currentPlayerUID,newgameParams.gameUID, newgameParams.targetPlayerUID)

    }).finally(()=>{
    // Format the URL with query parameters
    const currentPlayerUID = newgameParams.currentPlayerUID
    const targetPlayerUID = newgameParams.targetPlayerUID
    const gameUID = newgameParams.gameUID

    const sendGameModel = {
      currentPlayerUID,
      targetPlayerUID,
      gameUID
    }
    const baseUrl = '../game/index.html'; // Base URL of the target page
    // const queryString = new URLSearchParams(sendGameModel).toString(); // Convert parameters to query string
    // const url = `${baseUrl}?${queryString}`; // Combine base URL and query string


    //   // listenToGameUpdates(gameUID, (gameData) => {
    //     // Update the game UI based on `gameData`


    //   console.log(newgameParams)
    //   console.log(url)
    //   window.location.href = url
    goToGamePage(baseUrl);
    })



  });

  document.getElementById("joinGameBtn")?.addEventListener('click', async () => {
    const gameUIDInput = document.getElementById("gameUIDInput") as HTMLInputElement;



        // Format the URL with query parameters
        newgameParams.gameUID = gameUIDInput.value
        console.log('triedgameid',newgameParams.gameUID)

        //read game
        readGame(gameUIDInput.value).then((game)=>{
          console.log(game!.turn)
          newgameParams.targetPlayerUID = game!.turn;
          createInGame(newgameParams.currentPlayerUID,newgameParams.gameUID,game!.turn)
        }).finally(()=>{
        // Format the URL with query parameters
        const baseUrl = '../game/index.html'; // Base URL of the target page

          goToGamePage(baseUrl);
        });

  });

  const playersDropdown = document.getElementById('playersDropdown') as HTMLSelectElement;
  if (playersDropdown) {
    playersDropdown.addEventListener("change", () => {
      const selectedValue = playersDropdown.value
      console.log("Selected Opponent Player:", selectedValue)
      newgameParams.targetPlayerUID = selectedValue
    })
  }

  // const TypeUpdateInput = document.getElementById("TypeUpdate") as HTMLSelectElement;
  // if (TypeUpdateInput) {
  //   TypeUpdateInput.addEventListener("change", () => {
  //     const selectedValue = TypeUpdateInput.value
  //     console.log("Selected Player Type:", selectedValue)
  //     MyPlayer.Type = selectedValue
  //   })
  // }

  // document.getElementById("TypeUpdateBtn")?.addEventListener('click', () => {

  // })
}

function goToGamePage(baseUrl:string){

  const currentPlayerUID = newgameParams.currentPlayerUID
  const targetPlayerUID = newgameParams.targetPlayerUID
  const gameUID = newgameParams.gameUID


  const sendGameModel = {
    currentPlayerUID,
    targetPlayerUID,
    gameUID
  }

  const queryString = new URLSearchParams(sendGameModel).toString(); // Convert parameters to query string
  const url = `${baseUrl}?${queryString}`; // Combine base URL and query string


    // listenToGameUpdates(gameUID, (gameData) => {
      // Update the game UI based on `gameData`


    console.log(newgameParams)
    console.log(url)
    window.location.href = url
}
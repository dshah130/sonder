//Firebase
import { signInAnonymously, onAuthStateChanged } from '@firebase/auth'
import { auth, firestore, database, } from "../firebase/firebase";
import { joinGame, readGame,createGame, createConnection, getPlayerConnectionList, createInGame } from '../handler/firebaseDatabaseHandler';
//Enum
import { Player, BaseStatsPlayer } from '../interfaces/player';

//Handlers
import { printErrorMsg } from '../handler/errorHandler';
import { updatePlayerRef, getPlayerRef } from '../handler/firestoreHandler';
import { assignMBTIToPlayer } from "../handler/playerTypes"
import { gameRTBModel } from '../interfaces/RTBModels/gamesRTBModel';
import { gameParams } from '../interfaces/broswerModels/gameParams';

export const MyPlayer: Player = BaseStatsPlayer;

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

      MyPlayer.UID = user.uid
      MyPlayer.Type = await assignMBTIToPlayer(user.uid)
      updatePlayerRef(user.uid, MyPlayer)
      document.getElementById('GameID')!.innerHTML = "Game ID: " + user.uid

      newgameParams.currentPlayerUID = user.uid

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

        // const currentPlayerUID = newgameParams.currentPlayerUID
        // const targetPlayerUID = newgameParams.targetPlayerUID
        // const gameUID = gameUIDInput.value
      
      
        // const sendGameModel = {
        //   currentPlayerUID,
        //   targetPlayerUID,
        //   gameUID
        // }

        // const baseUrl = '../game/index.html'; // Base URL of the target page
        // const queryString = new URLSearchParams(sendGameModel).toString(); // Convert parameters to query string
        // const url = `${baseUrl}?${queryString}`; // Combine base URL and query string
    

        //read game
        readGame(gameUIDInput.value).then((game)=>{
          console.log(game!.turn)
          newgameParams.targetPlayerUID = game!.turn;
          createInGame(newgameParams.currentPlayerUID,newgameParams.gameUID,game!.turn)
        }).finally(()=>{
        // Format the URL with query parameters
        const baseUrl = '../game/index.html'; // Base URL of the target page
        // const queryString = new URLSearchParams(newgameParams).toString(); // Convert parameters to query string
        // const url = `${baseUrl}?${queryString}`; // Combine base URL and query string


        //   // listenToGameUpdates(gameUID, (gameData) => {
        //     // Update the game UI based on `gameData`


        //   console.log(newgameParams)
        //   console.log(url)
          // window.location.href = url
          goToGamePage(baseUrl);
        });
        //create in game
        // if (gameUIDInput && gameUIDInput.value) {
        //   await joinGame(gameUIDInput.value, MyPlayer.UID).then(()=>{
        //     console.log(gameParams)
        //     console.log(url)
        //     window.location.href = url
        //   })
        //   // listenToGameUpdates(gameUIDInput.value, (gameData) => {
        //   //   // Update the game UI based on `gameData`
        //   // });

        // }


  });

  const playersDropdown = document.getElementById('playersDropdown') as HTMLSelectElement;
  if (playersDropdown) {
    playersDropdown.addEventListener("change", () => {
      const selectedValue = playersDropdown.value
      console.log("Selcted Opponent Player:", selectedValue)
      newgameParams.targetPlayerUID = selectedValue
    })
  }

  document.getElementById("playGameBtn")?.addEventListener('click', () => {

  })
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
//Firebase
import { signInAnonymously, onAuthStateChanged } from '@firebase/auth'
import { auth, firestore, database, } from "../firebase/firebase";
import { listenToGameUpdates, joinGame, createGame, createConnection, getPlayerConnectionList } from '../handler/firebaseDatabaseHandler';
//Enum
import { Player, BaseStatsPlayer } from '../interfaces/player';

//Handlers
import { printErrorMsg } from '../handler/errorHandler';
import { updatePlayerRef, getPlayerRef } from '../handler/firestoreHandler';
import { assignMBTIToPlayer } from "../handler/playerTypes"

export const MyPlayer: Player = BaseStatsPlayer;

export const gameParams = {
  targetPlayerUID: "",
  currentPlayerUID: "",
  gameId:""
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
      console.log(user.uid);
      createConnection(user.uid); // Assuming createConnection sets up the necessary Firebase real-time database connections

      MyPlayer.UID = user.uid
      MyPlayer.Type = await assignMBTIToPlayer(user.uid)
      updatePlayerRef(user.uid, MyPlayer)

      gameParams.currentPlayerUID = user.uid

      // Now fetch and use the player connections list
      getPlayerConnectionList((playersList) => {
        // Here, you have access to the updated players list
        console.log("Players connected:", playersList);
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
    const gameUID = await createGame(MyPlayer.UID);

    if (gameUID) {
      console.log(`Game created with ID: ${gameUID}`);
      gameParams.gameId = gameUID

    // Format the URL with query parameters
    const baseUrl = '../game/index.html'; // Base URL of the target page
    const queryString = new URLSearchParams(gameParams).toString(); // Convert parameters to query string
    const url = `${baseUrl}?${queryString}`; // Combine base URL and query string


      listenToGameUpdates(gameUID, (gameData) => {
        // Update the game UI based on `gameData`
      });

      console.log(gameParams)
      console.log(url)
      window.location.href = url
    }
   


  });

  document.getElementById("joinGameBtn")?.addEventListener('click', async () => {
    const gameUIDInput = document.getElementById("gameUIDInput") as HTMLInputElement;

        // Format the URL with query parameters
        gameParams.gameId = gameUIDInput.value
        console.log('triedgameid',gameParams.gameId)
        const baseUrl = '../game/index.html'; // Base URL of the target page
        const queryString = new URLSearchParams(gameParams).toString(); // Convert parameters to query string
        const url = `${baseUrl}?${queryString}`; // Combine base URL and query string
    
        if (gameUIDInput && gameUIDInput.value) {
          await joinGame(gameUIDInput.value, MyPlayer.UID);
          listenToGameUpdates(gameUIDInput.value, (gameData) => {
            // Update the game UI based on `gameData`
          });
        }

        console.log(gameParams)
        console.log(url)
        window.location.href = url
  });

  const playersDropdown = document.getElementById('playersDropdown') as HTMLSelectElement;
  if (playersDropdown) {
    playersDropdown.addEventListener("change", () => {
      const selectedValue = playersDropdown.value
      console.log("Selcted Opponent Player:", selectedValue)
      gameParams.targetPlayerUID = selectedValue
    })
  }

  document.getElementById("playGameBtn")?.addEventListener('click', () => {

  })
}

function goToGamePage(){

}
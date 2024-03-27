//Firebase
import {signInAnonymously, onAuthStateChanged} from '@firebase/auth'
import {auth, firestore} from "../firebase/firebase";
import {createConnection, getPlayerConnectionList} from '../handler/firebaseDatabaseHandler';

//Enum
import { Player, BaseStatsPlayer } from '../interfaces/player';

//Handlers
import { printErrorMsg } from '../handler/errorHandler';
import { updatePlayerRef, getPlayerRef } from '../handler/firestoreHandler';
import { assignMBTIToPlayer } from "../handler/playerTypes"
import { updateDropdown } from '../client/game';

export const MyPlayer:Player = BaseStatsPlayer;

function signInClient(){
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
  signInClient();

  onAuthStateChanged(auth, async (user) => {
    if(user) {
      console.log(user.uid);
      await createConnection(user.uid); 

      const mbtiType = await assignMBTIToPlayer(user.uid);
      console.log(`Assigned MBTI Type: ${mbtiType}`);

      getPlayerConnectionList((playersList) => {
        console.log("Players connected:", playersList);
        updateDropdown(playersList);
      });
      MyPlayer.Type = mbtiType;
      updatePlayerRef(user.uid, MyPlayer);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initClient();
});

//Firebase
import {signInAnonymously, onAuthStateChanged} from '@firebase/auth'
import {auth, firestore} from "../firebase/firebase";
import {handleDataBaseConnection, getPlayerConnectionRef} from '../handler/firebaseDatabaseHandler';
import { doc, onSnapshot } from "firebase/firestore";

//Enum
import { Player } from '../interfaces/player';

//Handlers
import { printErrorMsg } from '../handler/errorHandler';
import { updatePlayerRef, getPlayerRef } from '../handler/firestoreHandler';

import { initGame } from "../client/game";






//Sign Client in
export function signClientIn(){
    
    //Player: Variables
    let playerUID:string = '';
    let playerRef:any = ''; 
    let playerElements: any =  {};
    const  gameCanvas = document.querySelector(".canvas");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
      playerUID = user.uid;
    
          // Example usage:
      const player: Player = {
        UID: playerUID,
        level: 0,
        SE: 0,
        SL: 0,
        IE: 0,
        IL: 0,
        type: 'ENFP'
      };
    
      updatePlayerRef(user.uid, player);
    
      //Live update to player ref state if change is made
      playerRef = getPlayerConnectionRef(user.uid);

      handleDataBaseConnection(user.uid)
      
      const MyCharacterElement = document.createElement("div") as HTMLDivElement;
      MyCharacterElement.classList.add("Character")
      MyCharacterElement.classList.add("you")
      MyCharacterElement.innerHTML = (`
      <div class="Character_container">
        <span class="Character_UID"><span>
      </div>
      `)

      playerElements[user.uid] = MyCharacterElement; 
      MyCharacterElement.innerText = playerUID

      gameCanvas?.appendChild(MyCharacterElement)
      const container = document.getElementById('GameID');
      container!.innerHTML = "Your Online ID" + playerUID
      //container!.appendChild(MyCharacterElement)

      } else {
          // User is signed out
          // ...
          console.log('User is signed out');
      }
    });

    signInAnonymously(auth)
      .then(() => {
         console.log("Client Signed in..")
      })
      .catch((error) => {
        printErrorMsg(error)
      });

    function initClient(){
      initGame();
    }

}












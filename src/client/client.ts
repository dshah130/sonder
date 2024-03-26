//Firebase
import {signInAnonymously, onAuthStateChanged} from '@firebase/auth'
import {auth, firestore} from "../firebase/firebase";
import {handleDataBaseConnection, getPlayerConnectionRef, createConnection, getPlayerConnectionList} from '../handler/firebaseDatabaseHandler';

//Enum
import { Player, BaseStatsPlayer } from '../interfaces/player';

//Handlers
import { printErrorMsg } from '../handler/errorHandler';
import { updatePlayerRef, getPlayerRef } from '../handler/firestoreHandler';
import { initGame } from "../client/game";
import { assignMBTIToPlayer } from "../handler/playerTypes"

export const MyPlayer:Player = BaseStatsPlayer;


//Sign Client in
export function signClientIn(){
    
    //Player: Variables
    let playerUID:string = '';
    let playerRef:any = ''; 
    let playerElements: any =  {};
    const gameCanvas = document.querySelector(".canvas");

    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/auth.user
    //   playerUID = user.uid;
      
    //   assignMBTIToPlayer(user.uid).then((assignedType) => {
    //   const player: Player = {
    //     UID: playerUID,
    //     level: 0,
    //     SE: 0,
    //     SL: 0,
    //     IE: 0,
    //     IL: 0,
    //     type: assignedType
    //   };

    //   updatePlayerRef(user.uid, player);
    
    //   //Live update to player ref state if change is made
    //   playerRef = getPlayerConnectionRef(user.uid);

    //   handleDataBaseConnection(user.uid)

    //   }).catch(error => {
    //     console.error("Error assigning MBTI type: ", error);
    //   });

      // const MyCharacterElement = document.createElement("div") as HTMLDivElement;
      // MyCharacterElement.classList.add("Character")
      // MyCharacterElement.classList.add("you")
      // MyCharacterElement.innerHTML = (`
      // <div class="Character_container">
      //   <span class="Character_UID"><span>
      // </div>
      // `)

    //   playerElements[user.uid] = MyCharacterElement; 
    //   MyCharacterElement.innerText = playerUID

    //   gameCanvas?.appendChild(MyCharacterElement)
    //   const container = document.getElementById('GameID');
    //   container!.innerHTML = "Your Online ID" + playerUID
    //   //container!.appendChild(MyCharacterElement)

    //   } else {
    //       // User is signed out
    //       console.log('User is signed out');
    //   }
    // });

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

export function initClient(){

  signInClient();


//========CREATE CONNECTION
onAuthStateChanged(auth, (user) => {

  //if user is found
  if(user){
    console.log(user.uid)
    const ref = createConnection(user.uid);
    console.log(ref)
    getPlayerConnectionList()
  }
});

//========READ=> OWN STATS

//========READ=> ALL OTHER PLAYERS
}
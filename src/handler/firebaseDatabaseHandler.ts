import {database} from "../firebase/firebase";
import { ref, onDisconnect, onValue, push, set , serverTimestamp, onChildAdded, onChildRemoved, DatabaseReference , get } from "firebase/database";
import { printErrorMsg } from "./errorHandler";

let playersConnectedListCurrent : string [] = [];

export function getPlayerConnectionRef(UID:string){
    let playerConRef = ref(database, `players/${UID}/connections`);
    //console.log(playerConRef)
    return playerConRef;
}

export function getLastOnlineRef(UID:string){
    const lastOnlineRef = ref(database, `players/${UID}/lastOnline`);
    //console.log(lastOnlineRef)
    //Latency
    onDisconnect(lastOnlineRef).set(serverTimestamp());
    return lastOnlineRef;
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

        // Usage
        async function exampleUsage() {
            getPlayerConnectionList(playerConnectionListRef);
            await waitOneSecond(); // Wait for 1 second
            console.log("pls", playersConnectedListCurrent)
        }

        exampleUsage(); // Call the exampleUsage function
        console.log("pls", playersConnectedListCurrent)

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

export function getPlayerConnectionList(ref:DatabaseReference): string[] {
    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)


    onChildAdded(ref, (data) => {
        console.log("Added",data.key);
    });

    onChildRemoved(ref, (data) => {
        console.log("Removed", data.key);
        //checkPlayerList()
    });

    onValue(ref, (snap)=>{
        const data = snap.val();
        playersConnectedListCurrent = data || {}; // If data is null or undefined, initialize activePlayers as an empty object
        console.log("finish", playersConnectedListCurrent)

        return data
    },{
        onlyOnce: true
    });

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
import * as PIXI from 'pixi.js';
import { healPlayer, healOwnPlayer, damagePlayer, decreaseDecisionTimer, increaseDecisionTimer, lowerPlayerStats, raisePlayerStats, setBlockForNextTurn } from '../actions/actions';
import { getMyUserUID } from '../handler/firebaseAuthHandler'
import { changeGameTurn, getPlayerInGameRef, createInGame, readInGame, createGame, readGame } from '../handler/firebaseDatabaseHandler';
import { firestore } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const app = new PIXI.Application<HTMLCanvasElement>({ width: 600, height: 600 })
const graphics = new PIXI.Graphics();

export function initGame() {

    console.log("init game")
    // Get the query string from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Retrieve parameter values
    const targetPlayerUID = urlParams.get('targetPlayerUID') === null ? "" : urlParams.get('targetPlayerUID');
    const currentPlayerUID = urlParams.get('currentPlayerUID') === null ? "" : urlParams.get('currentPlayerUID');
    const gameUID = urlParams.get('gameUID') === null ? "" : urlParams.get('gameUID');

    console.log(targetPlayerUID, currentPlayerUID, gameUID)

    // Draw a rectangle
    // graphics.beginFill(0xFF0000); // Red color
    // graphics.drawRect(0, 0, 100, 100); // x, y, width, height
    // graphics.endFill();

    // Add the rectangle to the stage
    app.stage.addChild(graphics);

    // Get a reference to the HTML container where you want to append the canvas
    const canvas = document.getElementById('canvas');
    // Append the Pixi.js Application's view (canvas element) to the container
    if (canvas) {
        canvas.appendChild(app.view);
        //Display Game ID
        if(gameUID)
        document.getElementById('GameUID')!.innerHTML = gameUID
    } else {
        console.error("Container element not found");
    }
    
    // getMyUserUID()
    //     .then((uid) => {
    //         console.log(uid, gameUID!, targetPlayerUID!)
    //         //createInGame(uid, gameUID!, targetPlayerUID!)
    //         // console.log("itworks", uid)
    //         // //getPlayerInGameRef(uid)
    //         // createGame(uid).then((gameUID) => {
    //         //     if (gameUID && targetPlayerUID) {
    //         //         createInGame(uid, gameUID, targetPlayerUID)
    //         //     }
    //         //     else {
    //         //         console.log("Couldn't retirieve game uid")
    //         //     }
    //         // })
    //         // //readInGame(uid);
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //     })

    if (targetPlayerUID && currentPlayerUID && gameUID) {
        setupUIListeners(targetPlayerUID, currentPlayerUID, gameUID)
    }
   
    if (currentPlayerUID) {
        setupPlayerStatsListener(currentPlayerUID, 'player1');
    }
    if (targetPlayerUID) {
        setupPlayerStatsListener(targetPlayerUID, 'player2');
    }
}

function setupUIListeners(targetPlayerUID: string, currentPlayerUID: string, gameUID:string) {
    
    const healButton = document.getElementById('healButton');
    if (healButton) {
        healButton.addEventListener('click', () => {
            readGame(gameUID).then((game)=>{
                if(game)
                if(game.turn == currentPlayerUID){
                    healPlayer(targetPlayerUID);
                    changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
                }
            })
        });
    } else {
        console.error('Heal button not found');
    }

    document.getElementById('healOwnButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                healOwnPlayer(currentPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })
    });

    document.getElementById('damageButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                damagePlayer(targetPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })
    });

    document.getElementById('decreaseTimerButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                decreaseDecisionTimer(targetPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                increaseDecisionTimer(currentPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })    
    });

    document.getElementById('lowerStatsButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                lowerPlayerStats(targetPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })      
    });

    document.getElementById('raiseStatsButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                raisePlayerStats(targetPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })   
    });

    document.getElementById('blockButton')?.addEventListener('click', () => {
        readGame(gameUID).then((game)=>{
            if(game)
            if(game.turn == currentPlayerUID){
                setBlockForNextTurn(currentPlayerUID);
                changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
            }
        })    
    });

}

// Setup real time listener for player stats
function setupPlayerStatsListener(playerUID: string, playerPrefix: string) {
    const playerRef = doc(firestore, "players", playerUID);

    onSnapshot(playerRef, (docSnapshot) => {
        console.log(`Received update for player: ${playerUID}`);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data();
            console.log(`Data for player ${playerUID}:`, playerData);
            updatePlayerStatsUI(playerPrefix, playerData);
        } else {
            console.log(`No data found for player with UID: ${playerUID}`);
        }
    });
}

function updatePlayerStatsUI(playerPrefix: string, data: any) {
    const statKeys = ["UID", "Level", "Health", "Damage", "SE", "SL", "IE", "IL", "Type", "Timer"];

    statKeys.forEach((key) => {
        const element = document.getElementById(`${playerPrefix}${key}`);
        
        // Proceed if element exists
        if (element) {
            let value = data[key];
            
            if (value !== undefined && value !== null) {
                element.textContent = value.toString();
            } else {
                element.textContent = (key === "Type") ? "N/A" : "0"; 
            }
        } else {
            console.error(`Element not found for stat: ${key}, with prefix: ${playerPrefix}`);
        }
    });
}
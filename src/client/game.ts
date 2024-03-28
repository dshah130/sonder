import * as PIXI from 'pixi.js';
import { healPlayer, healOwnPlayer, damagePlayer, decreaseDecisionTimer, increaseDecisionTimer, lowerPlayerStats, raisePlayerStats, setBlockForNextTurn } from '../actions/actions';
import {getMyUserUID} from '../handler/firebaseAuthHandler'
import {getPlayerInGameRef, createInGame, readInGame, createGame} from '../handler/firebaseDatabaseHandler';


const app = new PIXI.Application<HTMLCanvasElement>({ width: 600, height: 600 })
const graphics = new PIXI.Graphics();



export function initGame(){

    console.log("init game")
        // Get the query string from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Retrieve parameter values
    const targetPlayerUID = urlParams.get('targetPlayerUID') === null? "" : urlParams.get('targetPlayerUID') ;
    const currentPlayerUID = urlParams.get('currentPlayerUID') === null? "" :  urlParams.get('currentPlayerUID');  
    console.log(targetPlayerUID,currentPlayerUID)

    // Draw a rectangle
    graphics.beginFill(0xFF0000); // Red color
    graphics.drawRect(0, 0, 100, 100); // x, y, width, height
    graphics.endFill();

    // Add the rectangle to the stage
    app.stage.addChild(graphics);

    // Get a reference to the HTML container where you want to append the canvas
    const canvas = document.getElementById('canvas');
    // Append the Pixi.js Application's view (canvas element) to the container
    if (canvas) {
        canvas.appendChild(app.view);
    } else {
        console.error("Container element not found");
    }
    getMyUserUID()
    .then((uid)=>{
        console.log("itworks",uid)
        //getPlayerInGameRef(uid)
        createGame(uid).then((gameUID)=>{
            if(gameUID && targetPlayerUID){
                createInGame(uid,gameUID,targetPlayerUID)
            }
            else{
                console.log("Couldn't retirieve game uid")
            }
        })
        //readInGame(uid);
    })
    .catch((error)=>{
        console.log(error)
    })
    if(targetPlayerUID && currentPlayerUID){
        setupUIListeners(targetPlayerUID,currentPlayerUID)
    }
}

function setupUIListeners(targetPlayerUID:string , currentPlayerUID:string ) {
    const healButton = document.getElementById('healButton');
    if (healButton) {
        healButton.addEventListener('click', () => {
            healPlayer(targetPlayerUID);
        });
    } else {
        console.error('Heal button not found');
    }
    
    document.getElementById('healOwnButton')?.addEventListener('click', () => {
        healOwnPlayer(currentPlayerUID);
    });

    document.getElementById('damageButton')?.addEventListener('click', () => {
        damagePlayer(targetPlayerUID);
    });

    document.getElementById('decreaseTimerButton')?.addEventListener('click', () => {
        decreaseDecisionTimer(targetPlayerUID);
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        increaseDecisionTimer(currentPlayerUID);
    });

    document.getElementById('lowerStatsButton')?.addEventListener('click', () => {
        lowerPlayerStats(targetPlayerUID);
    });

    document.getElementById('raiseStatsButton')?.addEventListener('click', () => {
        raisePlayerStats(targetPlayerUID);
    });

    document.getElementById('blockButton')?.addEventListener('click', () => {
        setBlockForNextTurn(currentPlayerUID);
    });

}

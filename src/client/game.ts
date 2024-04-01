import { healPlayer, healOwnPlayer, damagePlayer, decreaseDecisionTimer, increaseDecisionTimer, lowerPlayerStats, raisePlayerStats, setBlockForNextTurn } from '../actions/actions';
import { getMyUserUID } from '../handler/firebaseAuthHandler'
import { changeGameTurn, getPlayerInGameRef, createInGame, readInGame, createGame, readGame, addToActionList, getCurrenTurnRef } from '../handler/firebaseDatabaseHandler';
import { firestore } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { gameParams } from '../interfaces/broswerModels/gameParams';
import { ActionEnum } from '../enums/actionEnum';
import { onValue } from 'firebase/database';
import { gameRTBModel } from '../interfaces/RTBModels/gamesRTBModel';
import { getPlayerData } from '../handler/firestoreHandler';
import Phaser from 'phaser';


// class MainScene extends Phaser.Scene {
//     constructor() {
//       super({ key: 'MainScene' });
//     }
  
//     preload() {
//         this.load.atlas('filename', '/assets/spritesheet.png', '/assets/spritesheet.json');
//         console.log(this.textures.list);

//     }  
//     create() {
//         initGame();
//         // this.drawGraphics();
//         this.anims.create({
//             key: 'dead',
//             frames: this.anims.generateFrameNames('filename', {
//                 prefix: 'Dead (',
//                 suffix: ').png',
//                 start: 1,
//                 end: 15,
//                 zeroPad: 1
//             }),
//             frameRate: 10,
//             repeat: 1
//         });
//         let characterSprite = this.add.sprite(0, 0, 'filename').play('dead');
//         characterSprite.play("dead");
//         console.log("works")
//     }
    
//     // drawGraphics() {
//     //     let graphics = this.add.graphics();
//     //     graphics.fillStyle(0xFF0000, 1);
//     //     graphics.fillRect(50, 50, 100, 100);
//     // }
//  }

 

class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MyScene' });
    }

    preload() {
        // Load the sprite sheet image
        // this.load.animation('gemData', 'assets/spritesheet.json');
        this.load.atlas('filename', 'assets/spritesheet.png', 'assets/spritesheet.json');
        // this.load.animation('gemData', 'assets/gems.json');
        // this.load.atlas('gems', 'assets/gems.png', 'assets/gems.json');
        // this.load.image('spritesheet', 'assets/spritesheet.png');
    }

    create() {
        // this.add.sprite(400, 100, 'gems').play('diamond');
        // this.add.sprite(400, 200, 'gems').play('prism');
        // this.add.sprite(400, 300, 'gems').play('ruby');
        // this.add.sprite(400, 400, 'gems').play('square');

        this.anims.create({
            key: 'Dead',
            frames: this.anims.generateFrameNames('filename', {
                prefix: 'Dead (',
                suffix: ').png',
                start: 1,
                end: 15,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'Idle',
            frames: this.anims.generateFrameNames('filename', {
                prefix: 'Idle (',
                suffix: ').png',
                start: 1,
                end: 15,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'Jump',
            frames: this.anims.generateFrameNames('filename', {
                prefix: 'Jump (',
                suffix: ').png',
                start: 1,
                end: 15,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'Run',
            frames: this.anims.generateFrameNames('filename', {
                prefix: 'Run (',
                suffix: ').png',
                start: 1,
                end: 15,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        //let characterSprite = this.add.sprite(400, 200, 'filename').play('dead');
        // let characterSprite = this.add.sprite(400, 200, 'filename').play('jump');
        // characterSprite.play("jump");
        console.log("works")

        // Get the texture of the loaded image

        // Once the sprite sheet is loaded, continue with the rest of your code...
    }
}

// const gameConfig = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     scene: MyScene
// };

  //Phaser game configuration
  const gameConfig = {
    type: Phaser.AUTO,
    width: 900,
    height: 600,
    parent: 'canvas', 
    scene: [MyScene]
  };


export function initGame() {

    console.log("init game")
    // Get the query string from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Retrieve parameter values
    const gameParams = {
        targetPlayerUID: urlParams.get('targetPlayerUID') === null ? "" : urlParams.get('targetPlayerUID'),
        currentPlayerUID: urlParams.get('currentPlayerUID') === null ? "" : urlParams.get('currentPlayerUID'),
        gameUID: urlParams.get('gameUID') === null ? "" : urlParams.get('gameUID')
    } as gameParams

    console.log(gameParams.targetPlayerUID, gameParams.currentPlayerUID, gameParams.gameUID) 

    // Draw a rectangle
    // graphics.beginFill(0xFF0000); // Red color
    // graphics.drawRect(0, 0, 100, 100); // x, y, width, height
    // graphics.endFill();

    // Add the rectangle to the stage
    // app.stage.addChild(graphics);

    // // Get a reference to the HTML container where you want to append the canvas
    const canvas = document.getElementById('canvas');
    // Append the Pixi.js Application's view (canvas element) to the container
    if (canvas) {
        new Phaser.Game(gameConfig);
        if(gameParams.gameUID)
        document.getElementById('GameUID')!.innerHTML = gameParams.gameUID
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

    if (gameParams) {
        setupUIListeners(gameParams);
        setupPlayerStatsListener(gameParams.currentPlayerUID, 'player1');
        setupPlayerStatsListener(gameParams.targetPlayerUID, 'player2');
        //syncGameTurn(gameParams)
    }
}

function setupUIListeners(gameParams:gameParams) {
    
    const healButton = document.getElementById('healButton');
    if (healButton) {
        healButton.addEventListener('click', () => {
            syncGameAction(gameParams,ActionEnum.healOther)
        });
    } else {
        console.error('Heal button not found');
    }

    document.getElementById('healOwnButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         healOwnPlayer(currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(gameParams,ActionEnum.healSelf)
    });

    document.getElementById('damageButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         damagePlayer(targetPlayerUID,currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(gameParams,ActionEnum.damage)
    });

    document.getElementById('decreaseTimerButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         decreaseDecisionTimer(targetPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(gameParams,ActionEnum.decreaseTimer)
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         increaseDecisionTimer(currentPlayerUID);

        //     }
        // })
        syncGameAction(gameParams,ActionEnum.increaseTimer)
   
    });

    document.getElementById('lowerStatsButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         lowerPlayerStats(targetPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(gameParams,ActionEnum.lowerStats)
      
    });

    document.getElementById('raiseStatsButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         raisePlayerStats(currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(gameParams,ActionEnum.raiseStats)
   
    });

    document.getElementById('blockButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         setBlockForNextTurn(currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(gameParams,ActionEnum.block)
    
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

function syncGameAction(gameParams:gameParams, syncGameAction:ActionEnum){

    readGame(gameParams.gameUID).then((game)=>{
        if(game)
        if(game.turn == gameParams.currentPlayerUID){

            switch (syncGameAction){

                case ActionEnum.damage :{
                    damagePlayer(gameParams.targetPlayerUID,gameParams.currentPlayerUID)
                    break;
                }
        
                case ActionEnum.healSelf :{
                    healOwnPlayer(gameParams.currentPlayerUID)
                    break;
                }
        
                case ActionEnum.healOther :{
                    healPlayer(gameParams.targetPlayerUID)
                    break;
                }
        
                case ActionEnum.decreaseTimer :{
                    decreaseDecisionTimer(gameParams.targetPlayerUID)
                    break;
                }
        
                case ActionEnum.increaseTimer :{
                    increaseDecisionTimer(gameParams.currentPlayerUID)
                    break;
                }
        
                case ActionEnum.lowerStats :{
                    lowerPlayerStats(gameParams.targetPlayerUID)
                }
        
                case ActionEnum.raiseStats :{
                    raisePlayerStats(gameParams.currentPlayerUID);
                    break;
                }
                
                case ActionEnum.block :{
                    setBlockForNextTurn(gameParams.currentPlayerUID);
                    break;
                }
        
                default:
                    console.log("Action Not Received")
            }
            //addToActionList(gameParams,syncGameAction)
            changeGameTurn(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID);

        }
    });
}

function syncGameTurn(gameParams:gameParams){

    const gameTurnCount:number = 0

    getCurrenTurnRef(gameParams)
      onValue(getCurrenTurnRef(gameParams)
      , (snapshot) => {
    if(snapshot.exists()){
      const data:string = snapshot.val();
      if(data){
        if(data == gameParams.currentPlayerUID){   
            readGame(gameParams.gameUID).then((game)=>{
                getPlayerData(data).then((playerData)=>{
                    // setTimeout(() => {
                    //     console.log("Timer completed"); // Action to perform when the timer completes
                    //     changeGameTurn(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID)
                    //     // Perform any other actions here
                    // }, playerData!.Timer * 1000);
                    startTimer(playerData!.Timer).then(()=>{
                        changeGameTurn(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID)
                    })
                })
            })
        }
        else{
          return null          
        }
      }
    }
  });
}

function updateTimer(seconds: number) {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `Time Left: ${seconds} seconds`;
    }
}

async function startTimer(seconds: number) {
    try {
        console.log(`Timer started for ${seconds} seconds`);
        updateTimer(seconds);

        // Start the timer using setTimeout
        let remainingSeconds = seconds;
        const timerInterval = setInterval(() => {
            remainingSeconds--;
            updateTimer(remainingSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(timerInterval);
                console.log("Timer completed");
                // Perform any actions you need when the timer completes
            }
        }, 1000); // Update timer every second (1000 milliseconds)
    } catch (error) {
        console.error("Error:", error);
        // Handle error
    }
}
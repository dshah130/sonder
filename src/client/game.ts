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

class MyScene extends Phaser.Scene {
    private healSprite!: Phaser.GameObjects.Sprite;
    private healYourSprite!: Phaser.GameObjects.Sprite;
    private damageSprite!: Phaser.GameObjects.Sprite;
    private lowerStatsSprite!: Phaser.GameObjects.Sprite;
    private raiseStatsSprite!: Phaser.GameObjects.Sprite;
    private blockSprite!: Phaser.GameObjects.Sprite;
    private increaseTimerSprite!: Phaser.GameObjects.Sprite;
    private decreaseTimerSprite!: Phaser.GameObjects.Sprite;
    private boySprite!: Phaser.GameObjects.Sprite;
    private girlSprite!: Phaser.GameObjects.Sprite;
    private backgroundSprite!: Phaser.GameObjects.Sprite;
    private gameOverText!: Phaser.GameObjects.Text;


    constructor() {
        super({ key: 'MyScene' });
    }

    preload() {
        this.load.image("background",'assets/background.jpg');
        // Load the sprite sheet image
        this.load.atlas('filename', 'assets/spritesheet.png', 'assets/spritesheet.json');
        this.load.atlas('girl', 'assets/girl.png', 'assets/girl.json');
        this.load.atlas('water', 'assets/water.png', 'assets/water.json');
        this.load.atlas('water2', 'assets/water2.png', 'assets/water2.json');
        this.load.atlas('fire', 'assets/fire.png', 'assets/fire.json');
        this.load.atlas('fire2', 'assets/fire2.png', 'assets/fire2.json');
        this.load.atlas('water3', 'assets/water3.png', 'assets/water3.json');
        this.load.atlas('slash', 'assets/slash.png', 'assets/slash.json');
        this.load.atlas('slash2', 'assets/slash2.png', 'assets/slash2.json');
    }
    // Get the size of the window
    create() {
        this.anims.create({
            key: 'boyDead',
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
            key: 'boyIdle',
            frames: this.anims.generateFrameNames('filename', {
                prefix: 'Idle (',
                suffix: ').png',
                start: 1,
                end: 15,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'boyJump',
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
            key: 'boyRun',
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

        this.anims.create({
            key: 'girlDead',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'Dead (',
                suffix: ').png',
                start: 1,
                end: 30,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'girlIdle',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'Idle (',
                suffix: ').png',
                start: 1,
                end: 16,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'girlJump',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'Jump (',
                suffix: ').png',
                start: 1,
                end: 30,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'girlRun',
            frames: this.anims.generateFrameNames('girl', {
                prefix: 'Run (',
                suffix: ').png',
                start: 1,
                end: 20,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'water',
            frames: this.anims.generateFrameNames('water', {
                start: 70000, 
                end: 70013, 
                zeroPad: 5, 
                prefix: 'water', 
                suffix: '.png' 
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'water2',
            frames: this.anims.generateFrameNames('water2', {
                prefix: 'water',
                suffix: '.png',
                start: 90000,
                end: 90041,
                zeroPad: 5
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNames('fire', {
                prefix: '',
                suffix: '.png',
                start: 0,
                end: 15,
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fire2',
            frames: this.anims.generateFrameNames('fire2', {
                prefix: 'png_',
                suffix: '.png',
                start: 0,
                end: 83,
                zeroPad: 2
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'water3',
            frames: this.anims.generateFrameNames('water3', {
                prefix: 'water',
                suffix: '.png',
                start: 40000,
                end: 40015,
                zeroPad: 5
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNames('slash', {
                prefix: 'skash_',
                suffix: '.png',
                start: 1,
                end: 12,
                zeroPad: 5
            }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'slash2',
            frames: this.anims.generateFrameNames('slash2', {
                prefix: 'slash9_',
                suffix: '.png',
                start: 1,
                end: 9,
                zeroPad: 5
            }),
            frameRate: 10,
            repeat: 0
        });
        const width = this.game.canvas.width;
        const height = this.game.canvas.height;

         this.backgroundSprite = this.add.sprite(width/2,height/2,'background')
         this.backgroundSprite.scaleX *=0.2;
         this.backgroundSprite.scaleY *=0.2;

         this.healSprite = this.add.sprite(width/2, 300, 'water').setVisible(false);
         
         this.healYourSprite = this.add.sprite(width * 0.3, 300, 'water2').setVisible(false);
         this.healYourSprite.scaleX *=0.25;
         this.healYourSprite.scaleY *=0.25;
         this.healYourSprite.x = width * 0.2;

         this.damageSprite = this.add.sprite(400, 300, 'fire').setVisible(false);
         this.damageSprite.x = width * 0.6;

         this.lowerStatsSprite = this.add.sprite(width/2, 300, 'water3').setVisible(false);
         this.lowerStatsSprite.scaleX *=0.2;
         this.lowerStatsSprite.scaleY *=0.2;
         this.lowerStatsSprite.x = width * 0.70;
         this.lowerStatsSprite.y = height * 0.90;

         this.raiseStatsSprite = this.add.sprite(width/2, 300, 'fire2').setVisible(false);
         this.raiseStatsSprite.scaleX *=0.4;
         this.raiseStatsSprite.scaleY *=0.4;
         this.raiseStatsSprite.x = width * 0.2;
         this.raiseStatsSprite.y = height * 0.93;
         
         this.blockSprite = this.add.sprite(width/2, 300, 'slash').setVisible(false);
        //  this.blockSprite.scaleX *=0.5;
        //  this.blockSprite.scaleY *=0.5;
         this.blockSprite.x = width * 0.3;
         
         this.increaseTimerSprite = this.add.sprite(400, 300, 'slash2').setVisible(false);
         this.decreaseTimerSprite = this.add.sprite(400, 300, 'slash2').setVisible(false);
        this.boySprite = this.add.sprite(400, 300, 'boyIdle').play('boyIdle')
        this.girlSprite = this.add.sprite(400, 300, 'girlIdle').play('girlIdle')

        //this.girlSprite = this.add.sprite(100, 300, 'girlIdle').play('girlIdle')
         this.girlSprite.scaleX *= -0.4;
         this.girlSprite.scaleY *= 0.4;
         this.girlSprite.x = width * 0.7;
        // this.girlSprite.scaleY *= 1;
        this.boySprite.scaleX *= 0.4;
        this.boySprite.scaleY *= 0.4;
        this.boySprite.x = width * 0.3;

        this.gameOverText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Game Over', {
            fontSize: '36px',
            color: 'red',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5).setAlpha(0);

        // this.gameOverText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Game Over', {
        //     fontSize: '32px',
        //     color: '#fff',
        //     fontFamily: 'Arial'
        // }).setOrigin(0.5, 0.5);

        console.log("=====================\nGame has finished loading")
        console.log("============SONDER============")
    }
    triggerHealAnimation() {
        if (this.healSprite) {
            this.healSprite.setVisible(true);
            this.healSprite.play('water');
        }
    }
    triggerHealYourAnimation() {
        if (this.healYourSprite) {
            this.healYourSprite.setVisible(true);
            this.healYourSprite.play('water2');
        }
    }
    triggeDamageAnimation(){
        if (this.damageSprite) {
            this.damageSprite.setVisible(true);
            this.damageSprite.play('fire');
        }
    }
    triggeLowerStatsAnimation(){
        if (this.lowerStatsSprite) {
            this.lowerStatsSprite.setVisible(true);
            this.lowerStatsSprite.play('water3');
        }
    }
    triggeRaiseStatsAnimation(){
        if (this.raiseStatsSprite) {
            this.raiseStatsSprite.setVisible(true);
            this.raiseStatsSprite.play('fire2');
        }
    }
    triggeBlockAnimation(){
        if (this.blockSprite) {
            this.blockSprite.setVisible(true);
            this.blockSprite.play('slash');
        }
    }
    triggeIncreaseTimerAnimation(){
        if (this.increaseTimerSprite) {
            this.increaseTimerSprite.setVisible(true);
            this.increaseTimerSprite.play('slash2');
        }
    }
    triggeDecreaseTimerAnimation(){
        if (this.decreaseTimerSprite) {
            this.decreaseTimerSprite.setVisible(true);
            this.decreaseTimerSprite.play('slash2');
        }
    }
    // resizeGame(newGameWidth:number,newGameHeight:number){
    //     const width = window.innerWidth;
    //     const height = window.innerHeight;
        
    //     // // Update sprite dimensions
    //     this.boySprite.x = 300;
    //     this.boySprite.y = 200;
    //     // this.boySprite.scaleX *= newGameWidth/width;
    //     // this.boySprite.scaleY *= newGameHeight/height;
    //     this.boySprite.scaleX = newGameWidth/width;
    //     this.boySprite.scaleY = newGameHeight/height;
    //     // Optionally, you can scale the sprite
    //     // based on the ratio of the new size to the original size
    //     // const scaleX = width // this.game.config.width;
    //     // const scaleY = height // this.game.config.height;

    // }


    animateGameOverText() {
        // Tween to fade in the text
        this.tweens.add({
            targets: this.gameOverText,
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
            onComplete: () => {
                // Tween to fade out the text after it's faded in
                this.tweens.add({
                    targets: this.gameOverText,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Linear',
                    repeat: 0,
                    delay: 5000, // Delay before starting the fade-out animation
                    onComplete: () => {
                        // Optionally, you can restart the scene or do other actions here
                    }
                });
            }
        });
        console.log("=======================\nGAME OVER\n=======================\n ")
    }
}

export function initGame() {

    console.log("Initiating Game")
    console.log("=====================")
    // Get the query string from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Retrieve parameter values
    const gameParams = {
        targetPlayerUID: urlParams.get('targetPlayerUID') === null ? "" : urlParams.get('targetPlayerUID'),
        currentPlayerUID: urlParams.get('currentPlayerUID') === null ? "" : urlParams.get('currentPlayerUID'),
        gameUID: urlParams.get('gameUID') === null ? "" : urlParams.get('gameUID')
    } as gameParams

    //console.log(gameParams.targetPlayerUID, gameParams.currentPlayerUID, gameParams.gameUID) 

    // // Get a reference to the HTML container where you want to append the canvas
    const canvas = document.getElementById('canvas');
    // Append the Pixi.js Application's view (canvas element) to the container
    if (canvas) {
        
        if(gameParams.gameUID)
        document.getElementById('GameUID')!.innerHTML = gameParams.gameUID
    } else {
        //console.error("Container element not found");
    }

    // Get the size of the window
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set the scale ratio for your game (e.g., 0.8 for 80% of the viewport size)
    const wscaleRatio = 0.8;
    const hscaleRatio = 0.3;
    // Calculate the dimensions of the Phaser game canvas
    const gameWidth = width * wscaleRatio;
    const gameHeight = height * hscaleRatio;

    //Phaser game configuration
    const gameConfig = {
        type: Phaser.AUTO,
        // width: gameWidth,
        // height: gameHeight,
        width: 800,
        height: 400,
        parent: 'canvas', 
        scene: [MyScene],
    };

    const game = new Phaser.Game(gameConfig);

    // window.addEventListener('resize', () => {
    //     const newWidth = window.innerWidth;
    //     const newHeight = window.innerHeight;

    //     const newGameWidth = newWidth * wscaleRatio;
    //     const newGameHeight = newHeight * hscaleRatio;

    //     //game.scale.resize(newGameWidth, newGameHeight);
    //     const scene = game.scene.getScene('MyScene') as MyScene;
    //     scene.resizeGame(newGameWidth,newGameHeight)
    //     // game.scene.scenes.forEach((scene: Phaser.Scene) => {
    //     // });

    //     });

    if (gameParams) {
        setupUIListeners(game, gameParams);
        setupPlayerStatsListener(game, gameParams.currentPlayerUID, gameParams,'player1');
        setupPlayerStatsListener(game, gameParams.targetPlayerUID, gameParams ,'player2');
        //syncGameTurn(gameParams)
    }
}

function setupUIListeners(game: Phaser.Game, gameParams:gameParams) {

    const healButton = document.getElementById('healButton');
    if (healButton) {
        healButton.addEventListener('click', () => {
            syncGameAction(game,gameParams,ActionEnum.healOther)
            
        });
    } else {
        //console.error('Heal button not found');
    }

    document.getElementById('healOwnButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         healOwnPlayer(currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(game,gameParams,ActionEnum.healSelf)
    });

    document.getElementById('damageButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         damagePlayer(targetPlayerUID,currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(game,gameParams,ActionEnum.damage)
    });

    document.getElementById('decreaseTimerButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         decreaseDecisionTimer(targetPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(game,gameParams,ActionEnum.decreaseTimer)
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         increaseDecisionTimer(currentPlayerUID);

        //     }
        // })
        syncGameAction(game,gameParams,ActionEnum.increaseTimer)
   
    });

    document.getElementById('lowerStatsButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         lowerPlayerStats(targetPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(game,gameParams,ActionEnum.lowerStats)
      
    });

    document.getElementById('raiseStatsButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         raisePlayerStats(currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })

        syncGameAction(game,gameParams,ActionEnum.raiseStats)
   
    });

    document.getElementById('blockButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         setBlockForNextTurn(currentPlayerUID);
        //         changeGameTurn(targetPlayerUID,currentPlayerUID,gameUID);
        //     }
        // })
        syncGameAction(game,gameParams,ActionEnum.block)
    });

}

// Setup real time listener for player stats
function setupPlayerStatsListener(game :Phaser.Game,playerUID: string, gameParams:gameParams,playerPrefix: string) {
    const playerRef = doc(firestore, "players", playerUID);

    onSnapshot(playerRef, (docSnapshot) => {
        //console.log(`Received update for player: ${playerUID}`);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data();
            if(gameParams.currentPlayerUID==playerUID){
                console.log(`=====================\nYour stats have been updated:`);
            }
            if(playerData){
                if(playerData.Health == 0){
                    changeGameTurn("GAMEOVER",gameParams.currentPlayerUID,gameParams.gameUID)
                    const scene = game.scene.getScene('MyScene') as MyScene;
                    scene.animateGameOverText()
                    console.log(`=====================\nGAMEOVER ${playerUID} cannot have health reduced below 0.`);
                    
                }
            }
            //console.log(`Data for player ${playerUID}:`, playerData);
            updatePlayerStatsUI(playerPrefix, playerData);
        } else {
            console.log(`No data found for player with UID: ${playerUID}`);
        }
    });
}

function updatePlayerStatsUI(playerPrefix: string, data: any) {
    const statKeys = ["UID", "Health", "Damage", "SE", "SL", "IE", "IL", "Type"];

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
            //console.error(`Element not found for stat: ${key}, with prefix: ${playerPrefix}`);
        }
    });
}

function syncGameAction(game: Phaser.Game, gameParams:gameParams, syncGameAction:ActionEnum){
    
    const scene = game.scene.getScene('MyScene') as MyScene;

    readGame(gameParams.gameUID).then((gameRes)=>{
        if(gameRes){
            if(gameRes.turn == gameParams.currentPlayerUID){

                switch (syncGameAction){
    
                    case ActionEnum.damage :{
                        damagePlayer(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID)
                        scene.triggeDamageAnimation();
                        break;
                    }
            
                    case ActionEnum.healSelf :{
                        healOwnPlayer(gameParams.currentPlayerUID)
                        scene.triggerHealYourAnimation();
                        break;
                    }
            
                    case ActionEnum.healOther :{
                        healPlayer(gameParams.targetPlayerUID)
                        scene.triggerHealAnimation();
                        break;
                    }
            
                    case ActionEnum.decreaseTimer :{
                        decreaseDecisionTimer(gameParams.targetPlayerUID)
                        scene.triggeDecreaseTimerAnimation();
                        break;
                    }
            
                    case ActionEnum.increaseTimer :{
                        increaseDecisionTimer(gameParams.currentPlayerUID)
                        scene.triggeIncreaseTimerAnimation();
                        break;
                    }
            
                    case ActionEnum.lowerStats :{
                        lowerPlayerStats(gameParams.targetPlayerUID)
                        scene.triggeLowerStatsAnimation();
                        break;
                    }
            
                    case ActionEnum.raiseStats :{
                        raisePlayerStats(gameParams.currentPlayerUID);
                        scene.triggeRaiseStatsAnimation();
                        break;
                    }
                    
                    case ActionEnum.block :{
                        setBlockForNextTurn(gameParams.currentPlayerUID);
                        scene.triggeBlockAnimation();
                        break;
                    }
            
                    default:
                        console.log("Action Not Received")
                }
                //addToActionList(gameParams,syncGameAction)
                changeGameTurn(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID);
            }
            else{
                console.log("=====================\nIt is not your turn")
            }
        }
    });
}

// function syncGameTurn(gameParams:gameParams){

//     const gameTurnCount:number = 0

//     getCurrenTurnRef(gameParams)
//       onValue(getCurrenTurnRef(gameParams)
//       , (snapshot) => {
//     if(snapshot.exists()){
//       const data:string = snapshot.val();
//       if(data){
//         if(data == gameParams.currentPlayerUID){   
//             readGame(gameParams.gameUID).then((game)=>{
//                 getPlayerData(data).then((playerData)=>{
//                     // setTimeout(() => {
//                     //     console.log("Timer completed"); // Action to perform when the timer completes
//                     //     changeGameTurn(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID)
//                     //     // Perform any other actions here
//                     // }, playerData!.Timer * 1000);
//                     startTimer(playerData!.Timer).then(()=>{
//                         changeGameTurn(gameParams.targetPlayerUID,gameParams.currentPlayerUID,gameParams.gameUID)
//                     })
//                 })
//             })
//         }
//         else{
//           return null          
//         }
//       }
//     }
//   });
// }

// function updateTimer(seconds: number) {
//     const timerElement = document.getElementById('timer');
//     if (timerElement) {
//         timerElement.textContent = `Time Left: ${seconds} seconds`;
//     }
// }

// async function startTimer(seconds: number) {
//     try {
//         console.log(`Timer started for ${seconds} seconds`);
//         updateTimer(seconds);

//         // Start the timer using setTimeout
//         let remainingSeconds = seconds;
//         const timerInterval = setInterval(() => {
//             remainingSeconds--;
//             updateTimer(remainingSeconds);

//             if (remainingSeconds <= 0) {
//                 clearInterval(timerInterval);
//                 console.log("Timer completed");
//                 // Perform any actions you need when the timer completes
//             }
//         }, 1000); // Update timer every second (1000 milliseconds)
//     } catch (error) {
//         console.error("Error:", error);
//         // Handle error
//     }
// }


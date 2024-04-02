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

    constructor() {
        super({ key: 'MyScene' });
    }

    preload() {
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
            repeat: 1
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
            repeat: 1
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
         
         this.healSprite = this.add.sprite(400, 300, 'water').setVisible(false);
         this.healYourSprite = this.add.sprite(400, 300, 'water2').setVisible(false);
         this.damageSprite = this.add.sprite(400, 300, 'fire').setVisible(false);
         this.lowerStatsSprite = this.add.sprite(400, 300, 'fire2').setVisible(false);
         this.raiseStatsSprite = this.add.sprite(400, 300, 'water3').setVisible(false);
         this.blockSprite = this.add.sprite(400, 300, 'slash').setVisible(false);
         this.increaseTimerSprite = this.add.sprite(400, 300, 'slash2').setVisible(false);
         this.decreaseTimerSprite = this.add.sprite(400, 300, 'slash2').setVisible(false);

        console.log("works")
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
            this.lowerStatsSprite.play('fire2');
        }
    }
    triggeRaiseStatsAnimation(){
        if (this.raiseStatsSprite) {
            this.raiseStatsSprite.setVisible(true);
            this.raiseStatsSprite.play('water3');
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
}

  //Phaser game configuration
  const gameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: 'canvas', 
    scene: [MyScene],
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

    // // Get a reference to the HTML container where you want to append the canvas
    const canvas = document.getElementById('canvas');
    const game = new Phaser.Game(gameConfig);
    // Append the Pixi.js Application's view (canvas element) to the container
    if (canvas) {
        game
        if(gameParams.gameUID)
        document.getElementById('GameUID')!.innerHTML = gameParams.gameUID
    } else {
        console.error("Container element not found");
    }

    if (gameParams) {
        setupUIListeners(game, gameParams);
        setupPlayerStatsListener(gameParams.currentPlayerUID, 'player1');
        setupPlayerStatsListener(gameParams.targetPlayerUID, 'player2');
        //syncGameTurn(gameParams)
    }
}

function setupUIListeners(game: Phaser.Game, gameParams:gameParams) {

    const healButton = document.getElementById('healButton');
    if (healButton) {
        healButton.addEventListener('click', () => {
            const scene = game.scene.getScene('MyScene') as MyScene;
            scene.triggerHealAnimation();
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
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggerHealYourAnimation();
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
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggeDamageAnimation();
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
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggeDecreaseTimerAnimation();
        syncGameAction(gameParams,ActionEnum.decreaseTimer)
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        // readGame(gameUID).then((game)=>{
        //     if(game)
        //     if(game.turn == currentPlayerUID){
        //         increaseDecisionTimer(currentPlayerUID);

        //     }
        // })
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggeIncreaseTimerAnimation();
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
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggeLowerStatsAnimation();
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
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggeRaiseStatsAnimation();
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
        const scene = game.scene.getScene('MyScene') as MyScene;
        scene.triggeBlockAnimation();
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
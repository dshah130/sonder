import * as PIXI from 'pixi.js';
import { healPlayer, healOwnPlayer, damagePlayer, decreaseDecisionTimer, increaseDecisionTimer, lowerPlayerStats, raisePlayerStats, setBlockForNextTurn } from '../actions/actions';

const app = new PIXI.Application<HTMLCanvasElement>({ width: 600, height: 600 })
const graphics = new PIXI.Graphics();

export function initGame(){
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
        console.log("It works")
    } else {
        console.error("Container element not found");
    }
    setupUIListeners()
}

function setupUIListeners() {
    const healButton = document.getElementById('healButton');
    if (healButton) {
        healButton.addEventListener('click', () => {
            const targetPlayerUID = "crGfXYIFp4OyDJmyxzy9YlkeRoS2"; 
            healPlayer(targetPlayerUID);
        });
    } else {
        console.error('Heal button not found');
    }
    
    document.getElementById('healOwnButton')?.addEventListener('click', () => {
        const currentPlayerUID = "YOUR_PLAYER_UID";
        healOwnPlayer(currentPlayerUID);
    });

    document.getElementById('damageButton')?.addEventListener('click', () => {
        const targetPlayerUID = "TARGET_PLAYER_UID"; 
        damagePlayer(targetPlayerUID);
    });

    document.getElementById('decreaseTimerButton')?.addEventListener('click', () => {
        const targetPlayerUID = "TARGET_PLAYER_UID";
        decreaseDecisionTimer(targetPlayerUID);
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        const currentPlayerUID = "YOUR_PLAYER_UID";
        increaseDecisionTimer(currentPlayerUID);
    });

    document.getElementById('lowerStatsButton')?.addEventListener('click', () => {
        const targetPlayerUID = "TARGET_PLAYER_UID";
        lowerPlayerStats(targetPlayerUID);
    });

    document.getElementById('raiseStatsButton')?.addEventListener('click', () => {
        const targetPlayerUID = "TARGET_PLAYER_UID";
        raisePlayerStats(targetPlayerUID);
    });

    document.getElementById('blockButton')?.addEventListener('click', () => {
        const currentPlayerUID = "YOUR_PLAYER_UID";
        setBlockForNextTurn(currentPlayerUID);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupUIListeners();
});
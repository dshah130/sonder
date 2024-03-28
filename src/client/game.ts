import * as PIXI from 'pixi.js';
import { healPlayer, healOwnPlayer, damagePlayer, decreaseDecisionTimer, increaseDecisionTimer, lowerPlayerStats, raisePlayerStats, setBlockForNextTurn } from '../actions/actions';
import { getPlayerConnectionList } from '../handler/firebaseDatabaseHandler'
const app = new PIXI.Application<HTMLCanvasElement>({ width: 600, height: 600 })
const graphics = new PIXI.Graphics();

export function initGame(){
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
        const currentPlayerUID = "sOfGRUQ6xda7zZh3icfuH1y3uS52";
        healOwnPlayer(currentPlayerUID);
    });

    document.getElementById('damageButton')?.addEventListener('click', () => {
        const targetPlayerUID = "crGfXYIFp4OyDJmyxzy9YlkeRoS2"; 
        damagePlayer(targetPlayerUID);
    });

    document.getElementById('decreaseTimerButton')?.addEventListener('click', () => {
        const targetPlayerUID = "crGfXYIFp4OyDJmyxzy9YlkeRoS2";
        decreaseDecisionTimer(targetPlayerUID);
    });

    document.getElementById('increaseTimerButton')?.addEventListener('click', () => {
        const currentPlayerUID = "sOfGRUQ6xda7zZh3icfuH1y3uS52";
        increaseDecisionTimer(currentPlayerUID);
    });

    document.getElementById('lowerStatsButton')?.addEventListener('click', () => {
        const targetPlayerUID = "crGfXYIFp4OyDJmyxzy9YlkeRoS2";
        lowerPlayerStats(targetPlayerUID);
    });

    document.getElementById('raiseStatsButton')?.addEventListener('click', () => {
        const targetPlayerUID = "crGfXYIFp4OyDJmyxzy9YlkeRoS2";
        raisePlayerStats(targetPlayerUID);
    });

    document.getElementById('blockButton')?.addEventListener('click', () => {
        const currentPlayerUID = "sOfGRUQ6xda7zZh3icfuH1y3uS52";
        setBlockForNextTurn(currentPlayerUID);
    });

}

export function updateDropdown(playersList: string[]) {
    const playersDropdown = document.getElementById('playersDropdown') as HTMLSelectElement | null;

    if (playersDropdown) {
        playersDropdown.length = 1; // Clear existing options except the first one

        playersList.forEach((playerUid) => {
            const option = new Option(playerUid, playerUid); // Assuming playerUid is what you want to display
            playersDropdown.add(option);
        });
    } else {
        console.error("Dropdown element not found.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupUIListeners();
});
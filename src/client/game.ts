import * as PIXI from 'pixi.js';
// Create a Pixi.js Application
const app = new PIXI.Application<HTMLCanvasElement>({ width: 600, height: 600 })

// Create a new Graphics object
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

    } else {
        console.error("Container element not found");
    }



}






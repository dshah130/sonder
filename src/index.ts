console.log('Hello, TypeScript and Webpack!');

import { signClientIn } from "../src/client/client";
import { initGame } from "../src/client/game";
import {printErrorMsg} from  "../src/handler/errorHandler";

// index.ts

// Function to load the appropriate HTML page based on the URL
function loadPage() {
    const path:string = window.location.pathname;
    if (path === '/game/') {
        // Load game.html
        fetch('/game/index.html')
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
                // const container = document.getElementById('container');
                // container!.innerHTML = html
                initGame();
            })
            .catch(error => {
                console.error('Failed to load game.html:');
                printErrorMsg(error)
            });
    } else if (path === '/') {
        // Load profile.html
        fetch('/client/index.html')
            .then(response => response.text())
            .then(html => {
                document.body.innerHTML = html;
            })
            .catch(error => {
                console.error('Failed to load profile.html:', error);
                printErrorMsg(error)
            });
    } else {
        console.error('Invalid URL:', path);
    }

}





//initial run of game
(function(){
    signClientIn();
    loadPage();
})();




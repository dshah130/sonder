# sonder-1

Install and Execute Game:

To install this game you will need to download the folder and then open it. Once opened, run "npm install" to install all package dependencies. 
To execute this game you will need to run "npm run start-client" so the client side will start rendering the game and will connect to a real time multiplayer server. 

How to Play:

When you launch the game, you will be redirected to the home page where you will see your game id which is your own player id, a drop down of active users online, and another input box where you can join a game. If you are playing this game on 1 laptop, open up the same website http://localhost:9000/ on incognito mode so you are able to play against yourself. Once another user is online, you will be able to see their player id in the dropdown so you can select that. Player 1 will then be redirected to the game screen and will see the game id on the top of the page. Send this game id to the player you want to play against and then they will input this game id into the input box and join the game. You are officially both in the game and are able to play against each other!

Once in the game, you can open up the console log on the screen and you will be able to see some dialog showing you whos turn it is. The player who created the game so Player 1 in this case will get the first move. From here, the player can do any of the given actions. Once a player's health gets to 0 the game is over. 

Features: 

This game was created using Google's Firebase storage and database to store the servers databse on. This allows the server to be in real time and secure. This is where all of our data is stored so the game ID, player ID, who's turn it is, if the connection has been made on the client side, if the game has been loaded and is able to read in the data from the server side. This was our first feature that we implemented. 

For the client side, we used Phaser JS library to render images and sprites in the DOM. 

Other key features in the game include the actions which are based on the player's Myles Brigs Personality Test Type. The actions that can be taken while being intimate are healing the other player's health, damaging the other player's health, lowering the other player’s stats, or raising a player's own stats. The actions that can be taken while being sensitive are healing other player's health, counterattack against other player, healing their own health, and blocking incoming player's action. Once a player chooses an action, the Firebase database will get updated and then output the new stat number on the client side. Also another feature implemented is when you click on the actions buttons, there are elemental effects like the sprites that show up on the screen. Another feature we implemented is having a turn model so each player is able to go back and forth until one loses. We have also implemented animated characters for the players. Another feature would be the game initialization and UI setup where we were able to load assets, and set up the game canvas. 

By: Warren Sucklal and Devanshi Shah
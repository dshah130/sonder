import { firestore } from "../firebase/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getPlayerData } from "../handler/firestoreHandler";
import { changeGameTurn } from "../handler/firebaseDatabaseHandler";
import { getTypeMetaData } from "../handler/playerTypes";
import { Player } from "../interfaces/player";
import { pointScalar } from "../handler/playerTypes";

// import {}

// heal other player
export async function healPlayer(targetPlayerUID: string) {
    const patientRef = doc(firestore, "players", targetPlayerUID);
    
    try {
        // Get current state of players health
        const patientSnapshot = await getDoc(patientRef);
        if (patientSnapshot.exists()) {
            const patientData = patientSnapshot.data();
            const newHealth = (patientData.Health || 0) + 1*pointScalar; 
            
            // Update health
            await updateDoc(patientRef, { Health: newHealth });
            console.log(`=====================\nPlayer ${targetPlayerUID} healed. New health: ${newHealth}`);
        } else {
            console.log(`Player data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during healing action:", error);
    }
}

// heal your own player
export async function healOwnPlayer(playerUID: string) {
    const patientRef = doc(firestore, "players", playerUID);
    
    try {
        // Get current state of players health
        const patientSnapshot = await getDoc(patientRef);
        if (patientSnapshot.exists()) {
            const patientData = patientSnapshot.data() as Player;

            
            const playerMetaData = getTypeMetaData(patientData)
            console.log(playerMetaData)

            //const newHealth = (patientData.Health || 0) + 0.5*pointScalar
            //Driver => handler 
            const baseHealth = 0.5*pointScalar
            const adaptedHealth = parseFloat(((0.5*pointScalar * ((patientData.SL*(1+playerMetaData.SLAFFECT))/pointScalar)) * ((patientData.SE*(1+playerMetaData.SEAFFECT))/pointScalar)).toFixed(2))
            const testnewHealth = baseHealth + adaptedHealth
            const newHealth = (patientData.Health || 0) + testnewHealth

            // Update health
            await updateDoc(patientRef, { Health: newHealth });
            console.log(`=====================\nPlayer ${playerUID} healed. New health: ${newHealth}`);
        } else {
            console.log(`Player data for ${playerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during healing action:", error);
    }
}
// damage other player
export async function damagePlayer(targetPlayerUID: string,currentPlayerUID:string,gameUID:string) {
    const patientRef = doc(firestore, "players", targetPlayerUID);
    
    try {

        const currentPlayer = await getPlayerData(currentPlayerUID);

        // Get current state of players health
        const patientSnapshot = await getDoc(patientRef);
        if (patientSnapshot.exists()) {
            const patientData = patientSnapshot.data();
            const newHealth = (patientData.Health || 0) - (currentPlayer? currentPlayer.Damage: 1*pointScalar ); 
            
            // Prevent health from going below 0
            if (newHealth > 0) {
                // Update health 
                await updateDoc(patientRef, { Health: newHealth });
                console.log(`=====================\nPlayer ${targetPlayerUID} damaged. New health: ${newHealth}`);
            } else {
                console.log(`=====================\nPlayer ${targetPlayerUID} cannot have health reduced below 0.`);
                changeGameTurn("GAMEOVER",currentPlayerUID,gameUID)
                // const scene = game.scene.getScene('MyScene') as MyScene;
                // scene.animateGameOverText()
                console.log(`=====================\nGAMEOVER ${targetPlayerUID} cannot have health reduced below 0.`);
                await updateDoc(patientRef, { Health: newHealth });

            }
        } else {
            console.log(`Player data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during damage action:", error);
    }
}

// decrease other players timer
export async function decreaseDecisionTimer(targetPlayerUID: string) {
    const playerRef = doc(firestore, "players", targetPlayerUID);
    
    try {
        const docSnapshot = await getDoc(playerRef);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data();
            const currentTimer = playerData.Timer || 3*pointScalar; 
            const newTimer = Math.max(currentTimer - 2*pointScalar, 0); 

            await updateDoc(playerRef, { Timer: newTimer });
            console.log(`Decision timer for player ${targetPlayerUID} decreased by 2 seconds. New timer: ${newTimer} seconds.`);
        } else {
            console.log(`Player data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during decreasing decision timer:", error);
    }
}

// increase your own timer
export async function increaseDecisionTimer(playerUID: string) {
    const playerRef = doc(firestore, "players", playerUID);
    
    try {
        const docSnapshot = await getDoc(playerRef);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data();
            // Assuming 30 is the default decision timer
            const currentTimer = playerData.Timer || 3*pointScalar; 
            const newTimer = Math.max(currentTimer + 2*pointScalar, 0); 

            await updateDoc(playerRef, { Timer: newTimer });
            console.log(`Decision timer for player ${playerUID} increased by 2 seconds. New timer: ${newTimer} seconds.`);
        } else {
            console.log(`Player data for ${playerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during decreasing decision timer:", error);
    }
}

// lower players stats
export async function lowerPlayerStats(targetPlayerUID: string, currentPlayerUID:string) {
    const playerRef = doc(firestore, "players", targetPlayerUID);
    try {
        const docSnapshot = await getDoc(playerRef);
        const currentPlayer = await getPlayerData(currentPlayerUID);

        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data() as Player;
            // Decrease each stat by 0.5
            // const updatedStats = {
            //     // Minimum stat value is 0
            //     SE: Math.max(playerData.SE - 0.5*pointScalar, 0), 
            //     SL: Math.max(playerData.SL - 0.5*pointScalar, 0),
            //     IL: Math.max(playerData.IL - 0.5*pointScalar, 0),
            //     IE: Math.max(playerData.IE - 0.5*pointScalar, 0),
            //     Damage: Math.max(playerData.Damage - 0.5*pointScalar, 0), 
            // };
            const playerMetaData = getTypeMetaData(playerData)
            const currentPlayerMeta = getTypeMetaData(currentPlayer!)
            const baseIncrease = 0.25*pointScalar
            const adaptedIncrease = parseFloat(((baseIncrease * ((currentPlayer!.IE *(1+currentPlayerMeta.IEAFFECT))/pointScalar)) * ((currentPlayer!.IL*(1+currentPlayerMeta.ILAFFECT))/pointScalar)).toFixed(2))
            const testnewIncreaseSE = (baseIncrease + adaptedIncrease) * (1-playerMetaData.SELOSE)
            const testnewIncreaseSL = (baseIncrease + adaptedIncrease) * (1-playerMetaData.SLLOSE)
            const testnewIncreaseIL = (baseIncrease + adaptedIncrease) * (1-playerMetaData.ILLOSE)
            const testnewIncreaseIE = (baseIncrease + adaptedIncrease) * (1-playerMetaData.IELOSE)
            
            const typesbrokenup = playerData.Type.split('')
            let testnewdmg = (baseIncrease + adaptedIncrease)
            if(typesbrokenup.includes('E') && typesbrokenup.includes('F')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1-playerMetaData.IELOSE)
            }
            if(typesbrokenup.includes('E') && typesbrokenup.includes('T')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1-playerMetaData.ILLOSE)

            }
            if(typesbrokenup.includes('I') && typesbrokenup.includes('F')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1-playerMetaData.SELOSE)

            }
            if(typesbrokenup.includes('I') && typesbrokenup.includes('T')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1-playerMetaData.IELOSE)
            }

            const updatedStats = {
                SE: parseFloat(((playerData.SE || 0) - parseFloat(testnewIncreaseSE.toFixed(2))).toFixed(2))<0 ? 0: parseFloat(((playerData.SE || 0) - parseFloat(testnewIncreaseSE.toFixed(2))).toFixed(2)),
                SL: parseFloat(((playerData.SL || 0) - parseFloat(testnewIncreaseSL.toFixed(2))).toFixed(2))<0 ?0: parseFloat(((playerData.SL || 0) - parseFloat(testnewIncreaseSL.toFixed(2))).toFixed(2)),
                IL: parseFloat(((playerData.IL || 0) - parseFloat(testnewIncreaseIL.toFixed(2))).toFixed(2))<0?0: parseFloat(((playerData.IL || 0) - parseFloat(testnewIncreaseIL.toFixed(2))).toFixed(2)),
                IE: parseFloat(((playerData.IE || 0) - parseFloat(testnewIncreaseIE.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.IE || 0) - parseFloat(testnewIncreaseIE.toFixed(2))).toFixed(2)),
                Damage: parseFloat(((playerData.Damage || 0) - parseFloat(testnewdmg.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.IE || 0) - parseFloat(testnewIncreaseIE.toFixed(2))).toFixed(2)),
            };
            
            await updateDoc(playerRef, updatedStats);
            console.log(`=====================\nStats for player ${targetPlayerUID} have been decreased by 0.5.`);
        } else {
            console.log(`PlayerparseFloat(( data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during lowering player stats:", error);
    }
}

// raise player stats
export async function raisePlayerStats(currentPlayerUID: string) {
    const playerRef = doc(firestore, "players", currentPlayerUID);

    try {
        const docSnapshot = await getDoc(playerRef);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data() as Player;

            const playerMetaData = getTypeMetaData(playerData)

            // Increase each stat by 0.5
            // const updatedStats = {
            //     SE: (playerData.SE || 0) + 0.5*pointScalar ,
            //     SL: (playerData.SL || 0) + 0.5*pointScalar,
            //     IL: (playerData.IL || 0) + 0.5*pointScalar,
            //     IE: (playerData.IE || 0) + 0.5*pointScalar,
            //     Damage: (playerData.Damage || 0) + 0.5*pointScalar,
            // };

            const baseIncrease = 0.25*pointScalar
            const adaptedIncrease = parseFloat(((baseIncrease * ((playerData.IE *(1+playerMetaData.IEAFFECT))/pointScalar)) * ((playerData.IL*(1+playerMetaData.ILAFFECT))/pointScalar)).toFixed(2))
            const testnewIncreaseSE = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.SEGAIN)
            const testnewIncreaseSL = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.SLGAIN)
            const testnewIncreaseIL = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.ILGAIN)
            const testnewIncreaseIE = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.IEGAIN)
            
            const typesbrokenup = playerData.Type.split('')
            let testnewdmg = (baseIncrease + adaptedIncrease)
            if(typesbrokenup.includes('E') && typesbrokenup.includes('F')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.IEGAIN)
            }
            if(typesbrokenup.includes('E') && typesbrokenup.includes('T')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.ILGAIN)

            }
            if(typesbrokenup.includes('I') && typesbrokenup.includes('F')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.SEGAIN)

            }
            if(typesbrokenup.includes('I') && typesbrokenup.includes('T')){
                testnewdmg = (baseIncrease) + (adaptedIncrease) * (1+playerMetaData.IEGAIN)
            }

            const updatedStats = {
                SE: parseFloat(((playerData.SE || 0) + parseFloat(testnewIncreaseSE.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.SE || 0) + parseFloat(testnewIncreaseSE.toFixed(2))).toFixed(2)) ,
                SL: parseFloat(((playerData.SL || 0) + parseFloat(testnewIncreaseSL.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.SL || 0) + parseFloat(testnewIncreaseSL.toFixed(2))).toFixed(2)),
                IL: parseFloat(((playerData.IL || 0) + parseFloat(testnewIncreaseIL.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.IL || 0) + parseFloat(testnewIncreaseIL.toFixed(2))).toFixed(2)),
                IE: parseFloat(((playerData.IE || 0) + parseFloat(testnewIncreaseIE.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.IE || 0) + parseFloat(testnewIncreaseIE.toFixed(2))).toFixed(2)),
                Damage: parseFloat(((playerData.Damage || 0) + parseFloat(testnewdmg.toFixed(2))).toFixed(2))<0?0:parseFloat(((playerData.Damage || 0) + parseFloat(testnewdmg.toFixed(2))).toFixed(2)),
            };
            
            await updateDoc(playerRef, updatedStats);
            console.log(`=====================\nStats for player ${currentPlayerUID} have been increased`);
        } else {
            console.log(`Player data for ${currentPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during raising player stats:", error);
    }
}

// block incoming player
export async function setBlockForNextTurn(playerUID: string) {
    const playerRef = doc(firestore, "players", playerUID);

    try {
        await updateDoc(playerRef, { IsBlocking: true });
        console.log(`=====================\nPlayer ${playerUID} will block the next action.`);
    } catch (error) {
        console.error("Error setting block for next turn:", error);
    }
}

// if player does not block
export async function applyActionIfNotBlocked(playerUID: string, targetPlayerUID: string) {
    const targetRef = doc(firestore, "players", targetPlayerUID);

    try {
        const docSnapshot = await getDoc(targetRef);
        if (docSnapshot.exists()) {
            const targetData = docSnapshot.data();
            if (targetData.IsBlocking) {
                console.log(`=====================\nPlayer ${targetPlayerUID}'s block prevented the action.`);
                // Optionally reset the blocking flag here or wait until the end of the turn
                //await updateDoc(targetRef, { IsBlocking: false });
                resetBlockFlag(targetPlayerUID);
                return false
            } else {
                // Apply the action since there's no block
                //await actionFunction(playerUID, targetPlayerUID);
                resetBlockFlag(targetPlayerUID);
                return true
            }
        } else {
            console.log(`Target player data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error applying action with block check:", error);
    }
}

// Reset the block for player
export async function resetBlockFlag(playerUID: string) {
    const playerRef = doc(firestore, "players", playerUID);

    try {
        await updateDoc(playerRef, { IsBlocking: false });
        //console.log(`Block reset for player ${playerUID}.`);
    } catch (error) {
        console.error("Error resetting block:", error);
    }
}
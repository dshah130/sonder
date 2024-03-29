import { firestore } from "../firebase/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";

// heal other player
export async function healPlayer(targetPlayerUID: string) {
    const patientRef = doc(firestore, "players", targetPlayerUID);
    
    try {
        // Get current state of players health
        const patientSnapshot = await getDoc(patientRef);
        if (patientSnapshot.exists()) {
            const patientData = patientSnapshot.data();
            const newHealth = (patientData.Health || 0) + 1; 
            
            // Update health
            await updateDoc(patientRef, { Health: newHealth });
            console.log(`Player ${targetPlayerUID} healed. New health: ${newHealth}`);
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
            const patientData = patientSnapshot.data();
            const newHealth = (patientData.Health || 0) + 1; 
            
            // Update health
            await updateDoc(patientRef, { Health: newHealth });
            console.log(`Player ${playerUID} healed. New health: ${newHealth}`);
        } else {
            console.log(`Player data for ${playerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during healing action:", error);
    }
}
// damage other player
export async function damagePlayer(targetPlayerUID: string) {
    const patientRef = doc(firestore, "players", targetPlayerUID);
    
    try {
        // Get current state of players health
        const patientSnapshot = await getDoc(patientRef);
        if (patientSnapshot.exists()) {
            const patientData = patientSnapshot.data();
            const newHealth = (patientData.Health || 0) - 1; 
            
            // Prevent health from going below 0
            if (newHealth >= 0) {
                // Update health 
                await updateDoc(patientRef, { Health: newHealth });
                console.log(`Player ${targetPlayerUID} damaged. New health: ${newHealth}`);
            } else {
                console.log(`Player ${targetPlayerUID} cannot have health reduced below 0.`);
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
            const currentTimer = playerData.Timer || 3; 
            const newTimer = Math.max(currentTimer - 2, 0); 

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
            const currentTimer = playerData.Timer || 3; 
            const newTimer = Math.max(currentTimer + 2, 0); 

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
export async function lowerPlayerStats(targetPlayerUID: string) {
    const playerRef = doc(firestore, "players", targetPlayerUID);
    
    try {
        const docSnapshot = await getDoc(playerRef);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data();
            // Decrease each stat by 0.5
            const updatedStats = {
                // Minimum stat value is 0
                SE: Math.max(playerData.SE - 0.5, 0), 
                SL: Math.max(playerData.SL - 0.5, 0),
                IL: Math.max(playerData.IL - 0.5, 0),
                IE: Math.max(playerData.IE - 0.5, 0),
                Damage: Math.max(playerData.Damage - 0.5, 0), 
            };
            
            await updateDoc(playerRef, updatedStats);
            console.log(`Stats for player ${targetPlayerUID} have been decreased by 0.5.`);
        } else {
            console.log(`Player data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during lowering player stats:", error);
    }
}

// raise player stats
export async function raisePlayerStats(targetPlayerUID: string) {
    const playerRef = doc(firestore, "players", targetPlayerUID);
    
    try {
        const docSnapshot = await getDoc(playerRef);
        if (docSnapshot.exists()) {
            const playerData = docSnapshot.data();
            // Increase each stat by 0.5
            const updatedStats = {
                SE: (playerData.SE || 0) + 0.5,
                SL: (playerData.SL || 0) + 0.5,
                IL: (playerData.IL || 0) + 0.5,
                IE: (playerData.IE || 0) + 0.5,
                Damage: (playerData.Damage || 0) + 0.5,
            };
            
            await updateDoc(playerRef, updatedStats);
            console.log(`Stats for player ${targetPlayerUID} have been increased by 0.5.`);
        } else {
            console.log(`Player data for ${targetPlayerUID} not found.`);
        }
    } catch (error) {
        console.error("Error during raising player stats:", error);
    }
}

// block incoming player
export async function setBlockForNextTurn(playerUID: string) {
    const playerRef = doc(firestore, "players", playerUID);

    try {
        await updateDoc(playerRef, { isBlocking: true });
        console.log(`Player ${playerUID} will block the next action.`);
    } catch (error) {
        console.error("Error setting block for next turn:", error);
    }
}

// if player does not block
export async function applyActionIfNotBlocked(playerUID: string, targetPlayerUID: string, actionFunction: Function) {
    const targetRef = doc(firestore, "players", targetPlayerUID);

    try {
        const docSnapshot = await getDoc(targetRef);
        if (docSnapshot.exists()) {
            const targetData = docSnapshot.data();
            if (targetData.isBlocking) {
                console.log(`Player ${targetPlayerUID}'s block prevented the action.`);
                // Optionally reset the blocking flag here or wait until the end of the turn
                await updateDoc(targetRef, { isBlocking: false });
            } else {
                // Apply the action since there's no block
                await actionFunction(playerUID, targetPlayerUID);
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
        await updateDoc(playerRef, { isBlocking: false });
        console.log(`Block reset for player ${playerUID}.`);
    } catch (error) {
        console.error("Error resetting block:", error);
    }
}
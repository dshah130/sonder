import {auth} from "../firebase/firebase";
import {signInAnonymously, onAuthStateChanged} from '@firebase/auth'


export async function getMyUserUID():Promise<string>{

    try {
        const userCredential = await signInAnonymously(auth);
        const user = userCredential.user;
    
        // Since anonymous sign-in always succeeds, user will never be null
        return user.uid;
      } catch (error) {
        console.error("Error signing in anonymously:", error);
        throw error; // Rethrow error for handling in calling code
      }

}
 
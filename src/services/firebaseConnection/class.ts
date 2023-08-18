import { FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import initFirebaseFunction from './firebaseInitConfig';

/* eslint-disable @typescript-eslint/no-explicit-any */
class Firebase {
  firebaseApp: FirebaseApp | null;
  auth: any;

  constructor() {
    this.firebaseApp = null;
    initFirebaseFunction().then(res => {
      this.firebaseApp = res;
      this.auth = getAuth();
    });
  }

  /**
   * Users Api
   */

  async loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async registerUser() {
    console.log('registerUser');
  }

  async logoutUser() {
    console.log('logoutUser');
  }

  /**
   * End Users Api
   */
}

export default Firebase;

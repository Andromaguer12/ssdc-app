import { FirebaseApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import initFirebaseFunction from "./firebaseInitConfig";

/* eslint-disable @typescript-eslint/no-explicit-any */
class Firebase {
  firebaseApp: FirebaseApp | null;
  auth: any;

  constructor() {
    this.firebaseApp = null
    initFirebaseFunction().then((res) =>{
      this.firebaseApp = res
      console.log(res)
      this.auth = getAuth(this.firebaseApp)
    })

  }

  /**
   * Users Api
   */

  async loginUser() {
    console.log('loginUser')
  }

  async registerUser() {
    console.log('registerUser')
  }

  async logoutUser() {
    console.log('logoutUser')
  }

  /**
   * End Users Api
   */

}

export default Firebase;

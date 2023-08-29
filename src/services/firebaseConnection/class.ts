import { FirebaseApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, where, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import initFirebaseFunction from './firebaseInitConfig';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { UserInterface } from '@/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
class Firebase {
  firebaseApp: FirebaseApp | null;
  auth: any;
  db: any;

  constructor() {
    this.firebaseApp = null;
    initFirebaseFunction().then(res => {
      this.firebaseApp = res;
      this.auth = getAuth();
      this.db = getFirestore(res)
    });
  }

  /**
   * Users Api
   */

  async loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async getUserFromId(uid: string, accessToken: string) {
    const userRef = query(collection(this.db, "users"), where("uid", "==", uid));
    const docs = await getDocs(userRef);
    const data: any[] = []

    docs.forEach((doc) => {
      data.push({
        ...doc.data()
      })
    });

    return data.length > 0 ? { ...data[0], uid, accessToken } : undefined
  }

  async getUsersList() {
    const userRef = query(collection(this.db, "users"));
    const docs = await getDocs(userRef);
    const data: any[] = []

    docs.forEach((doc) => {
      data.push({
        ...doc.data()
      })
    });

    return data
  }

  /*async registerUser(data: UserReducerInitialState) {
    const rta =  await addDoc(collection(this.db, "users"), data);
    return rta
  } */

  async registerUser(email: string, password: string, data: UserInterface) {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    const dataToSend: UserInterface = {
      ...data,
      uid: res.user.uid
    }
    return addDoc(collection(this.db, "users"), dataToSend);
  }

  async updateUser(data: UserReducerInitialState, payload: UserInterface) {
    return await setDoc(doc(this.db, "users", data.uid), {
      ...data,
      ...payload
    });
// Necesito el id 
  }

  async deleteUser(id: string) {
    return await deleteDoc(doc(this.db, "users", id));
  }

  async logoutUser() {
    console.log('logoutUser');
  }

  /**
   * End Users Api
   */
}

export default Firebase;

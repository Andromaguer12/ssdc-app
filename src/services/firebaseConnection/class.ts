import { FirebaseApp } from 'firebase/app';
import { createUserWithEmailAndPassword, deleteUser, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, where, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import initFirebaseFunction from './firebaseInitConfig';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { TablePlayers, TournamentFormat, TournamentInterface } from '@/typesDefs/constants/tournaments/types';
import { UserInterface } from '@/typesDefs/constants/users/types';
import { TournamentReducerInitialState } from '@/redux/reducers/tournament/actions';

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

  async registerUser(email: string, password: string, data: UserReducerInitialState) {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    const dataToSend: UserReducerInitialState = {
      ...data,
      uid: res.user.uid,
    }
    const newUserRef = doc(collection(this.db, "users"));
    return setDoc(newUserRef, {
      ...dataToSend,
      id: newUserRef.id
    })
    //return addDoc(collection(this.db, "users"), dataToSend);
  }

  async updateUser(data: UserReducerInitialState, payload: UserInterface) {
    return await setDoc(doc(this.db, "users", data.id), {
      ...data,
      ...payload
    });
  }

  async removeUser(user: UserReducerInitialState) {
    await deleteUser(this.auth.currentUser);
    return deleteDoc(doc(this.db, "users", user.id));
  }

  async logoutUser() {
    console.log('logoutUser');
  }

  /**
   * End Users Api
   */

  /**
   * Tournaments Api
   */

  async getTournamentsList() {
    const tournamentsRef = query(collection(this.db, "tournaments"));
    const docs = await getDocs(tournamentsRef);
    const data: any[] = []

    docs.forEach((doc) => {
      data.push({
        ...doc.data()
      })
    });

    return data
  }

  async getTournamentById(id: string) {
    const docRef = doc(this.db, "tournaments", id);
    return (await getDoc(docRef)).data();
  };

  async createTournament(
    name: string,
    rules: string,
    format: TournamentFormat,
    startDate: string,
    endDate: string,
    currentRound: number,
    winner: UserInterface | null,
    table: TablePlayers[],
    game: 'Domino'
  ) {

    const dataToSend: TournamentInterface = {
      name,
      rules,
      format,
      startDate,
      endDate,
      currentRound,
      winner,
      table,
      game
    }
    const newTournamentRef = doc(collection(this.db, "tournaments"));
    return setDoc(newTournamentRef, {
      ...dataToSend,
      id: newTournamentRef.id,
    });
  }

  async updateTournament(tournament: TournamentReducerInitialState, payload: TournamentReducerInitialState) {
    const table = payload.table
    return await setDoc(doc(this.db, "tournaments", tournament.id), {
      ...tournament,
      table: table,
      currentRound: payload.currentRound + 1,
    });
  }
  /**
   * End Tournament Api
   */
}

export default Firebase;

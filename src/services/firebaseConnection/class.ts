import { FirebaseApp } from 'firebase/app';
import { createUserWithEmailAndPassword, signOut, deleteUser, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, where, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import initFirebaseFunction from './firebaseInitConfig';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { IndividualTableInterface, PairsTableInterface, TableInterface, TablePlayers, TournamentFormat, TournamentInterface } from '@/typesDefs/constants/tournaments/types';
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

  async logoutUser() {
    return signOut(this.auth);
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

  async getAllUsers() {
    const tournamentsRef = query(collection(this.db, "users"));
    const docs = await getDocs(tournamentsRef);
    const data: any[] = []

    docs.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id,
      })
    });

    return data
  }


  async createUser(
    name: string,
    email: string,
    phone: string,
    image: string,
  ) {
    const dataToSend: UserInterface = {
      name,
      email,
      phone,
      image,
    }

    const newUserRef = collection(this.db, "users");
  
    try {
      const doc = await addDoc(newUserRef, dataToSend)

      return doc
    } catch (error) {
      return error      
    }
  }

  async updateUser(tournamentId: string, body: Partial<UserInterface>) {
    return await setDoc(doc(this.db, "users", tournamentId ?? ''), {
      ...body
    });
  }

  async deleteUser(tournamentId: string) {
    return await setDoc(doc(this.db, "user", tournamentId ?? ''), {
      softDeleted: true
    });
  }

  /**
   * End Users Api
   */

  /**
   * Tournaments Api
   */

  async getAllTournaments() {
    const tournamentsRef = query(collection(this.db, "tournaments"), where("softDeleted", "!=", true));
    const docs = await getDocs(tournamentsRef);
    const data: any[] = []

    docs.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id,
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
    players: string[],
    tables: PairsTableInterface,
    format: TournamentFormat,
    customRounds: number
  ) {
    const dataToSend: TournamentInterface = {
      name,
      format,
      startDate: new Date().getTime(),
      currentGlobalRound: 1,
      allPlayers: players,
      winner: null,
      game: "domino",
      softDeleted: false,
      customRounds,
      status: "inactive",
      tables
    }

    const newTournamentRef = collection(this.db, "tournaments");
  
    try {
      const doc = await addDoc(newTournamentRef, dataToSend)

      return doc
    } catch (error) {
      return error      
    }
  }

  async updateTournament(tournamentId: string, body: Partial<TournamentInterface>) {
    return await setDoc(doc(this.db, "tournaments", tournamentId ?? ''), {
      ...body
    });
  }

  async deleteTournament(tournamentId: string) {
    return await setDoc(doc(this.db, "tournaments", tournamentId ?? ''), {
      softDeleted: true
    });
  }

  async finishTournament(tournamentId: string, winner: string) {
    return await setDoc(doc(this.db, 'tournaments', tournamentId), {
      winner
    })
  }

  /** 
   * End Tournament Api
   */
}

export default Firebase;

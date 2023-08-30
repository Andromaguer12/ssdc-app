import { useContext, Context } from 'react';
import FirebaseContext from './context';

/**
 *
 * @returns this hook will be always for get the fetch pre configured methods in the class named Firebase in services/firebaseConnection/class.ts
 */
const useFirebaseContext = () =>
  useContext(FirebaseContext as unknown as Context<any>);

export default useFirebaseContext;

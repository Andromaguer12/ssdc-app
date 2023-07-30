/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, Context } from 'react';
import FetchingContext from './context';

/**
 *
 * @returns this hook will be always for get the fetch pre configured methods in the class named BackendFetching in services/backendConection/class.ts
 */
const useFetchingContext = () =>
  useContext(FetchingContext as unknown as Context<any>);

export default useFetchingContext;

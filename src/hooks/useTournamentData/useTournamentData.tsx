import useFetchingContext from '@/contexts/backendConection/hook'
import { TournamentInterface } from '@/typesDefs/constants/tournaments/types'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

const useTournamentData = (tournamentId: string) => {
  const [tournament, setTournament] = useState<TournamentInterface | null>(null)
  const [tournamentData, setTournamentData] = useState<TournamentInterface | null>(null)
  const fContext = useFetchingContext()
  const [errorDocument, setErrorDocument] = useState("")
  const [usersData, setUsersData] = useState<any[]>([])
  const [currentFormat, setCurrentFormat] = useState("");
  
  const groupedByTable = useCallback(
    (data: any) => data.reduce((accumulator: any, currentItem: any) => {
      const tableId = currentItem.table;
    
      if(accumulator[tableId]) {
        accumulator[tableId].push(
          currentItem.pair.map((userId: string) => {
            return usersData.find(({ id }) => userId === id)
          })
        );
      } else {
        accumulator[tableId] = [
          currentItem.pair.map((userId: string) => {
            return usersData.find(({ id }) => userId === id)
          })
        ];
      }
    
      return accumulator;
    }, {}),
    [usersData],
  )
  
  useEffect(() => {
    if(tournament && usersData.length) {
      const mappedUsersTournament = {
        ...tournament,
        tables: {
          ...tournament.tables,
            
          tables: tournament.tables.tables.map((tab) => {
            return {
              ...tab,
              thisTablePairs: groupedByTable(
                tournament.tables[
                  tournament.format as string
                ]
              )[tab.tableId],
              table: tab.table.map((userId) => {
                return usersData.find(({ id }) => userId === id)
              })
            }
          })
        }
      }

      setTournamentData(mappedUsersTournament)
      setCurrentFormat(tournament.format)
    }
  }, [tournament, usersData])
  

  useEffect(() => {
    if(tournament) {
      const usersIds = tournament.allPlayers;

      const coleccionRef = collection(fContext.db, "users");

      Promise.all(usersIds.map(id => getDoc(doc(coleccionRef, id))))
        .then(docs => {
          const data = docs.map(docSnapshot => ({
            ...docSnapshot.data(),
            id: docSnapshot.id
          }));
          setUsersData(data)
        })
        .catch(error => {
          console.error("Error obteniendo los usuarios: ", error);
        });
    }
  }, [tournament])

  useEffect(() => {
    const docRef = doc(fContext.db, "tournaments", tournamentId)

    const unsubscribe = onSnapshot(docRef, (currentDoc) => {
      if(currentDoc.exists()) {
        setTournament({
          ...currentDoc.data() as TournamentInterface,
          id: tournamentId
        })
      }
      else {
        setErrorDocument("El torneo no existe")
      }
    })
  
    return () => {
      unsubscribe();
    }
  }, [])


  const registerResultsByTable = (table) => {

  }

  return {
    tournamentData,
    errorDocument,
    tournamentAPI: {

    }
  }
}

export default useTournamentData
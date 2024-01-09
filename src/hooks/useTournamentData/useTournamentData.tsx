import useFetchingContext from '@/contexts/backendConection/hook'
import { updateTournament } from '@/redux/reducers/tournaments/actions'
import { useAppDispatch } from '@/redux/store'
import { ResultsByRoundInterface, TableObjectInterface, TournamentInterface, TournamentState } from '@/typesDefs/constants/tournaments/types'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'

const useTournamentData = (tournamentId: string) => {
  const [tournament, setTournament] = useState<TournamentInterface | null>(null)
  const [tournamentData, setTournamentData] = useState<TournamentInterface | null>(null)
  const fContext = useFetchingContext()
  const [errorDocument, setErrorDocument] = useState("")
  const [usersData, setUsersData] = useState<any[]>([])
  const [currentFormat, setCurrentFormat] = useState("");
  const dispatch = useAppDispatch()
  
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


  const registerResultsByTable = useCallback(
    (
      tableId: string,
      tableRound: number,
      { p1, p2, p3, p4 }: { p1: number, p2: number, p3: number, p4: number }
    ) => {
      if(tournament?.status === "active"){
        if (p1 > -1 && p2 > -1 && p3 > -1 && p4 > -1) {
          const pair1Results = p1 + p2;
          const pair2Results = p3 + p4;
          const resultsPayload: ResultsByRoundInterface = {
            currentTableRound: tableRound,
            pointsPerPlayer: {
              p1,
              p2,
              p3,
              p4
            },
            pointsPerPair: {
              pair1: pair2Results > pair1Results ? 0 : pair1Results,
              pair2: pair2Results > pair1Results ? pair2Results : 0,
            },
            effectivenessByPlayer: {
              p1: pair1Results - pair2Results,
              p2: pair1Results - pair2Results,
              p3: pair2Results - pair1Results,
              p4: pair2Results - pair1Results,
            },
            effectivenessByPair: {
              pair1: pair1Results - pair2Results,
              pair2: pair2Results - pair1Results,
            },
            roundWinner: pair2Results > pair1Results ? 1 : 0,
            sanctions: [],
            finalWinner: (pair2Results >= 100 || pair1Results >= 100) ? pair2Results >= 100 ? 1 : 0 : null,
            tableMatchEnded: pair2Results >= 100 || pair1Results >= 100
          }
  
          const indexOfTable = 
            tournament?.tables
              .tables
              .findIndex(({tableId: tId}: {tableId: string}) => tId === tableId)
  
          const currentTableWithRoundUpdated: any = {
            ...(tournament 
              ? tournament
                  .tables
                  .tables
                  .find(
                    ({ tableId: tId }) => tId === tableId 
                  ) ?? {}
              : {}),
            currentTableRound: (tableRound ?? 0) + 1   
          }
  
          const copyOfTablesUpdated  = [...(tournament?.tables.tables ?? [])]
  
          copyOfTablesUpdated.splice(indexOfTable ?? 0, 1, currentTableWithRoundUpdated)
          
          const tournamentPayload: any = {
            ...tournament as TournamentInterface,
            tables: {
              ...(
                tournament 
                  ? tournament.tables ?? {} 
                  : {}
              ),
              tables: copyOfTablesUpdated
            },
            results: {
              ...(
                tournament 
                  ? tournament.results ?? {} 
                  : {}
              ),
              [tableId]: {
                resultsByRound: [
                  ...(
                    tournament 
                      ? tournament.results?.[tableId as keyof typeof tournament.results]
                          ?  tournament
                              .results?.[tableId as keyof typeof tournament.results]
                              .resultsByRound
                          : []
                      : {}
                  ),
                  resultsPayload
                ],
                players: 
                  tournament 
                  ? (tournament
                      .tables
                      .tables
                      .find(
                        ({ tableId: tId }) => tId === tableId 
                      ) ?? {})
                      .table ?? []
                  : []
              }
            }
          }
    
          dispatch(updateTournament({
            context: fContext,
            id: tournament?.id,
            body: tournamentPayload
          }))
        }
      }
    },
    [tournament],
  )

  const updateTournamentStatus = useCallback(
    (newStatus: TournamentState) => {
      dispatch(updateTournament({
        context: fContext,
        id: tournament?.id,
        body: {
          ...tournament,
          status: newStatus
        }
      }))
    },
    [tournament],
  )
  
  const calculateTablePositions = useCallback(
    (type: "individual" | "pairs" | "tables") => {
      if(tournament && tournamentData && tournament.results && Object.keys(tournament.results)) {
        const thisTablePairsMapped = tournamentData.tables.tables.map((tab) => {
          return {
            ...tab,
            thisTablePairs: groupedByTable(
              tournamentData.tables[
                tournamentData.format as string
              ]
            )[tab.tableId],
          }
        }).map((d) => ({ tablePlayers: d.thisTablePairs, tableId: d.tableId}))

        const tableKeys = Object.keys(tournament.results) 
  
        if(type === "individual") {
          const logs: any[] = []

          tableKeys.forEach((key, tableIdx) => {
            const currentTable = thisTablePairsMapped.find(({ tableId }) => tableId === key)

            currentTable?.tablePlayers.forEach((pair: any, pairIdx: number) => {
              pair.forEach((player, pIdx: number) => {
                let currentPlayer = "";

                let currentPlayerPoints = 0;
                let currentPlayerEffect = 0;

                switch (pairIdx.toString()+pIdx.toString()) {
                  case "00":
                    currentPlayer = "p1"
                    break;
                  case "01":
                    currentPlayer = "p2"
                    break;
                  case "10":
                    currentPlayer = "p3"
                    break;
                  case "11":
                    currentPlayer = "p4"
                    break;
                
                  default:
                    currentPlayer = "p1"
                    break;
                }

                tournament.results[key].resultsByRound.forEach(({pointsPerPlayer,effectivenessByPlayer}) => {
                  currentPlayerPoints+=pointsPerPlayer[currentPlayer]
                  currentPlayerEffect+=effectivenessByPlayer[currentPlayer]
                });

                const payload = {
                  name: player.name,
                  pair: pairIdx + 1,
                  table: tableIdx + 1,
                  points: currentPlayerPoints,
                  effectiveness: currentPlayerEffect,
                }

                logs.push(payload)
              })
            });
          })

          logs.sort((a, b) => {
            return a.points - b.points
          })

          logs.reverse()
          
          return logs
        }  

        if(type === "pairs") {
          const logs: any[] = []

          tableKeys.forEach((key, tableIdx) => {
            const currentTable = thisTablePairsMapped.find(({ tableId }) => tableId === key)

            currentTable?.tablePlayers.forEach((pair: any, pairIdx: number) => {
              let currentPairPoints = 0
              let currentPairEffect = 0

              tournament?.results[key].resultsByRound.forEach(({pointsPerPair,effectivenessByPair}) => {
                currentPairPoints+=pointsPerPair[`pair${pairIdx+1}`]
                currentPairEffect+=effectivenessByPair[`pair${pairIdx+1}`]
              });

              const payload = {
                name: pair[0].name + " - " + pair[1].name,
                pair: pairIdx + 1,
                table: tableIdx + 1,
                points: currentPairPoints,
                effectiveness: currentPairEffect,
              }

              logs.push(payload)
            });
          })

          logs.sort((a, b) => {
            return a.points - b.points
          })

          logs.reverse()
          
          return logs
        }

        if(type === "tables") {
          const logs: any[] = []

          tableKeys.forEach((key, tableIdx) => {
            let currentTableIndex = 0
            const currentTable = thisTablePairsMapped.find(({ tableId }, index) => {
              currentTableIndex = index
              return tableId === key
            })

            let pair1Points = 0
            let pair2Points = 0

            tournament?.results[key].resultsByRound.forEach((roundResults: any) => {
              pair1Points+=roundResults.pointsPerPair.pair1
              pair2Points+=roundResults.pointsPerPair.pair2
            });

            const lastRound = tournament?.results[key].resultsByRound[tournament?.results[key].resultsByRound.length - 1]
            

            const payload = {
              table: currentTableIndex + 1,
              pair1Points,
              pair2Points,
              currentTableRound: lastRound.currentTableRound,
              lastWinner: lastRound.roundWinner ?? "--",
              finalWinner: lastRound.finalWinner ?? "--"
            }

            logs.push(payload)
          })

          logs.sort((a, b) => {
            return a.currentTableRound - b.currentTableRound
          })

          logs.reverse()
          
          return logs
        }
      }
      return []
    },
    [tournament, tournamentData, usersData],
  )

  return {
    tournamentData,
    errorDocument,
    tournamentAPI: {
      registerResultsByTable,
      updateTournamentStatus,
      calculateTablePositions
    }
  }
}

export default useTournamentData
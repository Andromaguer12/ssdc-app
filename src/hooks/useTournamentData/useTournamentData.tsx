import {
  positionsTableByPairsMapper,
  positionsTableByTablesMapper,
  positionsTableIndividualMapper
} from '@/components/pages/TournamentPage/constants/mapper';
import {
  positionsTableByPairsColumns,
  positionsTableByTablesColumns,
  positionsTableIndividualColumns
} from '@/components/pages/TournamentPage/constants/positionsTableColumns';
import useFetchingContext from '@/contexts/backendConection/hook';
import { updateTournament } from '@/redux/reducers/tournaments/actions';
import { useAppDispatch } from '@/redux/store';
import {
  PairsTableInterface,
  ResultsByRoundInterface,
  ResultsInterface,
  StoredRoundDataInterface,
  TableObjectInterface,
  TournamentFormat,
  TournamentInterface,
  TournamentState
} from '@/typesDefs/constants/tournaments/types';
import organizeTournamentsPlayersWithSimilarPerformanceArray from '@/utils/organize-tournaments-players-with-similar-performance-array';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

const useTournamentData = (tournamentId: string) => {
  const [tournament, setTournament] = useState<any | null>(null);
  const [tournamentData, setTournamentData] =
    useState<TournamentInterface | null>(null);
  const fContext = useFetchingContext();
  const [errorDocument, setErrorDocument] = useState('');
  const [usersData, setUsersData] = useState<any[]>([]);
  const [currentFormat, setCurrentFormat] = useState('');
  const dispatch = useAppDispatch();

  const groupedByTable = useCallback(
    (data: any) =>
      (data ?? []).reduce((accumulator: any, currentItem: any) => {
        const tableId = currentItem.table;

        if (accumulator[tableId]) {
          accumulator[tableId].push(
            currentItem.pair.map((userId: string) => {
              return usersData.find(({ id }: { id: string }) => userId === id);
            })
          );
        } else {
          accumulator[tableId] = [
            currentItem.pair.map((userId: string) => {
              return usersData.find(({ id }: { id: string }) => userId === id);
            })
          ];
        }

        return accumulator;
      }, {}),
    [usersData]
  );

  useEffect(() => {
    if (tournament && tournament.tables && usersData.length) {
      const mappedUsersTournament = {
        ...tournament,
        tables: {
          ...tournament.tables,

          tables: tournament.tables.tables.map((tab: any) => {
            return {
              ...tab,
              thisTablePairs: groupedByTable(tournament.tables.pairs)[
                tab.tableId
              ],
              table: tab.table.map((userId: string) => {
                return usersData.find(({ id }) => userId === id);
              })
            };
          })
        }
      };

      setTournamentData(mappedUsersTournament);
      setCurrentFormat(tournament.format);
    }
  }, [tournament, usersData]);

  useEffect(() => {
    if (tournament) {
      const usersIds = tournament.allPlayers;

      const coleccionRef = collection(fContext.db, 'users');

      Promise.all(usersIds.map((id: string) => getDoc(doc(coleccionRef, id))))
        .then(docs => {
          const data = docs.map(docSnapshot => ({
            ...docSnapshot.data(),
            id: docSnapshot.id
          }));
          setUsersData(data);
        })
        .catch(error => {
          console.error('Error obteniendo los usuarios: ', error);
        });
    }
  }, [tournament]);

  useEffect(() => {
    const docRef = doc(fContext.db, 'tournaments', tournamentId);

    const unsubscribe = onSnapshot(docRef, currentDoc => {
      if (currentDoc.exists()) {
        setTournament({
          ...(currentDoc.data() as TournamentInterface),
          id: tournamentId
        });
      } else {
        setErrorDocument('El torneo no existe');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const registerResultsByTable = useCallback(
    (
      tableId: string,
      tableRound: number,
      { p1, p2, p3, p4 }: { p1: number; p2: number; p3: number; p4: number },
      currentPointsByPair: {
        pair1: number;
        pair2: number;
      }
    ) => {
      if (tournament?.status === 'active') {
        if (p1 > -1 && p2 > -1 && p3 > -1 && p4 > -1) {
          const pair1Results = p1;
          const pair2Results = p3;
          const currentWinner = pair2Results > pair1Results ? 1 : 0;
          const effectiveness =
            currentWinner === 0 ? 100 - pair2Results : 100 - pair1Results;
          const effectivenessPair1 =
            currentWinner === 0 ? effectiveness : effectiveness * -1;
          const effectivenessPair2 =
            currentWinner === 1 ? effectiveness : effectiveness * -1;

          const isFinalWinner =
            currentPointsByPair.pair1 +
              (currentWinner === 1 ? 0 : pair1Results) >=
            100
              ? 0
              : currentPointsByPair.pair2 +
                    (currentWinner === 1 ? pair2Results : 0) >=
                  100
                ? 1
                : null;

          const resultsPayload: ResultsByRoundInterface = {
            currentTableRound: tableRound,
            pointsPerPlayer: {
              p1,
              p2,
              p3,
              p4
            },
            pointsPerPair: {
              pair1: pair1Results,
              pair2: pair2Results
            },
            effectivenessByPlayer: {
              p1: effectivenessPair1,
              p2: effectivenessPair1,
              p3: effectivenessPair2,
              p4: effectivenessPair2
            },
            effectivenessByPair: {
              pair1: effectivenessPair1,
              pair2: effectivenessPair2
            },
            roundWinner: currentWinner,
            sanctions: [],
            finalWinner: isFinalWinner,
            tableMatchEnded: typeof isFinalWinner === 'number'
          };

          const indexOfTable = tournament?.tables.tables.findIndex(
            ({ tableId: tId }: { tableId: string }) => tId === tableId
          );

          const currentTableWithRoundUpdated: any = {
            ...(tournament
              ? tournament.tables.tables.find(
                  ({ tableId: tId }: { tableId: string }) => tId === tableId
                ) ?? {}
              : {}),
            currentTableRound: (tableRound ?? 0) + 1
          };

          const copyOfTablesUpdated = [...(tournament?.tables.tables ?? [])];

          copyOfTablesUpdated.splice(
            indexOfTable ?? 0,
            1,
            currentTableWithRoundUpdated
          );

          const tournamentPayload: any = {
            ...(tournament as TournamentInterface),
            tables: {
              ...(tournament ? tournament.tables ?? {} : {}),
              tables: copyOfTablesUpdated
            },
            results: {
              ...(tournament ? tournament.results ?? {} : {}),
              [tableId]: {
                resultsByRound: [
                  ...(tournament
                    ? tournament.results?.[
                        tableId as keyof typeof tournament.results
                      ]
                      ? tournament.results?.[
                          tableId as keyof typeof tournament.results
                        ].resultsByRound
                      : []
                    : {}),
                  resultsPayload
                ],
                players: tournament
                  ? (
                      tournament.tables.tables.find(
                        ({ tableId: tId }: { tableId: string }) =>
                          tId === tableId
                      ) ?? {}
                    ).table ?? []
                  : []
              }
            }
          };

          dispatch(
            updateTournament({
              context: fContext,
              id: tournament?.id,
              body: tournamentPayload
            })
          );
        }
      }
    },
    [tournament]
  );

  const calculateTablePositions = useCallback(
    (
      type: 'individual' | 'pairs' | 'tables',
      resultsToCalculate?: StoredRoundDataInterface,
      storedRounds?: StoredRoundDataInterface[]
    ) => {
      if (
        tournament &&
        tournamentData &&
        (resultsToCalculate || tournament.results) &&
        Object.keys(resultsToCalculate ?? tournament.results)
      ) {
        if (resultsToCalculate && usersData.length > 0) {
          const thisTablePairsMapped = resultsToCalculate.tables.tables
            .map(tab => {
              return {
                ...tab,
                thisTablePairs: groupedByTable(resultsToCalculate.tables.pairs)[
                  tab.tableId
                ]
              };
            })
            .map(d => ({ tablePlayers: d.thisTablePairs, tableId: d.tableId }));

          const tableKeys = Object.keys(resultsToCalculate.results);
          if (type === 'individual') {
            const logs: any[] = [];

            tableKeys.forEach((key, tableIdx) => {
              const currentTable = thisTablePairsMapped.find(
                ({ tableId }) => tableId === key
              );

              currentTable?.tablePlayers.forEach(
                (pair: any, pairIdx: number) => {
                  pair.forEach((player: any, pIdx: number) => {
                    let currentPlayer = '';

                    let currentPlayerPoints = 0;
                    let currentPlayerEffect = 0;
                    let currentPlayerWins = 0;
                    let currentPlayerDefeats = 0;

                    switch (pairIdx.toString() + pIdx.toString()) {
                      case '00':
                        currentPlayer = 'p1';
                        break;
                      case '01':
                        currentPlayer = 'p2';
                        break;
                      case '10':
                        currentPlayer = 'p3';
                        break;
                      case '11':
                        currentPlayer = 'p4';
                        break;

                      default:
                        currentPlayer = 'p1';
                        break;
                    }

                    (
                      resultsToCalculate.results[
                        key as keyof typeof resultsToCalculate.results
                      ] as any
                    ).resultsByRound.forEach(
                      ({
                        pointsPerPlayer,
                        effectivenessByPlayer,
                        roundWinner,
                        finalWinner
                      }: any) => {
                        currentPlayerPoints += pointsPerPlayer[currentPlayer];
                        currentPlayerEffect +=
                          effectivenessByPlayer[currentPlayer];
                        currentPlayerWins += finalWinner === pairIdx ? 1 : 0;
                        currentPlayerDefeats += finalWinner !== pairIdx ? 1 : 0;
                      }
                    );

                    let historyWins = null;
                    let historyDefeats = null;
                    let historyEffectiveness = null;
                    let historyPoints = null;

                    if (storedRounds) {
                      const calculations =
                        handleSumWinsAndDefeatsOfStoredResults(
                          resultsToCalculate
                            ? [...storedRounds, resultsToCalculate]
                            : storedRounds,
                          'individual'
                        )?.find(
                          ({ currentRoundId }) =>
                            currentRoundId === resultsToCalculate.currentRoundId
                        );

                      historyWins =
                        calculations?.resultsInIndividualFormat.find(
                          (p: any) => p.id === player.id
                        ).wins;
                      historyDefeats =
                        calculations?.resultsInIndividualFormat.find(
                          (p: any) => p.id === player.id
                        ).defeats;
                      historyEffectiveness =
                        calculations?.resultsInIndividualFormat.find(
                          (p: any) => p.id === player.id
                        ).effectiveness;
                      historyPoints =
                        calculations?.resultsInIndividualFormat.find(
                          (p: any) => p.id === player.id
                        ).points;
                    }

                    const payload = {
                      id: player.id,
                      name: player.name,
                      pair: pairIdx + 1,
                      table:
                        resultsToCalculate.tables.tables.findIndex(
                          ({ tableId }) => tableId === key
                        ) + 1,
                      points:
                        typeof historyPoints === 'number'
                          ? historyPoints
                          : currentPlayerPoints,
                      wins:
                        typeof historyWins === 'number'
                          ? historyWins
                          : currentPlayerWins,
                      defeats:
                        typeof historyDefeats === 'number'
                          ? historyDefeats
                          : currentPlayerDefeats,
                      effectiveness:
                        typeof historyEffectiveness === 'number'
                          ? historyEffectiveness
                          : currentPlayerEffect
                    };

                    logs.push(payload);
                  });
                }
              );
            });

            logs.sort((a, b) => {
              if (a.wins !== b.wins) {
                return a.wins - b.wins;
              } else if (a.defeats !== b.defeats) {
                return a.defeats - b.defeats;
              } else if (a.effectiveness !== b.effectiveness) {
                return a.effectiveness - b.effectiveness;
              } else if (a.points !== b.points) {
                return a.points - b.points;
              }
              return 1;
            });

            logs.reverse();

            return logs;
          }

          if (type === 'pairs') {
            const logs: any[] = [];

            tableKeys.forEach((key, tableIdx) => {
              const currentTable = thisTablePairsMapped.find(
                ({ tableId }) => tableId === key
              );

              currentTable?.tablePlayers.forEach(
                (pair: any, pairIdx: number) => {
                  let currentPairPoints = 0;
                  let currentPairEffect = 0;
                  let currentPlayerWins = 0;
                  let currentPlayerDefeats = 0;

                  (
                    resultsToCalculate.results[
                      key as keyof typeof resultsToCalculate.results
                    ] as any
                  ).resultsByRound.forEach(
                    ({
                      pointsPerPair,
                      effectivenessByPair,
                      roundWinner
                    }: any) => {
                      currentPairPoints += pointsPerPair[`pair${pairIdx + 1}`];
                      currentPairEffect +=
                        effectivenessByPair[`pair${pairIdx + 1}`];
                      currentPlayerWins += roundWinner === pairIdx ? 1 : 0;
                      currentPlayerDefeats += roundWinner !== pairIdx ? 1 : 0;
                    }
                  );

                  const payload = {
                    pairP1Id: pair[0].id,
                    pairP2Id: pair[1].id,
                    name: pair[0]?.name + ' - ' + pair[1]?.name,
                    pair: pairIdx + 1,
                    table:
                      resultsToCalculate.tables.tables.findIndex(
                        ({ tableId }) => tableId === key
                      ) + 1,
                    points: currentPairPoints,
                    wins: currentPlayerWins,
                    defeats: currentPlayerDefeats,
                    effectiveness: currentPairEffect
                  };

                  logs.push(payload);
                }
              );
            });

            logs.sort((a, b) => {
              if (a.wins !== b.wins) {
                return a.wins - b.wins;
              } else if (a.defeats !== b.defeats) {
                return a.defeats - b.defeats;
              } else if (a.effectiveness !== b.effectiveness) {
                return a.effectiveness - b.effectiveness;
              } else if (a.points !== b.points) {
                return a.points - b.points;
              }
              return 1;
            });

            logs.reverse();

            return logs;
          }

          if (type === 'tables') {
            const logs: any[] = [];

            tableKeys.forEach(key => {
              let currentTableIndex = 0;
              const currentTable = thisTablePairsMapped.find(
                ({ tableId }, index) => {
                  currentTableIndex = index;
                  return tableId === key;
                }
              );

              let pair1Points = 0;
              let pair2Points = 0;

              (
                resultsToCalculate.results[
                  key as keyof typeof resultsToCalculate.results
                ] as any
              ).resultsByRound.forEach((roundResults: any) => {
                pair1Points += roundResults.pointsPerPair.pair1;
                pair2Points += roundResults.pointsPerPair.pair2;
              });

              const lastRound = (
                resultsToCalculate.results[
                  key as keyof typeof resultsToCalculate.results
                ] as any
              ).resultsByRound[
                (
                  resultsToCalculate.results[
                    key as keyof typeof resultsToCalculate.results
                  ] as any
                ).resultsByRound.length - 1
              ];

              const payload = {
                table: currentTableIndex + 1,
                pair1Points,
                pair2Points,
                currentTableRound: lastRound.currentTableRound,
                lastWinner: lastRound.roundWinner ?? '--',
                finalWinner: lastRound.finalWinner ?? '--'
              };

              logs.push(payload);
            });

            logs.sort((a, b) => {
              return a.currentTableRound - b.currentTableRound;
            });

            logs.reverse();

            return logs;
          }

          return [];
        }

        const thisTablePairsMapped = tournamentData.tables.tables
          .map(tab => {
            return {
              ...tab,
              thisTablePairs: groupedByTable(tournamentData.tables.pairs)[
                tab.tableId
              ]
            };
          })
          .map(d => ({ tablePlayers: d.thisTablePairs, tableId: d.tableId }));

        const tableKeys = Object.keys(tournament.results);

        if (type === 'individual') {
          const logs: any[] = [];

          tableKeys.forEach((key, tableIdx) => {
            const currentTable = thisTablePairsMapped.find(
              ({ tableId }) => tableId === key
            );

            currentTable?.tablePlayers.forEach((pair: any, pairIdx: number) => {
              pair.forEach((player: any, pIdx: number) => {
                let currentPlayer = '';

                let currentPlayerPoints = 0;
                let currentPlayerEffect = 0;
                let currentPlayerWins = 0;
                let currentPlayerDefeats = 0;

                switch (pairIdx.toString() + pIdx.toString()) {
                  case '00':
                    currentPlayer = 'p1';
                    break;
                  case '01':
                    currentPlayer = 'p2';
                    break;
                  case '10':
                    currentPlayer = 'p3';
                    break;
                  case '11':
                    currentPlayer = 'p4';
                    break;

                  default:
                    currentPlayer = 'p1';
                    break;
                }

                tournament.results[key].resultsByRound.forEach(
                  ({
                    pointsPerPlayer,
                    effectivenessByPlayer,
                    roundWinner
                  }: any) => {
                    currentPlayerPoints += pointsPerPlayer[currentPlayer];
                    currentPlayerEffect += effectivenessByPlayer[currentPlayer];
                    currentPlayerWins += roundWinner === pairIdx ? 1 : 0;
                    currentPlayerDefeats += roundWinner !== pairIdx ? 1 : 0;
                  }
                );

                const payload = {
                  id: player.id,
                  name: player.name,
                  pair: pairIdx + 1,
                  table:
                    tournament.tables.tables.findIndex(
                      ({ tableId }: any) => tableId === key
                    ) + 1,
                  points: currentPlayerPoints,
                  wins: currentPlayerWins,
                  defeats: currentPlayerDefeats,
                  effectiveness: currentPlayerEffect
                };

                logs.push(payload);
              });
            });
          });

          logs.sort((a, b) => {
            if (a.wins !== b.wins) {
              return a.wins - b.wins;
            } else if (a.defeats !== b.defeats) {
              return a.defeats - b.defeats;
            } else if (a.effectiveness !== b.effectiveness) {
              return a.effectiveness - b.effectiveness;
            } else if (a.points !== b.points) {
              return a.points - b.points;
            }
            return 1;
          });

          logs.reverse();

          return logs;
        }

        if (type === 'pairs') {
          const logs: any[] = [];

          tableKeys.forEach((key, tableIdx) => {
            const currentTable = thisTablePairsMapped.find(
              ({ tableId }) => tableId === key
            );

            currentTable?.tablePlayers.forEach((pair: any, pairIdx: number) => {
              let currentPairPoints = 0;
              let currentPairEffect = 0;
              let currentPlayerWins = 0;
              let currentPlayerDefeats = 0;

              tournament?.results[key].resultsByRound.forEach(
                ({ pointsPerPair, effectivenessByPair, roundWinner }: any) => {
                  currentPairPoints += pointsPerPair[`pair${pairIdx + 1}`];
                  currentPairEffect +=
                    effectivenessByPair[`pair${pairIdx + 1}`];
                  currentPlayerWins += roundWinner === pairIdx ? 1 : 0;
                  currentPlayerDefeats += roundWinner !== pairIdx ? 1 : 0;
                }
              );

              const payload = {
                pairP1Id: pair[0].id,
                pairP2Id: pair[1].id,
                name: pair[0].name + ' - ' + pair[1].name,
                pair: pairIdx + 1,
                table:
                  tournament.tables.tables.findIndex(
                    ({ tableId }: any) => tableId === key
                  ) + 1,
                points: currentPairPoints,
                wins: currentPlayerWins,
                defeats: currentPlayerDefeats,
                effectiveness: currentPairEffect
              };

              logs.push(payload);
            });
          });

          logs.sort((a, b) => {
            if (a.wins !== b.wins) {
              return a.wins - b.wins;
            } else if (a.defeats !== b.defeats) {
              return a.defeats - b.defeats;
            } else if (a.effectiveness !== b.effectiveness) {
              return a.effectiveness - b.effectiveness;
            } else if (a.points !== b.points) {
              return a.points - b.points;
            }
            return 1;
          });

          logs.reverse();

          return logs;
        }

        if (type === 'tables') {
          const logs: any[] = [];

          tableKeys.forEach(key => {
            let currentTableIndex = 0;
            const currentTable = thisTablePairsMapped.find(
              ({ tableId }, index) => {
                currentTableIndex = index;
                return tableId === key;
              }
            );

            let pair1Points = 0;
            let pair2Points = 0;

            tournament?.results[key].resultsByRound.forEach(
              (roundResults: any) => {
                pair1Points += roundResults.pointsPerPair.pair1;
                pair2Points += roundResults.pointsPerPair.pair2;
              }
            );

            const lastRound =
              tournament?.results[key].resultsByRound[
                tournament?.results[key].resultsByRound.length - 1
              ];

            const payload = {
              table: currentTableIndex + 1,
              pair1Points,
              pair2Points,
              currentTableRound: lastRound.currentTableRound,
              lastWinner: lastRound.roundWinner ?? '--',
              finalWinner: lastRound.finalWinner ?? '--'
            };

            logs.push(payload);
          });

          logs.sort((a, b) => {
            return a.currentTableRound - b.currentTableRound;
          });

          logs.reverse();

          return logs;
        }
      }
      return [];
    },
    [tournament, tournamentData, usersData]
  );

  const handleNextGlobalRound = useCallback(() => {
    if (tournament && tournamentData && tournament.results) {
      const storedRoundPayload: StoredRoundDataInterface = {
        currentRoundId: tournament.currentGlobalRound,
        tables: tournament.tables,
        results: tournament.results,
        storedDate: new Date().getTime()
      };

      const newPlayersLayout: any =
        organizeTournamentsPlayersWithSimilarPerformanceArray(
          calculateTablePositions(
            tournament.format,
            storedRoundPayload,
            tournamentData.storedRounds
          ),
          tournamentData.tables,
          tournament.format,
          tournament.currentGlobalRound
        );

      if (!newPlayersLayout.error) {
        const tournamentPayload: TournamentInterface = {
          ...tournament,
          results: {},
          tables: newPlayersLayout as PairsTableInterface,
          currentGlobalRound:
            tournament.currentGlobalRound +
            (tournament.currentGlobalRound === tournament.customRounds ? 0 : 1),
          status:
            tournament.currentGlobalRound === tournament.customRounds
              ? 'finished'
              : tournament.status,
          endDate:
            tournament.currentGlobalRound === tournament.customRounds
              ? new Date().getTime()
              : null,
          storedRounds: [...(tournament.storedRounds ?? []), storedRoundPayload]
        };

        dispatch(
          updateTournament({
            context: fContext,
            id: tournament?.id,
            body: tournamentPayload
          })
        );
      }
    }
  }, [tournament, tournamentData]);

  const updateTournamentStatus = useCallback(
    (newStatus: TournamentState) => {
      dispatch(
        updateTournament({
          context: fContext,
          id: tournament?.id,
          body: {
            ...tournament,
            status: newStatus
          }
        })
      );
    },
    [tournament]
  );

  const calculateFinalResults = useCallback(
    (format?: 'individual' | 'pairs' | 'tables') => {
      if (
        tournament &&
        tournamentData &&
        tournament?.storedRounds &&
        tournament?.storedRounds?.length > 0 &&
        tournament.status === 'finished' &&
        format
      ) {
        const { storedRounds } = tournament;
        const concatenation: any = [];
        const participants: any = [];
        const finalParticipantResults: any = [];

        storedRounds?.forEach((gRound: any) => {
          const resultInFormat = calculateTablePositions(format, gRound);

          concatenation.push(resultInFormat);
        });

        if (concatenation.length) {
          concatenation[0].forEach((part: any) => {
            participants.push({
              name: part.name
            });
          });

          if (participants.length > 0) {
            participants.forEach((part: any) => {
              const resultsOfCurrentParticipant: any[] = [];
              const payload = {
                points: 0,
                effectiveness: 0,
                wins: 0,
                defeats: 0,
                name: part.name
              };

              concatenation.forEach((concat: any) => {
                const currentParticipantRoundResults = concat.find(
                  ({ name }: any) => name === part.name
                );
                resultsOfCurrentParticipant.push(
                  currentParticipantRoundResults
                );
              });

              resultsOfCurrentParticipant.forEach(pairGlobalResults => {
                payload.points += pairGlobalResults.points;
                payload.effectiveness += pairGlobalResults.effectiveness;
                payload.wins += pairGlobalResults.wins;
                payload.defeats += pairGlobalResults.defeats;
              });

              finalParticipantResults.push(payload);
            });
          }
        }

        finalParticipantResults.sort((a: any, b: any) => {
          if (b.wins !== a.wins) {
            return b.wins - a.wins;
          } else if (b.defeats !== a.defeats) {
            return b.defeats - a.defeats;
          } else if (b.effectiveness !== a.effectiveness) {
            return b.effectiveness - a.effectiveness;
          } else if (b.points !== a.points) {
            return b.points - a.points;
          }
          return 1;
        });

        return {
          winnerInfo: finalParticipantResults[0] ?? null,
          globalPositionsTable: finalParticipantResults
        };
      }

      return {
        winnerInfo: null,
        globalPositionsTable: []
      };
    },
    [tournament, tournamentData]
  );

  const handleSumWinsAndDefeatsOfStoredResults = useCallback(
    (
      storedRounds: StoredRoundDataInterface[],
      calculationType: TournamentFormat
    ) => {
      if (calculationType === 'individual') {
        const mappedData = storedRounds.map(round => ({
          currentRoundId: round.currentRoundId,
          resultsInIndividualFormat: calculateTablePositions(
            calculationType,
            round
          )
        }));

        const response = mappedData.map(
          ({ resultsInIndividualFormat, currentRoundId }, index) => {
            const resultsInIndividualFormatModified: any =
              resultsInIndividualFormat.map(({ id: playerId, ...player }) => {
                let currentPlayerAccumulationOfWins = 0;
                let currentPlayerAccumulationOfDefeats = 0;
                let currentPlayerAccumulationOfEffectiveness = 0;
                let currentPlayerAccumulationOfPoints = 0;

                const previousRounds =
                  index > 0
                    ? [...mappedData].splice(0, index)
                    : [
                        mappedData.map(s => ({
                          ...s,
                          resultsInIndividualFormat:
                            s.resultsInIndividualFormat.map(w => ({
                              ...w,
                              wins: 0,
                              defeats: 0,
                              effectiveness: 0,
                              points: 0
                            }))
                        }))[0]
                      ];

                previousRounds.forEach(({ resultsInIndividualFormat: p }) => {
                  currentPlayerAccumulationOfWins += p.find(
                    ({ id }) => id === playerId
                  ).wins;
                  currentPlayerAccumulationOfDefeats += p.find(
                    ({ id }) => id === playerId
                  ).defeats;
                  currentPlayerAccumulationOfEffectiveness += p.find(
                    ({ id }) => id === playerId
                  ).effectiveness;
                  currentPlayerAccumulationOfPoints += p.find(
                    ({ id }) => id === playerId
                  ).points;
                });

                currentPlayerAccumulationOfWins += player.wins;
                currentPlayerAccumulationOfDefeats += player.defeats;
                currentPlayerAccumulationOfEffectiveness +=
                  player.effectiveness;
                currentPlayerAccumulationOfPoints += player.points;

                return {
                  ...player,
                  id: playerId,
                  wins: currentPlayerAccumulationOfWins,
                  defeats: currentPlayerAccumulationOfDefeats,
                  effectiveness: currentPlayerAccumulationOfEffectiveness,
                  points: currentPlayerAccumulationOfPoints
                };
              });

            return {
              currentRoundId,
              resultsInIndividualFormat: resultsInIndividualFormatModified
            };
          }
        );

        console.log('response', response);

        return response;
      }
    },
    [
      calculateTablePositions,
      positionsTableIndividualColumns,
      positionsTableIndividualMapper
    ]
  );

  return {
    tournamentData,
    errorDocument,
    tournamentAPI: {
      registerResultsByTable,
      handleSumWinsAndDefeatsOfStoredResults,
      updateTournamentStatus,
      calculateTablePositions,
      handleNextGlobalRound,
      calculateFinalResults
    }
  };
};

export default useTournamentData;

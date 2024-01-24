import {
  IndividualTableInterface,
  PairsTableInterface,
  ResultsByRoundInterface,
  TableObjectInterface,
  TournamentFormat,
  TournamentInterface
} from '@/typesDefs/constants/tournaments/types';
import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
  stepLabelClasses
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from '../styles/TableComponent.module.scss';
import { UserInterface } from '@/typesDefs/constants/users/types';
import {
  EditNote,
  EmojiEvents,
  KeyboardArrowDown,
  TableRestaurant
} from '@mui/icons-material';
import ReactTable from '@/components/ReactTable/ReactTable';
import { roundsHistoryColumns } from '../constants/positionsTableColumns';
import { roundsHistoryMapper } from '../constants/mapper';
import { ellipsisText } from '@/utils/ellipsis-text';

const PlayerCard = ({
  player,
  effectiveness,
  points,
  color
}: {
  player: UserInterface;
  points: number;
  effectiveness: number;
  color: string;
}) => {
  return (
    <Tooltip
      title={
        <div className={styles.tooltip}>
          <Typography>{`${player.name}`}</Typography>
          <Typography
            style={{
              background: '#fff',
              borderRadius: '3px',
              textAlign: 'center',
              padding: '0 3px',
              marginBottom: '3px',
              color: '#000000'
            }}
            className={styles.effectiveness1}
          >
            {points ?? ''} pts
          </Typography>
          <Typography
            style={{
              background: '#fff',
              borderRadius: '3px',
              textAlign: 'center',
              padding: '0 3px',
              color: effectiveness > 0 ? 'green' : 'red'
            }}
            className={styles.effectiveness1}
          >
            {effectiveness ?? ''}
          </Typography>
        </div>
      }
    >
      <div
        className={styles.userCard}
        style={{
          background: color + '1f',
          borderColor: color,
          color
        }}
      >
        <Avatar className={styles.avatar}>
          {player.name.length
            ? `${player.name[0]}${player.name.split(' ')[1][0] ?? ''}`
            : ''}
        </Avatar>
        <Typography
          className={styles.label}
          fontWeight={'700'}
          variant="h6"
          component="h2"
        >
          {`${player.name.split(' ')[0].length < 10 ? player.name.split(' ')[0] : player.name.split(' ')[0].substring(0, 7) + '...'}`}
        </Typography>
      </div>
    </Tooltip>
  );
};

interface TableComponentProps {
  tournament?: any;
  tableData: any;
  thisTablePairs: any[][];
  tableNumber?: number;
  showHUD: boolean;
  setOpenUpdateResults?: () => any;
}

const TableComponent: React.FC<TableComponentProps> = ({
  tournament,
  tableData,
  thisTablePairs,
  tableNumber,
  showHUD,
  setOpenUpdateResults
}) => {
  const p1 = thisTablePairs[0][0];
  const p2 = thisTablePairs[0][1];
  const p3 = thisTablePairs[1][0];
  const p4 = thisTablePairs[1][1];
  const [thisTableResults, setThisTableResults] = useState([]);
  const [lastResultsLog, setLastResultsLog] =
    useState<ResultsByRoundInterface | null>(null);
  const [openCollapse, setOpenCollapse] = useState(false);

  const { pair1Color, pair2Color } = tableData;

  useEffect(() => {
    if (thisTableResults.length > 0) {
      setLastResultsLog(thisTableResults[thisTableResults.length - 1]);
    }
  }, [thisTableResults]);

  useEffect(() => {
    if (
      tournament?.results &&
      tournament?.results?.[
        tableData?.tableId as keyof typeof tournament.results
      ]
    ) {
      const value =
        tournament?.results[
          tableData?.tableId as keyof typeof tournament.results
        ]?.resultsByRound;

      setThisTableResults(value);
    }
  }, [tournament?.results, tableData]);

  const effectivenessByPair = (pair: number) => {
    let pair1Effect = 0;
    let pair2Effect = 0;

    thisTableResults.forEach((roundResults: any) => {
      pair1Effect += roundResults.effectivenessByPair.pair1;
      pair2Effect += roundResults.effectivenessByPair.pair2;
    });

    if (pair === 1) return pair1Effect;
    if (pair === 2) return pair2Effect;

    return 0;
  };

  const pointsByPair = (pair: number) => {
    let pair1Points = 0;
    let pair2Points = 0;

    thisTableResults.forEach((roundResults: any) => {
      pair1Points += roundResults.pointsPerPair.pair1;
      pair2Points += roundResults.pointsPerPair.pair2;
    });

    if (pair === 1) return pair1Points;
    if (pair === 2) return pair2Points;
  };

  const victoriesByPair = (pair: number) => {
    let pair1Victories = 0;
    let pair2Victories = 0;

    thisTableResults.forEach((roundResults: any) => {
      pair1Victories += roundResults.roundWinner === 1 ? 0 : 1;
      pair2Victories += roundResults.roundWinner === 0 ? 0 : 1;
    });

    if (pair === 1) return pair1Victories;
    if (pair === 2) return pair2Victories;

    return 0;
  };

  const defeatsByPair = (pair: number) => {
    let pair1Defeats = 0;
    let pair2Defeats = 0;

    thisTableResults.forEach((roundResults: any) => {
      pair1Defeats += roundResults.roundWinner !== 0 ? 1 : 0;
      pair2Defeats += roundResults.roundWinner !== 1 ? 1 : 0;
    });

    if (pair === 1) return pair1Defeats;
    if (pair === 2) return pair2Defeats;

    return 0;
  };

  const pointsByPlayer = (player: string) => {
    let playerPoints = 0;

    thisTableResults.forEach((roundResults: any) => {
      playerPoints += roundResults.pointsPerPlayer[player];
    });

    return playerPoints;
  };

  const firstPosition = () => {
    let pair1Points = 0;
    let pair2Points = 0;

    thisTableResults.forEach((roundResults: any) => {
      pair1Points += roundResults.pointsPerPair.pair1;
      pair2Points += roundResults.pointsPerPair.pair2;
    });

    return pair1Points > pair2Points ? 0 : 1;
  };

  const mapRoundHistory = () => {
    return thisTableResults.map((round: any) => {
      return {
        currentTableRound: round.currentTableRound,
        pair1Points: round.pointsPerPair.pair1,
        pair2Points: round.pointsPerPair.pair2,
        winner: round.roundWinner
      };
    });
  };

  return (
    <div
      className={styles.actionsContainer}
      style={{ marginBottom: showHUD ? '50px' : '0' }}
    >
      {showHUD && (
        <Typography
          variant="h5"
          color="secondary"
          className={styles.tableTitle}
        >
          Mesa # {tableNumber}
        </Typography>
      )}
      <div className={styles.cardContainer}>
        {typeof lastResultsLog?.finalWinner === 'number' &&
          lastResultsLog?.tableMatchEnded && (
            <div className={styles.shadow}>
              <Typography className={styles.title1} variant="h4">
                Mesa Cerrada
              </Typography>
              <div className={styles.winnerContainer}>
                <Typography className={styles.title}>
                  Ganador de la mesa
                </Typography>
                <div
                  className={styles.pair}
                  style={{
                    background:
                      tableData[
                        `pair${lastResultsLog?.finalWinner + 1 ?? 1}Color`
                      ] + '1f',
                    borderColor:
                      tableData[`pair${lastResultsLog?.finalWinner + 1 ?? 1}Color`],
                    color:
                      tableData[`pair${lastResultsLog?.finalWinner + 1 ?? 1}Color`]
                  }}
                >
                  {thisTablePairs[lastResultsLog?.finalWinner ?? 1].map(
                    (player: UserInterface, indexPlayer: number) => {
                      return (
                        <>
                          <div className={styles.inputs}>
                            <Typography fontSize={'20px'} fontWeight={'bold'}>
                              {ellipsisText(player.name, 10)}
                            </Typography>
                          </div>
                          {indexPlayer < 1 && (
                            <EmojiEvents
                              style={{
                                color:
                                  tableData[
                                    `pair${
                                      (lastResultsLog?.finalWinner && lastResultsLog?.finalWinner + 1) ?? 1
                                    }Color`
                                  ]
                              }}
                            />
                          )}
                        </>
                      );
                    }
                  )}
                </div>
                <Typography className={styles.title2}>Puntaje</Typography>
                <List className={styles.resultsWinner}>
                  <ListItem
                    className={styles.listItem}
                    style={{ background: '#f5f5f5' }}
                  >
                    <Typography className={styles.pairColors}>
                      Puntos:{' '}
                    </Typography>
                    <Typography
                      fontWeight={'bold'}
                      className={styles.pairColors}
                    >
                      {pointsByPair(lastResultsLog?.finalWinner + 1) ?? '--'}{' '}
                      pts
                    </Typography>
                  </ListItem>
                  <ListItem
                    className={styles.listItem}
                    style={{ background: '#e7e7e7' }}
                  >
                    <Typography className={styles.pairColors}>
                      Efectividad:{' '}
                    </Typography>
                    <Typography
                      fontWeight={'bold'}
                      style={{
                        color:
                          effectivenessByPair(lastResultsLog?.finalWinner + 1) >
                          0
                            ? 'green'
                            : 'red'
                      }}
                      className={styles.pairColors}
                    >
                      {effectivenessByPair(lastResultsLog?.finalWinner + 1) > 0
                        ? '+'
                        : ''}
                      {effectivenessByPair(lastResultsLog?.finalWinner + 1) ??
                        '--'}
                    </Typography>
                  </ListItem>
                  <ListItem
                    className={styles.listItem}
                    style={{ background: '#f5f5f5' }}
                  >
                    <Typography className={styles.pairColors}>
                      Victorias:{' '}
                    </Typography>
                    <Typography
                      fontWeight={'bold'}
                      style={{
                        color:
                          victoriesByPair(lastResultsLog?.finalWinner + 1) === 0
                            ? 'red'
                            : victoriesByPair(
                                  lastResultsLog?.finalWinner + 1
                                ) >= 3
                              ? 'green'
                              : 'orange'
                      }}
                      className={styles.pairColors}
                    >
                      {victoriesByPair(lastResultsLog?.finalWinner + 1)}
                    </Typography>
                  </ListItem>
                  <ListItem
                    className={styles.listItem}
                    style={{ background: '#e7e7e7' }}
                  >
                    <Typography className={styles.pairColors}>
                      Derrotas:{' '}
                    </Typography>
                    <Typography
                      fontWeight={'bold'}
                      style={{
                        color:
                          defeatsByPair(lastResultsLog?.finalWinner + 1) === 0
                            ? 'green'
                            : defeatsByPair(lastResultsLog?.finalWinner + 1) >=
                                3
                              ? 'red'
                              : 'orange'
                      }}
                      className={styles.pairColors}
                    >
                      {defeatsByPair(lastResultsLog?.finalWinner + 1)}
                    </Typography>
                  </ListItem>
                </List>
                <Tooltip title="Ver resultados recientes">
                  <IconButton
                    size="small"
                    onClick={() => setOpenCollapse(!openCollapse)}
                    style={{ marginRight: '10px' }}
                  >
                    <KeyboardArrowDown
                      className={styles.transition}
                      sx={{
                        transform: `rotateZ(${
                          openCollapse ? '180deg' : '0deg'
                        })`
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          )}
        <div className={styles.infoTopCard}>
          <Typography className={styles.pairColors}>
            Pareja 1:{' '}
            <div className={styles.dot} style={{ background: pair1Color }} />
          </Typography>
          <Typography className={styles.pairColors}>
            Pareja 2:{' '}
            <div className={styles.dot} style={{ background: pair2Color }} />
          </Typography>
        </div>
        {showHUD && (
          <>
            <div
              className={styles.infoTopCard}
              style={{ right: '20px', left: 'initial' }}
            >
              <Typography fontWeight={'bold'} fontSize={'15px'}>
                Ronda actual:
                <Typography
                  fontWeight={'bold'}
                  textAlign={'center'}
                  fontSize={'20px'}
                >
                  {tableData.currentTableRound}
                </Typography>
              </Typography>
            </div>
          </>
        )}
        <div className={styles.row}>
          {p1 && (
            <PlayerCard
              player={p1}
              effectiveness={lastResultsLog?.effectivenessByPlayer?.p1 ?? 0}
              points={pointsByPlayer('p1') ?? ''}
              color={pair1Color}
            />
          )}
        </div>
        <div className={styles.row}>
          {p3 && (
            <PlayerCard
              player={p3}
              effectiveness={lastResultsLog?.effectivenessByPlayer?.p3 ?? 0}
              points={pointsByPlayer('p3') ?? ''}
              color={pair2Color}
            />
          )}
          <TableRestaurant color="primary" style={{ fontSize: '100px' }} />
          {p4 && (
            <PlayerCard
              player={p4}
              effectiveness={lastResultsLog?.effectivenessByPlayer?.p4 ?? 0}
              points={pointsByPlayer('p4') ?? ''}
              color={pair2Color}
            />
          )}
        </div>
        <div className={styles.row}>
          {p2 && (
            <PlayerCard
              player={p2}
              effectiveness={lastResultsLog?.effectivenessByPlayer?.p2 ?? 0}
              points={pointsByPlayer('p2') ?? ''}
              color={pair1Color}
            />
          )}
        </div>
        {showHUD && (
          <div
            className={styles.infoTopCard}
            style={{
              top: 'initial',
              left: '20px',
              bottom: '20px',
              right: 'initial'
            }}
          >
            {Boolean(lastResultsLog && firstPosition() > -1) && (
              <>
                <Typography
                  style={{ fontSize: '11px' }}
                  fontWeight={'bold'}
                  className={styles.pairColors}
                >
                  Primer puesto:
                </Typography>
                <Typography
                  className={styles.pairColors}
                  style={{ fontSize: '11px' }}
                >
                  Pareja {firstPosition() + 1}{' '}
                  <div
                    className={styles.dot}
                    style={{
                      background:
                        tableData[`pair${firstPosition() + 1 ?? 1}Color`]
                    }}
                  />
                </Typography>
              </>
            )}
            {lastResultsLog && (
              <>
                <Typography
                  style={{ fontSize: '11px' }}
                  fontWeight={'bold'}
                  className={styles.pairColors}
                >
                  Ganador anterior:
                </Typography>
                <Typography
                  className={styles.pairColors}
                  style={{ fontSize: '11px' }}
                >
                  Pareja {lastResultsLog?.roundWinner + 1}{' '}
                  <div
                    className={styles.dot}
                    style={{
                      background:
                        tableData[
                          `pair${lastResultsLog?.roundWinner + 1 ?? 1}Color`
                        ]
                    }}
                  />
                </Typography>
              </>
            )}
            <Typography
              style={{ fontSize: '11px' }}
              fontWeight={'bold'}
              className={styles.pairColors}
            >
              Puntos:
            </Typography>
            <Typography className={styles.pairColors}>
              <div
                className={styles.dot}
                style={{
                  marginLeft: '0',
                  marginRight: '5px',
                  background: pair1Color
                }}
              />
              {pointsByPair(1) ?? '--'} pts
              <Typography
                style={{ color: effectivenessByPair(1) > 0 ? 'green' : 'red' }}
                className={styles.effectiveness}
              >
                {effectivenessByPair(1) ?? ''}
              </Typography>
            </Typography>
            <Typography className={styles.pairColors}>
              <div
                className={styles.dot}
                style={{
                  marginLeft: '0',
                  marginRight: '5px',
                  background: pair2Color
                }}
              />
              {pointsByPair(2) ?? '--'} pts
              <Typography
                style={{ color: effectivenessByPair(2) > 0 ? 'green' : 'red' }}
                className={styles.effectiveness}
              >
                {effectivenessByPair(2) ?? ''}
              </Typography>
            </Typography>
          </div>
        )}
        {showHUD && (
          <div
            className={styles.infoTopCard}
            style={{
              top: 'initial',
              left: 'initial',
              bottom: '20px',
              right: '20px'
            }}
          >
            <Tooltip title="Ver resultados recientes">
              <IconButton
                onClick={() => setOpenCollapse(!openCollapse)}
                style={{ marginRight: '10px' }}
              >
                <KeyboardArrowDown
                  className={styles.transition}
                  sx={{
                    transform: `rotateZ(${openCollapse ? '180deg' : '0deg'})`
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Registrar resultados">
              <IconButton onClick={setOpenUpdateResults} color="primary">
                <EditNote />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </div>
      <Collapse style={{ width: '100%', marginTop: '-20px' }} in={openCollapse}>
        <div className={styles.historyCollapse}>
          <Typography fontWeight={'bold'} className={styles.title}>
            Historial
          </Typography>
          <Typography
            fontSize={'12px'}
            style={{ marginBottom: '10px', color: '#7a7a7a' }}
          >
            Este es el historial de cada ronda jugada de esta mesa.
          </Typography>
          <ReactTable
            columns={roundsHistoryColumns}
            data={roundsHistoryMapper(mapRoundHistory()) ?? []}
          />
        </div>
      </Collapse>
    </div>
  );
};

export default TableComponent;

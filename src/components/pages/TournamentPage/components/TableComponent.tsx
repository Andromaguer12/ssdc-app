import { IndividualTableInterface, PairsTableInterface, TableObjectInterface, TournamentFormat, TournamentInterface } from '@/typesDefs/constants/tournaments/types'
import { Avatar, Collapse, IconButton, Tooltip, Typography, stepLabelClasses } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styles from '../styles/TableComponent.module.scss'
import { UserInterface } from '@/typesDefs/constants/users/types'
import { EditNote, KeyboardArrowDown, TableRestaurant } from '@mui/icons-material'
import { generateHexColor } from '@/utils/generate-hex-color'
import ReactTable from '@/components/ReactTable/ReactTable'
import { roundsHistoryColumns } from '../constants/positionsTableColumns'
import { roundsHistoryMapper } from '../constants/mapper'

const PlayerCard = ({player, effectiveness, points, color}: { player: UserInterface, points: number,effectiveness: number, color: string }) => {
  return (
    <Tooltip 
      title={
        <div className={styles.tooltip}>
          <Typography>
            {`${player.name.split(" ") ?? ""}`}
          </Typography>
          <Typography 
            style={{ 
              background: "#fff",
              borderRadius: '3px',
              textAlign: "center",
              padding: "0 3px",
              marginBottom: '3px',
              color: "#000000"
            }} 
            className={styles.effectiveness1}
          >
            {points ?? ""} pts
          </Typography>
          <Typography 
            style={{ 
              background: "#fff",
              borderRadius: '3px',
              textAlign: "center",
              padding: "0 3px",
              color: effectiveness > 0 ? "green" : "red"
            }} 
            className={styles.effectiveness1}
          >
            {effectiveness ?? ""}
          </Typography>
        </div>
      }
    >
      <div 
        className={styles.userCard} 
        style={{ 
          background: color + "1f", 
          borderColor: color,
          color
        }}
      >
        <Avatar
          className={styles.avatar}
        >
          {
            player.name.length 
              ? `${player.name[0]}${player.name.split(" ")[1] ?? ""}` 
              : ""
          }
        </Avatar>
        <Typography 
          fontWeight={"700"} 
          variant="h6" 
          component="h2"
        >
          {player.name}
        </Typography>
      </div>
    </Tooltip>
  )
}

interface TableComponentProps {
  tournament: TournamentInterface,
  tableData: TableObjectInterface,
  thisTablePairs: UserInterface[][],
  tableNumber?: number,
  showHUD: boolean
  setOpenUpdateResults?: () => any
}

const TableComponent: React.FC<TableComponentProps> = ({ 
  tournament, 
  tableData, 
  thisTablePairs, 
  tableNumber,
  showHUD,
  setOpenUpdateResults 
}) => {
  const p1 = thisTablePairs[0][0]
  const p2 = thisTablePairs[0][1]
  const p3 = thisTablePairs[1][0]
  const p4 = thisTablePairs[1][1]
  const [thisTableResults, setThisTableResults] = useState([])
  const [lastResultsLog, setLastResultsLog] = useState(null)
  const [openCollapse, setOpenCollapse] = useState(false)

  const { pair1Color, pair2Color } = tableData;
  
  useEffect(() => {
    if(thisTableResults.length > 0) {
      setLastResultsLog(thisTableResults[thisTableResults.length-1])
    }
  }, [thisTableResults])
  

  useEffect(() => {
    if(tournament?.results && tournament?.results?.[tableData?.tableId]) { 
      const value = tournament?.results[tableData?.tableId]?.resultsByRound

      setThisTableResults(value)
    }
  }, [tournament?.results, tableData])
  

  const effectivenessByPair = (pair: number) => {
    let pair1Effect = 0
    let pair2Effect = 0

    thisTableResults.forEach((roundResults: any) => {
      pair1Effect+=roundResults.effectivenessByPair.pair1
      pair2Effect+=roundResults.effectivenessByPair.pair2
    });
    
    if(pair === 1) return pair1Effect
    if(pair === 2) return pair2Effect
  }

  const pointsByPair = (pair: number) => {
    let pair1Points = 0
    let pair2Points = 0

    thisTableResults.forEach((roundResults: any) => {
      pair1Points+=roundResults.pointsPerPair.pair1
      pair2Points+=roundResults.pointsPerPair.pair2
    });

    if(pair === 1) return pair1Points
    if(pair === 2) return pair2Points
  }

  const pointsByPlayer = (player: string) => {
    let playerPoints = 0

    thisTableResults.forEach((roundResults: any) => {
      playerPoints+=roundResults.pointsPerPlayer[player]
    });

    return playerPoints
  }

  const firstPosition = () => {
    let pair1Points = 0
    let pair2Points = 0

    thisTableResults.forEach((roundResults: any) => {
      pair1Points+=roundResults.pointsPerPair.pair1
      pair2Points+=roundResults.pointsPerPair.pair2
    });

    return pair1Points > pair2Points ? 0 : 1
  }

  const mapRoundHistory = () => {
    return thisTableResults.map((round: any) => {
      return {
        currentTableRound: round.currentTableRound,
        pair1Points: round.pointsPerPair.pair1,
        pair2Points: round.pointsPerPair.pair2,
        winner: round.roundWinner,
      }
    })
  }

  return (
    <div className={styles.actionsContainer} style={{ marginBottom: showHUD ? "50px" : "0" }}>
      
      {showHUD && <Typography 
        variant="h5" 
        color="secondary" 
        className={styles.tableTitle}
      >
        Mesa # {tableNumber}
      </Typography>}
      <div className={styles.cardContainer}>
        {typeof lastResultsLog?.finalWinner === "number" && lastResultsLog?.tableMatchEnded && (
          <div className={styles.shadow}>
            <Typography style={{ color: "#ffffff"}} variant='h4'>
              Mesa Cerrada
            </Typography>
            <Typography style={{ color: "green" }} variant='h4'>
              Ganadores
            </Typography>
            <div 
              className={styles.pair} 
              style={{ 
                background: 
                  tableData[`pair${lastResultsLog?.finalWinner ?? 1}Color`] + "1f",
                borderColor: 
                  tableData[`pair${lastResultsLog?.finalWinner ?? 1}Color`],
                color: 
                  tableData[`pair${lastResultsLog?.finalWinner ?? 1}Color`] 
              }}
            >
              {thisTablePairs[lastResultsLog?.finalWinner ?? 1]
                .map((player: UserInterface, indexPlayer: number) => {
                return (
                  <div className={styles.inputs}>
                    <Typography fontSize={"20px"} fontWeight={"bold"}>
                      {player.name.split(" ")}
                    </Typography>
                  </div>
                )
              })}
            </div>
          </div>
        )}
          <div className={styles.infoTopCard}>
            <Typography className={styles.pairColors}>
              Pareja 1: <div className={styles.dot} style={{ background: pair1Color }} />
            </Typography>
            <Typography className={styles.pairColors}>
              Pareja 2: <div className={styles.dot} style={{ background: pair2Color }} />
            </Typography>
          </div>
          {showHUD && <>
            <div className={styles.infoTopCard} style={{ right: "20px", left: "initial" }}>
              <Typography 
                fontWeight={"bold"}
                fontSize={"15px"}
              >
                Ronda actual: 
                <Typography 
                  fontWeight={"bold"} 
                  textAlign={'center'}
                  fontSize={"20px"}
                >
                    {tableData.currentTableRound}
                  </Typography>
              </Typography>
            </div>
          </>}
        <div className={styles.row}>
          {p1 && <PlayerCard 
            player={p1} 
            effectiveness={lastResultsLog?.effectivenessByPlayer?.p1 ?? ""}
            points={pointsByPlayer("p1") ?? ""}  
            color={pair1Color} 
          />}
        </div>
        <div className={styles.row}>
          {p3 && <PlayerCard 
            player={p3} 
            effectiveness={lastResultsLog?.effectivenessByPlayer?.p3 ?? ""}
            points={pointsByPlayer("p3") ?? ""}  
            color={pair2Color} 
          />}
          <TableRestaurant color='primary' style={{ fontSize: "100px" }} />
          {p4 && <PlayerCard 
            player={p4} 
            effectiveness={lastResultsLog?.effectivenessByPlayer?.p4 ?? ""}
            points={pointsByPlayer("p4") ?? ""}  
            color={pair2Color} 
          />}
        </div>
        <div className={styles.row}>
          {p2 && <PlayerCard 
            player={p2} 
            effectiveness={lastResultsLog?.effectivenessByPlayer?.p2 ?? ""}
            points={pointsByPlayer("p2") ?? ""}  
            color={pair1Color} 
          />}
        </div>
        {showHUD && <div 
          className={styles.infoTopCard} 
          style={{
            top: "initial",
            left: "20px",
            bottom: "20px",
            right: "initial",
          }}
        >
          {Boolean(lastResultsLog && firstPosition() > -1) && <>
            <Typography style={{ fontSize: "11px" }} fontWeight={"bold"} className={styles.pairColors}>
              Primer puesto:
            </Typography>
            <Typography className={styles.pairColors} style={{ fontSize: "11px" }}>
              Pareja {firstPosition() + 1} <div className={styles.dot} style={{ background: tableData[`pair${firstPosition() + 1 ?? 1}Color`] }} />
            </Typography>
          </>}
          {lastResultsLog && <>
            <Typography style={{ fontSize: "11px" }} fontWeight={"bold"} className={styles.pairColors}>
              Ganador anterior:
            </Typography>
            <Typography className={styles.pairColors} style={{ fontSize: "11px" }}>
              Pareja {lastResultsLog?.roundWinner + 1} <div className={styles.dot} style={{ background: tableData[`pair${lastResultsLog?.roundWinner + 1 ?? 1}Color`] }} />
            </Typography>
          </>}
          <Typography style={{ fontSize: "11px" }} fontWeight={"bold"} className={styles.pairColors}>
            Puntos:
          </Typography>
          <Typography className={styles.pairColors}>
            <div className={styles.dot} style={{ marginLeft: "0", marginRight: "5px", background: pair1Color }} />
            {pointsByPair(1) ?? "--"} pts
            <Typography style={{ color: effectivenessByPair(1) > 0 ? "green" : "red"}} className={styles.effectiveness}>
              {effectivenessByPair(1) ?? ""}
            </Typography>
          </Typography>
          <Typography className={styles.pairColors}>
            <div className={styles.dot} style={{ marginLeft: "0", marginRight: "5px", background: pair2Color }} />
            {pointsByPair(2) ?? "--"} pts
            <Typography style={{ color: effectivenessByPair(2) > 0 ? "green" : "red"}} className={styles.effectiveness}>
              {effectivenessByPair(2) ?? ""}
            </Typography>
          </Typography>
        </div>}
        {showHUD && <div 
          className={styles.infoTopCard} 
          style={{
            top: "initial",
            left: "initial",
            bottom: "20px",
            right: "20px",
          }}
        >
          <Tooltip title="Ver resultados recientes">
            <IconButton onClick={() => setOpenCollapse(!openCollapse)} style={{ marginRight: "10px" }}>
              <KeyboardArrowDown className={styles.transition} sx={{ transform: `rotateZ(${openCollapse ? "180deg" : "0deg"})`}} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Registrar resultados">
            <IconButton onClick={setOpenUpdateResults} color="primary">
              <EditNote />
            </IconButton>
          </Tooltip>
        </div>}
      </div>
      <Collapse
        style={{ width: "100%", marginTop: "-20px" }}
        in={openCollapse}
      >
        <div className={styles.historyCollapse}>
          <Typography fontWeight={"bold"} className={styles.title}>
            Historial
          </Typography>
          <Typography fontSize={"12px"} style={{ marginBottom: "10px", color: "#7a7a7a"}} >
            Este es el historial de cada ronda jugada de esta mesa.
          </Typography>
          <ReactTable
            columns={roundsHistoryColumns}
            data={roundsHistoryMapper(mapRoundHistory()) ?? []}
          /> 
        </div>
      </Collapse>
    </div>
  )
}

export default TableComponent
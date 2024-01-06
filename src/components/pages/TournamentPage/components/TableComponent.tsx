import { IndividualTableInterface, PairsTableInterface, TableObjectInterface, TournamentFormat } from '@/typesDefs/constants/tournaments/types'
import { Avatar, IconButton, Tooltip, Typography, stepLabelClasses } from '@mui/material'
import React from 'react'
import styles from '../styles/TableComponent.module.scss'
import { UserInterface } from '@/typesDefs/constants/users/types'
import { EditNote, KeyboardArrowDown, TableRestaurant } from '@mui/icons-material'
import { generateHexColor } from '@/utils/generate-hex-color'

const PlayerCard = ({player, color}: { player: UserInterface, color: string }) => {
  return (
    <Tooltip title={player.name}>
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
  tableData: TableObjectInterface,
  thisTablePairs: UserInterface[][],
  tableNumber?: number,
  showHUD: boolean
  setOpenUpdateResults?: () => any
}

const TableComponent: React.FC<TableComponentProps> = ({ 
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

  const { pair1Color, pair2Color } = tableData;

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
          {p1 && <PlayerCard player={p1} color={pair1Color} />}
        </div>
        <div className={styles.row}>
          {p3 && <PlayerCard player={p3} color={pair2Color} />}
          <TableRestaurant color='primary' style={{ fontSize: "100px" }} />
          {p4 && <PlayerCard player={p4} color={pair2Color} />}
        </div>
        <div className={styles.row}>
          {p2 && <PlayerCard player={p2} color={pair1Color} />}
        </div>
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
            <IconButton style={{ marginRight: "10px" }}>
              <KeyboardArrowDown />
            </IconButton>
          </Tooltip>
          <Tooltip title="Registrar resultados">
            <IconButton onClick={setOpenUpdateResults} color="primary">
              <EditNote />
            </IconButton>
          </Tooltip>
        </div>}
      </div>
    </div>
  )
}

export default TableComponent
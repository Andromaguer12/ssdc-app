import { TournamentInterface } from "@/typesDefs/constants/tournaments/types"
import { format } from 'date-fns'
import styles from '../styles/TournamentsPage.module.scss'
import { IconButton } from "@mui/material"
import { Delete, Edit, PanoramaFishEye, RemoveRedEye } from "@mui/icons-material"
import Link from "next/link"

export const tournamentsMapper = (data: any, handleDeleteModal: any) => {
  return data.map((row: TournamentInterface) => {
    return {
      name: (
        <>
          {row?.name}
        </>
      ),
      format: (
        <>
          {row?.format}
        </>
      ),
      startDate: (
        <>
          {row?.startDate ? format(new Date(row?.startDate), 'dd/MM/yyyy') : "Sin fecha"}
        </>
      ),
      endDate: (
        <>
          {row?.endDate ? format(new Date(row?.endDate), 'dd/MM/yyyy') : "Sin fecha"}
        </>
      ),
      currentGlobalRound: (
        <>
          {row.currentGlobalRound}
        </>
      ),
      customRounds: (
        <>
          {row.customRounds}
        </>
      ),
      allPlayers: (
        <>
          {row?.allPlayers?.length}
        </>
      ),
      game: (
        <>
          {row.game}
        </>
      ),
      state: (
        <div className={styles.stateCell}>
          {row.status}
          <div 
            className={styles.dot} 
            style={{ background: row.status === 'active' 
              ? "green" 
              : row.status === "paused"
                ? "yellow"
                : "#7a7a7a" 
            }} 
          />        
        </div>
      ),
      tables: (
        <>
          {row.tables.tables.length ?? 0}
        </>
      ),  
      actions: (
        <>
          <Link href={'/admin/tournaments/'+row.id}>
            <IconButton>
              <RemoveRedEye />
            </IconButton>
          </Link>
          
          <IconButton onClick={() => handleDeleteModal(row?.id ?? "")}>
            <Delete style={{ color: "red" }} />
          </IconButton>
        </>
      ),  
    }
  })
}
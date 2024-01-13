import { Typography } from "@mui/material"

export const positionsTableIndividualMapper = (data: any) => {
  return data.map((row: any) => {
    return {
      name: 
        <>
          {row.name}
        </>,
      pair: 
        <>
          {row.pair}
        </>,
      table: 
        <>
          {row.table}
        </>,
      points: 
        <>
          <Typography
            style={{ color: row.points > 75 ? "green" : row.points > 50 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {row.points}
          </Typography>        
        </>,
      wins: 
        <>
          <Typography
            style={{ color: row.wins === 0 ? "red" : row.wins >= 3 ? "green" : "orange" }}
            fontWeight={"bold"}
          >
            {row.wins}
          </Typography>        
        </>,
      defeats: 
        <>
          <Typography
            style={{ color: row.defeats === 0 ? "green" : row.defeats >= 3 ? "red" : "orange" }}
            fontWeight={"bold"}
          >
            {row.defeats}
          </Typography>        
        </>,
      effectiveness: 
        <>
          <Typography
            style={{ color: row.effectiveness > 0 ? "green" : "red" }}
            fontWeight={"bold"}
          >
            {row.effectiveness > 0 ? "+" : ""}{row.effectiveness}
          </Typography>
        </>,
    }
  })
}

export const finalPositionsTableIndividualMapper = (data: any) => {
  return data.map((row: any, index: number) => {
    return {
      position: 
        <>
          <Typography
            style={{ color: index+1 < 3 ? "green" : index+1 < 6 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {index+1}
          </Typography>     
        </>,
      name: 
        <>
          {row.name}
        </>,
      points: 
        <>
          <Typography
            style={{ color: row.points > 75 ? "green" : row.points > 50 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {row.points}
          </Typography>        
        </>,
      wins: 
        <>
          <Typography
            style={{ color: row.wins === 0 ? "red" : row.wins >= 3 ? "green" : "orange" }}
            fontWeight={"bold"}
          >
            {row.wins}
          </Typography>        
        </>,
      defeats: 
        <>
          <Typography
            style={{ color: row.defeats === 0 ? "green" : row.defeats >= 3 ? "red" : "orange" }}
            fontWeight={"bold"}
          >
            {row.defeats}
          </Typography>        
        </>,
      effectiveness: 
        <>
          <Typography
            style={{ color: row.effectiveness > 0 ? "green" : "red" }}
            fontWeight={"bold"}
          >
            {row.effectiveness > 0 ? "+" : ""}{row.effectiveness}
          </Typography>
        </>,
    }
  })
}

export const positionsTableByPairsMapper = (data: any) => {
  return data.map((row: any) => {
    return {
      name: 
        <>
          <Typography
            color="primary"
            fontWeight={"bold"}
          >
            {row.name}
          </Typography>
        </>,
      pair: 
        <>
          {row.pair}
        </>,
      table: 
        <>
          {row.table}
        </>,
      points: 
        <>
          <Typography
            style={{ color: row.points > 75 ? "green" : row.points > 50 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {row.points}
          </Typography>
        </>,
      wins: 
        <>
          <Typography
            style={{ color: row.wins === 0 ? "red" : row.wins >= 3 ? "green" : "orange" }}
            fontWeight={"bold"}
          >
            {row.wins}
          </Typography>        
        </>,
      defeats: 
        <>
          <Typography
            style={{ color: row.defeats === 0 ? "green" : row.defeats >= 3 ? "red" : "orange" }}
            fontWeight={"bold"}
          >
            {row.defeats}
          </Typography>        
        </>,
      effectiveness: 
        <>
          <Typography
            style={{ color: row.effectiveness > 0 ? "green" : "red" }}
            fontWeight={"bold"}
          >
            {row.effectiveness > 0 ? "+" : ""}{row.effectiveness}
          </Typography>
        </>,
    }
  })
}

export const finalPositionsTableByPairsMapper = (data: any) => {
  return data.map((row: any, index: number) => {
    return {
      position: 
        <>
          <Typography
            style={{ color: index+1 <= 3 ? "green" : index+1 <= 6 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {index+1}
          </Typography>     
        </>,
      name: 
        <>
          {row.name}
        </>,
      points: 
        <>
          <Typography
            style={{ color: row.points > 75 ? "green" : row.points > 50 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {row.points}
          </Typography>        
        </>,
      wins: 
        <>
          <Typography
            style={{ color: row.wins === 0 ? "red" : row.wins >= 3 ? "green" : "orange" }}
            fontWeight={"bold"}
          >
            {row.wins}
          </Typography>        
        </>,
      defeats: 
        <>
          <Typography
            style={{ color: row.defeats === 0 ? "green" : row.defeats >= 3 ? "red" : "orange" }}
            fontWeight={"bold"}
          >
            {row.defeats}
          </Typography>        
        </>,
      effectiveness: 
        <>
          <Typography
            style={{ color: row.effectiveness > 0 ? "green" : "red" }}
            fontWeight={"bold"}
          >
            {row.effectiveness > 0 ? "+" : ""}{row.effectiveness}
          </Typography>
        </>,
    }
  })
}

export const positionsTableByTablesMapper = (data: any) => {
  return data.map((row: any) => {
    return {
      currentTableRound: 
        <>
          <Typography
            fontWeight={"bold"}
          >
            {row.currentTableRound}
          </Typography>
        </>,
      table: 
        <>
          {row.table}
        </>,
      pair1Points: 
        <>
          <Typography
            style={{ color: row.pair1Points > 75 ? "green" : row.pair2Points > 50 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {row.pair1Points}
          </Typography>
        </>,
      pair2Points: 
        <>
          <Typography
            style={{ color: row.pair2Points > 75 ? "green" : row.pair2Points > 50 ? "orange" : "red" }}
            fontWeight={"bold"}
          >
            {row.pair2Points}
          </Typography>
        </>,
      lastWinner: 
        <>
          <Typography
            color="primary"
            fontWeight={"bold"}
          >
            Pareja {row.lastWinner + 1}
          </Typography>
        </>,
      finalWinner: 
        <>
          {row.finalWinner > -1 ? <Typography
            color="primary"
            fontWeight={"bold"}
          >
            Pareja {row.finalWinner + 1}
          </Typography> : "--"}
        </>
  }})
}

export const roundsHistoryMapper = (data: any) => {
  return data.map((row: any) => {
    return {
      currentTableRound: 
        <>
          <Typography
            fontWeight={"bold"}
          >
            {row.currentTableRound}
          </Typography>
        </>,
      pair1Points: 
        <>
          <Typography
            style={{ color: row.pair1Points == 0 ? "red" : "green" }}
            fontWeight={"bold"}
          >
            {row.pair1Points}
          </Typography>
        </>,
      pair2Points: 
        <>
          <Typography
            style={{ color: row.pair2Points == 0 ? "red" : "green" }}
            fontWeight={"bold"}
          >
            {row.pair2Points}
          </Typography>
        </>,
      winner: 
        <>
          <Typography
            color="primary"
            fontWeight={"bold"}
          >
            Pareja {row.winner + 1}
          </Typography>
        </>,
    }})
}
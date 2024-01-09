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
          {row.finalWinner}
        </>
  }})
}
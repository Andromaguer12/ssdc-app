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
          {row.points}
        </>,
      effectiveness: 
        <>
          {row.effectiveness}
        </>,
    }
  })
}

export const positionsTableByPairsMapper = (data: any) => {
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
          {row.points}
        </>,
      effectiveness: 
        <>
          {row.effectiveness}
        </>,
    }
  })
}
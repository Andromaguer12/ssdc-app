import {
  IndividualTableInterface,
  PairInterface,
  PairsTableInterface,
  ResultsInterface,
  TableObjectInterface,
  TournamentFormat
} from '@/typesDefs/constants/tournaments/types';
import shuffleArray from './shuffle-array';
import { uuid as uuidv4 } from 'uuidv4';
import { generateHexColor } from './generate-hex-color';
import { arraySplitter } from './array-splitter';

function generateRandomNumber(
  rangeStart: number,
  rangeEnd: number,
  excludedNumbers: number[]
) {
  let num;
  do {
    num = Math.floor(Math.random() * (rangeEnd - rangeStart + 1)) + rangeStart;
  } while (excludedNumbers.includes(num));
  return num;
}

function organizeTournamentsPlayersWithSimilarPerformanceArray(
  calculatedResults: any[],
  playedTables: PairsTableInterface,
  tournamentFormat: TournamentFormat,
  currentRound: number
): PairsTableInterface | { error: string } {
  if (tournamentFormat === 'individual') {
    const splittedResults = arraySplitter(calculatedResults, 4);
    
    const tables: any[] = splittedResults.map((prevTable: any[]) => {
      return {
        tableId: uuidv4(),
        table: prevTable.map(p => p.id),
        pair1Color: generateHexColor(),
        pair2Color: generateHexColor(),
        currentTableRound: 1
      };
    });

    const pairs = splittedResults.map((table, index) => {
      return [
        {
          pair: [table[0].id, table[2].id],
          table: tables[index].tableId
        },
        {
          pair: [table[1].id, table[3].id],
          table: tables[index].tableId
        }
      ]
    }).flat()

    const tablePrev: PairsTableInterface = {
      tables,
      pairs
    };

    // console.log(tablePrev)

    return tablePrev;
  }

  return {
    tables: [],
    pairs: []
  };
}

// function arraysEqual(arr1: any[], arr2: any[]): boolean {
//   return (
//     arr1.length === arr2.length &&
//     arr1.every((value, index) => value === arr2[index])
//   );
// }

const existEqualPairInTables = (pairToFind: string[], previousTables: any[]) => {
  const samePairFound = previousTables.find((pair: any) => pair.pair.includes(pairToFind[0]) && pair.pair.includes(pairToFind[1]));
  // console.log("pareja igual, a esta", pairToFind, "encontrada en", samePairFound)
  return Boolean(samePairFound)
}

export default organizeTournamentsPlayersWithSimilarPerformanceArray;

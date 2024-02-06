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
    const pairs: any[] = [];

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i].table;
      for (let j = 0; j < table.length; j += 2) {
        if (table[j + 1]) {
          const pair = [table[j], table[j + 1]];

          if (tournamentFormat === 'individual') {
            if (!existEqualPairInTables(pair, playedTables.pairs)) {
              pairs.push({ pair, table: tables[i].tableId });
            } else {
              const randomNumber = j == 2  ? 1 : j == 0 ? 3 : 1
              const pairReorganized = [table[j], table[randomNumber]];

              pairs.push({ pair: pairReorganized, table: tables[i].tableId });
            }
          } else {
            pairs.push({ pair, table: tables[i].tableId });
          }
        }
      }
    }

    const tablePrev: PairsTableInterface = {
      tables,
      pairs
    };

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

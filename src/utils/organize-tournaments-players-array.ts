import { IndividualTableInterface, PairsTableInterface, TableObjectInterface, TournamentFormat } from "@/typesDefs/constants/tournaments/types";
import shuffleArray from "./shuffle-array";
import { uuid as uuidv4 } from 'uuidv4'
import { generateHexColor } from "./generate-hex-color";

function organizeTournamentsPlayersArray(players: string[], format: TournamentFormat): IndividualTableInterface | PairsTableInterface | { error: string } {
  if (players.length < 2) {
    return { error: 'inssuficient-players' };
  }

  players = shuffleArray(players);

  const tables = [];
  const pairs = [];
  const individual = [];

  for (let i = 0; i < players.length; i += 4) {
    const table = { 
      table: players.slice(i, i + 4), 
      tableId: uuidv4(),
      currentTableRound: 1,
      pair1Color: generateHexColor(),
      pair2Color: generateHexColor(),
    };
    tables.push(table);
  }

  if (format === 'pairs') {
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i].table;
      for (let j = 0; j < table.length; j += 2) {
        if (table[j + 1]) {
          const pair = [table[j], table[j + 1]];
          pairs.push({ pair, table: tables[i].tableId });
        }
      }
    }

    const tablePrev: PairsTableInterface = { 
      tables, 
      pairs 
    }

    return tablePrev;
  }

  if (format === 'individual') {
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i].table;
      for (let j = 0; j < table.length; j++) {
        individual.push({ player: table[j], table: tables[i].tableId });
      }
    }

    const tablePrev: IndividualTableInterface = { 
      tables, 
      individual
    }

    return tablePrev
  }

  return { error: 'invalid-format' };
}


export default organizeTournamentsPlayersArray
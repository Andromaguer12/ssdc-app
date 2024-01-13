import { IndividualTableInterface, PairsTableInterface, ResultsInterface, TableObjectInterface, TournamentFormat } from "@/typesDefs/constants/tournaments/types";
import shuffleArray from "./shuffle-array";
import { uuid as uuidv4 } from 'uuidv4'
import { generateHexColor } from "./generate-hex-color";

export function organizeTournamentsPlayersWithSimilarPerformanceArray(results: ResultsInterface, playedTables: string[]): PairsTableInterface | { error: string } {
  const playersByPerformance: Record<number, string[]> = {};

  // Organizar jugadores por rendimiento
  Object.keys(results).forEach((tableId) => {
    const roundResults = results[tableId].resultsByRound;
    roundResults.forEach((roundResult) => {
      const roundNumber = roundResult.currentTableRound;
      const players = results[tableId].players;

      if (!playersByPerformance[roundNumber]) {
        playersByPerformance[roundNumber] = [];
      }

      // Ordenar jugadores por rendimiento y evitar repeticiones
      const sortedPlayers = players
        .filter((player) => !playedTables.includes(player))
        .sort((a, b) => roundResult.effectivenessByPlayer[b] - roundResult.effectivenessByPlayer[a]);

      playersByPerformance[roundNumber] = playersByPerformance[roundNumber].concat(sortedPlayers);
    });
  });

  // Organizar mesas y parejas
  const tables = [];
  const pairs = [];

  Object.keys(playersByPerformance).forEach((roundNumber) => {
    const roundPlayers = playersByPerformance[roundNumber];

    for (let i = 0; i < roundPlayers.length; i += 4) {
      const table = {
        table: roundPlayers.slice(i, i + 4),
        tableId: uuidv4(),
        currentTableRound: parseInt(roundNumber),
        pair1Color: generateHexColor(),
        pair2Color: generateHexColor(),
      };

      // Asegurar que p1 y p2, p3 y p4 estén emparejados
      const pair1 = [table.table[0], table.table[1]];
      const pair2 = [table.table[2], table.table[3]];

      // Evitar repeticiones de parejas
      if (!pairs.some((p) => arraysEqual(p.pair, pair1) || arraysEqual(p.pair, pair2))) {
        tables.push(table);
        pairs.push({ pair: pair1, table: table.tableId });
        pairs.push({ pair: pair2, table: table.tableId });
      }
    }
  });

  const tablePrev: PairsTableInterface = {
    tables,
    pairs,
  };

  return tablePrev;
}

// Función de comparación de arrays para evitar repeticiones de parejas
function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

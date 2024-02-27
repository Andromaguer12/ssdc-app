import { StoredRoundDataInterface } from '@/typesDefs/constants/tournaments/types';
import { Tab, Tabs, Typography } from '@mui/material';
import React, { ReactNode, useState } from 'react';
import styles from './styles/PositionsTable.module.scss';
import SwipeableViews from 'react-swipeable-views';
import ReactTable from '@/components/ReactTable/ReactTable';
import { ErrorOutline } from '@mui/icons-material';
import {
  positionsTableByPairsColumns,
  positionsTableByTablesColumns,
  positionsTableIndividualColumns
} from './constants/positionsTableColumns';
import {
  positionsTableByPairsMapper,
  positionsTableByTablesMapper,
  positionsTableIndividualMapper
} from './constants/mapper';

interface PositionsTableProps {
  calculateTablePositions?: any;
  resultsToCalculate?: StoredRoundDataInterface;
  storedRounds?: StoredRoundDataInterface[];
}

const PositionsTable: React.FC<PositionsTableProps> = ({
  calculateTablePositions,
  resultsToCalculate,
  storedRounds
}) => {
  const [performancesBy, setPerformancesBy] = useState<number>(0);

  const modes = [
    {
      columns: positionsTableIndividualColumns,
      data: positionsTableIndividualMapper(
        calculateTablePositions('individual', resultsToCalculate, storedRounds)
      ),
      name: 'individual'
    },
    {
      columns: positionsTableByPairsColumns,
      data: positionsTableByPairsMapper(
        calculateTablePositions('pairs', resultsToCalculate, storedRounds)
      ),
      name: 'pairs'
    },
    {
      columns: positionsTableByTablesColumns,
      data: positionsTableByTablesMapper(
        calculateTablePositions('tables', resultsToCalculate)
      ),
      name: 'tables'
    }
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setPerformancesBy(newValue);
  };

  return (
    <div className={styles.actionsContainer}>
      <Typography variant="h5" color="secondary" className={styles.tableTitle}>
        Tabla de posiciones
      </Typography>
      <div className={styles.cardContainer}>
        <Typography style={{ color: '#7a7a7a' }} fontSize={'14px'}>
          Seleccione el tipo de tabla:
        </Typography>
        <Tabs
          value={performancesBy}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab style={{ fontWeight: 'bold' }} label="Individuales" />
          <Tab style={{ fontWeight: 'bold' }} label="Parejas" />
          <Tab style={{ fontWeight: 'bold' }} label="Mesas" />
        </Tabs>
        <SwipeableViews
          style={{ width: '100%', marginTop: '20px', height: '100%' }}
          index={performancesBy}
          onChangeIndex={index => setPerformancesBy(index)}
        >
          {
            modes.map(({ name, data, columns }, index) => {
              if (data.length === 0) {
                return (
                  <div className={styles.message}>
                    <ErrorOutline
                      style={{ color: '#7a7a7a', fontSize: '60px' }}
                    />
                    <Typography style={{ color: '#7a7a7a' }} fontSize={'14px'}>
                      Sin registros
                    </Typography>
                  </div>
                );
              }

              return (
                <>
                  {performancesBy === index && (
                    <ReactTable key={name} columns={columns} data={data} />
                  )}
                </>
              );
            }) as any
          }
        </SwipeableViews>
      </div>
    </div>
  );
};

export default PositionsTable;

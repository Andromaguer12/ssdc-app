import React, { Dispatch } from 'react';
import styles from '../styles/UpdateResultsModal.module.scss';
import { TableObjectInterface } from '@/typesDefs/constants/tournaments/types';
import { UserInterface } from '@/typesDefs/constants/users/types';
import { Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlayerCardSort {
  currentTableData: TableObjectInterface;
  player: UserInterface;
  setItems: Dispatch<React.SetStateAction<any[]>>;
  color: '1' | '2';
}

const PlayerCardSort: React.FC<PlayerCardSort> = ({
  currentTableData,
  player,
  setItems,
  color
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player.id as string });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      key={player.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={styles.playerSortable}
      style={{
        background: currentTableData[`pair${color}Color`] + '1f',
        borderColor: currentTableData[`pair${color}Color`],
        color: currentTableData[`pair${color}Color`],
        margin: '10px 0',
        ...style
      }}
    >
      <div className={styles.inputs}>
        <Typography fontWeight={'bold'}>
          {player.name} - Actualmente en: Pareja {color}
        </Typography>
      </div>
    </div>
  );
};

export default PlayerCardSort;

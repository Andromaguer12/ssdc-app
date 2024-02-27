import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/UpdateResultsModal.module.scss';
import { ArrowBack, Check, Save, Upload } from '@mui/icons-material';
import TableComponent from './TableComponent';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearUpdateTournamentState } from '@/redux/reducers/tournaments/actions';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import PlayerCardSort from './PlayerCardSort';

interface ModalProps {
  open: string;
  tournament: any;
  handleClose: () => any;
}

const ChangePlayerTablePositionsModal: React.FC<ModalProps> = ({
  open,
  tournament,
  handleClose
}) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '7px',
    '@media screen and (max-width: 1300px)': {
      width: '80vw'
    },
    '@media screen and (max-width: 1200px)': {
      width: '90vw'
    },
    '@media screen and (max-width: 1060px)': {
      width: '95vw'
    }
  };

  const {
    updateTournament: { loadingUpdateTournament, successUpdateTournament }
  } = useAppSelector(({ tournaments }) => tournaments);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const [items, setItems] = React.useState<any[]>([]);

  const dispatch = useAppDispatch();

  const formikForm = React.useRef<any>();

  const { tournamentAPI } = useTournamentData(tournament.id as string);

  const currentTableData: any = tournament.tables.tables.find(
    ({ tableId }: { tableId: string }) => open === tableId
  ) as any;

  React.useEffect(() => {
    if (currentTableData.table) {
      setItems(currentTableData.table);
    }
  }, [currentTableData]);

  const handleCleanClose = (resetForm?: any) => {
    handleClose();
    dispatch(clearUpdateTournamentState());
    if (formikForm.current) formikForm.current?.resetForm();
  };

  const getItemPosition = (id: string) =>
    items.findIndex(item => item.id === id);

  const handleDragEnd = (e: any) => {
    const { active, over } = e;

    if (active.id === over.id) return;

    setItems(items => {
      const originalPos = getItemPosition(active.id);
      const newPostion = getItemPosition(over.id);

      return arrayMove(items, originalPos, newPostion);
    });
  };

  const handleSubmit = React.useCallback(() => {
    const mappedItems = items.map(({ id }) => id);

    tournamentAPI.handleChangePlayersPositionInTable(
      mappedItems,
      currentTableData.tableId
    );
  }, [items, currentTableData, tournamentAPI]);

  React.useEffect(() => {
    if (successUpdateTournament) {
      setTimeout(() => {
        handleCleanClose();
      }, 1000);
    }
  }, [successUpdateTournament]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={Boolean(open)}
      onClose={() => handleCleanClose()}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={!!open}>
        <Box sx={style}>
          <div className={styles.header}>
            <Typography
              fontWeight={'bold'}
              id="transition-modal-title"
              variant="h6"
              component="h2"
            >
              Reordenar posiciones de los jugadores en la mesa
            </Typography>
          </div>
          <div className={styles.body}>
            <div
              className={styles.column}
              style={{
                justifyContent: 'space-around',
                minHeight: 'fit-content',
                width: '100%'
              }}
            >
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}
              >
                <div className={styles.dndList}>
                  <SortableContext
                    items={items}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((player: any, index: number) => {
                      const color = index < 2 ? '1' : '2';

                      return (
                        <PlayerCardSort
                          key={player.id}
                          setItems={setItems}
                          currentTableData={currentTableData}
                          player={player}
                          color={color}
                        />
                      );
                    })}
                  </SortableContext>
                </div>
              </DndContext>
              <Typography
                fontSize={'12px'}
                style={{
                  color: '#7a7a7a',
                  marginTop: '10px',
                  alignSelf: 'flex-start'
                }}
              >
                Nota: Si desea cambiar el orden por defecto que se le asigna a
                un jugador, Debe arrastrar y soltar a un jugador hasta la
                posicion que desea colocarlo.
              </Typography>
            </div>
          </div>

          <div className={styles.buttons}>
            <Button
              disableElevation
              variant="contained"
              onClick={handleCleanClose}
              className={styles.cancelButton}
              startIcon={<ArrowBack />}
            >
              Atras
            </Button>
            <Button
              disableElevation
              variant="contained"
              className={styles.button}
              style={{
                background: successUpdateTournament ? 'green' : '#003994'
              }}
              endIcon={!loadingUpdateTournament ? <Save /> : <></>}
              onClick={handleSubmit}
            >
              {loadingUpdateTournament
                ? 'Actualizando...'
                : successUpdateTournament
                  ? 'Mesa Actualizada!'
                  : 'Actualizar'}
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ChangePlayerTablePositionsModal;

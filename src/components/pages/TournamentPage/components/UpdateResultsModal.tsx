import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/UpdateResultsModal.module.scss';
import {
  ArrowBack,
  Check,
  CheckCircle,
  CheckCircleOutline,
  CheckOutlined,
  Close,
  Search,
  Send
} from '@mui/icons-material';
import {
  Avatar,
  Card,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Step,
  StepButton,
  Stepper,
  TextField
} from '@mui/material';
import { Formik } from 'formik';
import { UserInterface } from '@/typesDefs/constants/users/types';
import TableComponent from './TableComponent';
import {
  TableObjectInterface,
  TournamentInterface
} from '@/typesDefs/constants/tournaments/types';
import useTournamentData from '@/hooks/useTournamentData/useTournamentData';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearUpdateTournamentState } from '@/redux/reducers/tournaments/actions';

interface ModalProps {
  open: string;
  tournament: any;
  handleClose: () => any;
}

interface formState {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

const UpdateTournamentModal: React.FC<ModalProps> = ({
  open,
  tournament,
  handleClose
}) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
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
    updateTournament: {
      loadingUpdateTournament,
      successUpdateTournament,
      errorUpdateTournament
    }
  } = useAppSelector(({ tournaments }) => tournaments);

  const dispatch = useAppDispatch();

  const formikForm = React.useRef<any>();

  const { tournamentAPI } = useTournamentData(tournament.id as string);

  const formInitialFormState: formState = {
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0
  };

  const currentTableData = tournament.tables.tables.find(
    ({ tableId }: { tableId: string }) => open === tableId
  ) as any;

  const handleCleanClose = (resetForm?: any) => {
    handleClose();
    dispatch(clearUpdateTournamentState());
    if (formikForm.current) formikForm.current?.resetForm();
  };

  const handleSubmitForm = React.useCallback(
    (values: formState, { resetForm }: { resetForm: any }) => {
      let pair1 = 0;
      let pair2 = 0;

      if (
        tournament?.results &&
        tournament?.results?.[currentTableData.tableId]
      ) {
        tournament.results[currentTableData.tableId].resultsByRound.forEach(
          (roundResults: any) => {
            pair1 += roundResults.pointsPerPair.pair1;
            pair2 += roundResults.pointsPerPair.pair2;
          }
        );
      }

      if (
        values.p1 > -1 &&
        values.p3 > -1 &&
        !successUpdateTournament
      ) {
        tournamentAPI.registerResultsByTable(
          currentTableData.tableId,
          currentTableData.currentTableRound,
          {
            p1: values.p1,
            p2: values.p1,
            p3: values.p3,
            p4: values.p3,
          },
          {
            pair1,
            pair2
          }
        );
      }
    },
    [currentTableData, successUpdateTournament, currentTableData, tournament]
  );

  React.useEffect(() => {
    if (successUpdateTournament) {
      setTimeout(() => {
        handleCleanClose();
      }, 1500);
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
      <Formik
        innerRef={formikForm}
        onSubmit={handleSubmitForm}
        initialValues={formInitialFormState}
      >
        {({ values, handleChange, submitForm }) => {
          return (
            <Fade in={!!open}>
              <Box sx={style}>
                <div className={styles.header}>
                  <Typography
                    fontWeight={'bold'}
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Registrando resultados
                  </Typography>
                </div>
                <div className={styles.body}>
                  <div
                    className={[styles.column, styles.tableContainer].join(' ')}
                  >
                    <TableComponent
                      tableData={currentTableData}
                      thisTablePairs={currentTableData?.thisTablePairs}
                      showHUD={false}
                    />
                  </div>
                  <div className={styles.column}>
                    <Typography
                      className={styles.title}
                      style={{ width: '100%' }}
                      variant="h4"
                      fontWeight={'bold'}
                    >
                      Resultados Ronda {currentTableData.currentTableRound}
                    </Typography>
                    {currentTableData?.thisTablePairs.map(
                      (pair: any, index: number) => {
                        let currentPlayer = '';

                        switch (
                          index.toString()
                        ) {
                          case '0':
                            currentPlayer = 'p1';
                            break;
                          case '1':
                            currentPlayer = 'p3';
                            break;

                          default:
                            currentPlayer = 'p1';
                            break;
                        }

                        return (
                          <div
                            className={styles.pair}
                            style={{
                              background:
                                currentTableData[`pair${index + 1}Color`] +
                                '1f',
                              borderColor:
                                currentTableData[`pair${index + 1}Color`],
                              color: currentTableData[`pair${index + 1}Color`]
                            }}
                          >
                            <div className={styles.inputs}>
                              <Typography fontWeight={'bold'}>
                                {pair.map((player: UserInterface) => player.name).join(" - ")}
                              </Typography>
                              <TextField
                                fullWidth
                                type="number"
                                style={{ marginTop: '7px' }}
                                value={
                                  values[
                                    currentPlayer as keyof typeof formInitialFormState
                                  ]
                                }
                                onChange={handleChange(currentPlayer)}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                    <Typography fontSize={'12px'} style={{ color: '#7a7a7a' }}>
                      Nota: Al registrar estos datos se sumara una ronda a la
                      mesa, y se sumaran los valores correspondietes a los
                      usuarios segun el formato del torneo.
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
                    onClick={() => submitForm()}
                    className={styles.button}
                    style={{
                      background: successUpdateTournament ? 'green' : '#003994'
                    }}
                    endIcon={!loadingUpdateTournament ? <Check /> : <></>}
                  >
                    {loadingUpdateTournament
                      ? 'Registrando'
                      : successUpdateTournament
                        ? 'Registrado!'
                        : 'Registrar'}
                  </Button>
                </div>
              </Box>
            </Fade>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default UpdateTournamentModal;

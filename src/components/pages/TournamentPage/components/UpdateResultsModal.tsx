import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/UpdateResultsModal.module.scss'
import { ArrowBack, Check, CheckCircle, CheckCircleOutline, CheckOutlined, Close, Search, Send } from '@mui/icons-material';
import { Avatar, Card, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Step, StepButton, Stepper, TextField } from '@mui/material';
import { Formik } from "formik";
import { UserInterface } from '@/typesDefs/constants/users/types';
import TableComponent from './TableComponent';
import { TableObjectInterface, TournamentInterface } from '@/typesDefs/constants/tournaments/types';

interface ModalProps {
  open: string,
  tournament: TournamentInterface,
  handleClose: () => any
}

interface formState {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

const UpdateTournamentModal: React.FC<ModalProps> = ({ open, tournament, handleClose }) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '7px'
  };  

  const formikForm = React.useRef()

  const formInitialFormState: formState = {
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
  }

  const currentTableData = 
    tournament
      .tables
      .tables
        .find(({ tableId }) => open === tableId) as any

  const handleCleanClose = (resetForm?: any) => {
    handleClose()
    if(formikForm.current) formikForm.current.resetForm()
  }

  const handleSubmitForm = React.useCallback(
    (values: formState, { resetForm }: { resetForm:any }) => {
      
    },
    [],
  )

  return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => handleCleanClose()}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Formik innerRef={formikForm} onSubmit={handleSubmitForm} initialValues={formInitialFormState}>
          {({ values, handleChange, submitForm, resetForm }) => {
            return (
            <Fade in={!!open}>
              <Box sx={style}>
                <div className={styles.header}>
                  <Typography fontWeight={"bold"} id="transition-modal-title" variant="h6" component="h2">
                    Registrando resultados
                  </Typography>
                </div>
                <div className={styles.body}>
                  <div className={styles.column}>
                    <TableComponent 
                      tableData={currentTableData}
                      thisTablePairs={currentTableData?.thisTablePairs} 
                      showHUD={false}
                    />
                  </div>
                  <div className={styles.column}>
                    <Typography style={{ width: '100%' }} variant="h4" fontWeight={"bold"}>
                      Resultados Ronda {currentTableData.currentTableRound}
                    </Typography>
                    {currentTableData?.thisTablePairs.map((pair, index: number) => {
                      return (
                        <div 
                          className={styles.pair} 
                          style={{ 
                            background: 
                              currentTableData[`pair${index+1}Color`] + "1f",
                            borderColor: 
                              currentTableData[`pair${index+1}Color`],
                            color: 
                              currentTableData[`pair${index+1}Color`] 
                          }}
                        >
                          {pair.map((player: UserInterface) => {
                            return (
                              <div className={styles.inputs}>
                                <Typography fontWeight={"bold"}>
                                  {player.name.split(" ")}
                                </Typography>
                                <TextField 
                                  fullWidth
                                  type='number'
                                  style={{ marginTop: '7px' }}
                                  value={values[`p${index + 1}`]}
                                  onChange={handleChange(`p${index + 1}`)}
                                />
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                    <Typography fontSize={"12px"} style={{ color: "#7a7a7a"}}>
                      Nota: Al registrar estos datos se sumara una ronda a la mesa, y se sumaran los valores correspondietes a los usuarios segun el formato del torneo.
                    </Typography>
                  </div>
                </div>

                <div className={styles.buttons}>
                  <Button 
                    disableElevation 
                    variant="contained" 
                    onClick={handleCleanClose} 
                    className={styles.cancelButton} 
                    startIcon={<ArrowBack />}>
                      Atras
                    </Button>
                  <Button 
                    disableElevation 
                    variant="contained" 
                    onClick={() => submitForm()} 
                    className={styles.button} 
                    endIcon={<Check />}>{"Registrar"}</Button>
                </div>
              </Box>
            </Fade>

            )
          }}

        </Formik>
      </Modal>
  )
}

export default UpdateTournamentModal
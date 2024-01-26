import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/CreateTournamentsModal.module.scss';
import {
  ArrowBack,
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
import SwipeableViews from 'react-swipeable-views';
import { Formik } from 'formik';
import { act } from 'react-dom/test-utils';
import { useDispatch, useSelector } from 'react-redux';
import { clearGetUsers, getAllUsers } from '@/redux/reducers/usersList/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFetchingContext from '@/contexts/backendConection/hook';
import { UserInterface } from '@/typesDefs/constants/users/types';
import {
  clearCreateTournamentState,
  createTournament
} from '@/redux/reducers/tournaments/actions';
import { TournamentFormat } from '@/typesDefs/constants/tournaments/types';
import diacriticSensitiveRegex from '@/utils/diacritic-sensitive-regex';

interface ModalProps {
  open: boolean;
  handleClose: () => any;
}

const UserCard = ({
  user,
  selected,
  onClick
}: {
  user: UserInterface;
  selected?: boolean;
  onClick?: (itemId?: UserInterface) => any;
}) => {
  return (
    <div
      className={[
        styles.userCard,
        selected ? styles.userCard__selected : ''
      ].join(' ')}
      onClick={() => (onClick ? onClick(user) : user)}
    >
      <Avatar>
        {user.name.length
          ? `${user.name[0]}${user.name.split(' ')[1][0] ?? ''}`
          : ''}
      </Avatar>
      <Typography
        fontWeight={'700'}
        style={{ marginLeft: '10px' }}
        variant="h6"
        component="h2"
      >
        {user.name}
      </Typography>
    </div>
  );
};

const CreateTournamentsModal: React.FC<ModalProps> = ({
  open,
  handleClose
}) => {
  const steps = [
    'Configuracion del torneo',
    'Selecciona los jugadores',
    'Creando torneo'
  ];
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '7px',
    '@media screen and (max-width: 600px)': {
      width: '90vw'
    }
  };

  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();

  const {
    getUsers: {
      loadingGetUsers: loadingUsersList,
      usersList,
      errorGetUsers: errorUsersList
    }
  } = useAppSelector(({ usersList }) => usersList);

  const {
    createTournament: {
      loadingCreateTournament,
      successCreateTournament,
      errorCreateTournament
    }
  } = useSelector(({ tournaments }) => tournaments);

  interface formState {
    name: string;
    format: TournamentFormat;
    customRounds: number;
    players: string[];
  }

  const formInitialFormState: formState = {
    name: '',
    format: 'individual',
    customRounds: 7,
    players: []
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const [searchUsers, setSearchUsers] = React.useState<UserInterface[]>([]);

  const [selectedUsers, setSelectedUsers] = React.useState<UserInterface[]>([]);

  const handleCleanClose = (resetForm?: any) => {
    setActiveStep(0);
    dispatch(clearCreateTournamentState());
    dispatch(clearGetUsers());
    handleClose();
    if (resetForm) resetForm();
  };

  const handleNextStep = React.useCallback(
    (values: formState, { resetForm }: { resetForm: any }) => {
      if (activeStep === 0) {
        if (values.name) {
          setActiveStep(activeStep + 1);
        }
      }
      if (activeStep == 1) {
        if (
          selectedUsers.length > 0 &&
          selectedUsers.length % 4 === 0 &&
          selectedUsers.length / 4 > 1
        ) {
          setActiveStep(activeStep + 1);
          dispatch(
            createTournament({
              context: fContext,
              name: values.name,
              players: selectedUsers.map((user: UserInterface) => user.id),
              format: values.format,
              customRounds: values.customRounds
            })
          );
        }
      }
      if (activeStep === 2) {
        handleCleanClose(resetForm);
      }
    },
    [activeStep, selectedUsers]
  );

  const handlePreviousStep = React.useCallback(() => {
    setActiveStep(activeStep - 1);
    dispatch(clearGetUsers());
    setSelectedUsers([]);
    setSearchUsers([]);
  }, [activeStep]);

  const selectAll = React.useCallback(() => {
    setSelectedUsers(searchUsers.length ? searchUsers : usersList);
  }, [searchUsers, usersList]);

  React.useEffect(() => {
    if (activeStep === 1) {
      dispatch(
        getAllUsers({
          context: fContext
        })
      );
    }
    if (activeStep !== 1) {
      dispatch(clearGetUsers());
    }
  }, [activeStep]);

  const handleSearchUsersFromList = (e: any) => {
    const { value } = e.target;

    if (value.length > 0) {
      const filtration = [...usersList].filter(({ name, email }) => {
        const valueRegex = new RegExp(diacriticSensitiveRegex(value), 'i');

        return valueRegex.test(name) || valueRegex.test(email);
      });

      setSearchUsers(filtration);
    } else if (value.length === 0) {
      setSearchUsers(usersList);
    }
  };

  const handleClickUser = React.useCallback(
    (itemId?: UserInterface) => {
      if (
        itemId &&
        Boolean(
          selectedUsers.find((user: UserInterface) => user.id === itemId.id)
        )
      ) {
        setSelectedUsers(
          selectedUsers.filter((user: UserInterface) => user.id !== itemId.id)
        );
      } else if (itemId) {
        setSelectedUsers(selectedUsers.concat([itemId]));
      }
    },
    [selectedUsers, setSelectedUsers]
  );

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
          timeout: 500
        }
      }}
    >
      <Formik onSubmit={handleNextStep} initialValues={formInitialFormState}>
        {({ values, handleChange, submitForm, resetForm }) => {
          return (
            <Fade in={open}>
              <Box sx={style}>
                <div className={styles.header}>
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Crear un torneo
                  </Typography>
                </div>
                <div className={styles.body}>
                  <div className={styles.stepperContainer}>
                    <Stepper nonLinear activeStep={activeStep}>
                      {steps.map((label, index) => (
                        <Step key={label} completed={activeStep > index}>
                          <StepButton color="inherit">{label}</StepButton>
                        </Step>
                      ))}
                    </Stepper>
                  </div>
                  <SwipeableViews
                    index={activeStep}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {
                      steps.map((label, index) => {
                        return (
                          <div key={index} className={styles.subContainer}>
                            {activeStep < 2 && (
                              <Typography
                                fontWeight={'700'}
                                className={styles.title}
                                variant="h6"
                                component="h2"
                              >
                                {label}
                              </Typography>
                            )}
                            <Grid container spacing={2}>
                              {index === 0 && (
                                <>
                                  <Grid item xs={12}>
                                    <Grid item xs={8}>
                                      <TextField
                                        label="Nombre del torneo"
                                        fullWidth
                                        value={values.name}
                                        onChange={handleChange('name')}
                                      />
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Grid item xs={4}>
                                      <FormControl>
                                        <FormLabel>Numero de rondas</FormLabel>
                                        <TextField
                                          label="Rondas"
                                          fullWidth
                                          type="number"
                                          size="small"
                                          sx={{ marginTop: '15px' }}
                                          value={values.customRounds}
                                          onChange={handleChange(
                                            'customRounds'
                                          )}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Grid item xs={4}>
                                      <FormControl>
                                        <FormLabel>Formato</FormLabel>
                                        <RadioGroup
                                          defaultValue="domino"
                                          name="radio-buttons-group"
                                          value={values.format}
                                          onChange={handleChange('format')}
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                          }}
                                        >
                                          <FormControlLabel
                                            value="individual"
                                            control={<Radio />}
                                            label="Individual"
                                          />
                                          {/*<FormControlLabel
                                            value="pairs"
                                            control={<Radio />}
                                            label="Parejas"
                                          />
                                          {/* <FormControlLabel value="groups" control={<Radio />} label="Grupos" /> */}
                                        </RadioGroup>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Grid item xs={4}>
                                      <FormControl>
                                        <FormLabel>Juego</FormLabel>
                                        <RadioGroup
                                          defaultValue="domino"
                                          name="radio-buttons-group"
                                        >
                                          <FormControlLabel
                                            value="domino"
                                            control={<Radio />}
                                            label="Domino"
                                          />
                                        </RadioGroup>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                  {/* <Grid item xs={12}>
                                    <Grid item xs={4}>
                                      <FormControl>
                                        <FormLabel>Agrupacion de jugadores por mesa</FormLabel>
                                        <RadioGroup
                                          defaultValue="random"
                                          name="radio-buttons-group"
                                        >
                                          <FormControlLabel value="random" control={<Radio />} label="Aleatoria" />
                                          <FormControlLabel value="selectable" control={<Radio />} label="Seleccionable" />
                                        </RadioGroup>
                                      </FormControl>
                                    </Grid>
                                  </Grid> */}
                                </>
                              )}
                              {index === 1 && (
                                <>
                                  {loadingUsersList && (
                                    <Grid
                                      alignItems={'center'}
                                      justifyItems={'center'}
                                      className={styles.loader}
                                      xs={12}
                                    >
                                      <CircularProgress
                                        size={60}
                                        color="primary"
                                      />
                                      <Typography
                                        fontWeight={'600'}
                                        style={{ marginTop: '10px' }}
                                        variant="h6"
                                        component="h2"
                                      >
                                        Cargando usuarios...
                                      </Typography>
                                    </Grid>
                                  )}
                                  {!loadingUsersList && activeStep === 1 && (
                                    <>
                                      <Grid
                                        className={
                                          styles.selectedUsersResponsive
                                        }
                                        item
                                        sm={12}
                                        md={6}
                                      >
                                        <Typography
                                          fontWeight={'700'}
                                          style={{ marginBottom: 0 }}
                                          className={styles.title}
                                          variant="h6"
                                          component="h2"
                                        >
                                          Jugadores Seleccionados:{' '}
                                          {selectedUsers.length}
                                        </Typography>
                                        <Typography className={styles.subtitle}>
                                          Se generaran{' '}
                                          {selectedUsers.length / 4} mesas.
                                        </Typography>
                                        {selectedUsers.length % 4 !== 0 && (
                                          <Typography
                                            style={{ color: 'red' }}
                                            className={styles.subtitle}
                                          >
                                            No es posible comenzar un torneo con
                                            mesas incompletas.
                                          </Typography>
                                        )}
                                      </Grid>
                                      <Grid
                                        className={styles.usersListInner}
                                        item
                                        sm={12}
                                        md={6}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel htmlFor="outlined-adornment-amount">
                                            Buscar usuarios...
                                          </InputLabel>
                                          <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={
                                              <InputAdornment position="start">
                                                <Search />
                                              </InputAdornment>
                                            }
                                            label="Buscar usuarios..."
                                            onChange={handleSearchUsersFromList}
                                          />
                                        </FormControl>
                                        <div className={styles.usersList}>
                                          <Button
                                            disableElevation
                                            fullWidth
                                            style={{ marginBottom: '10px' }}
                                            variant="contained"
                                            onClick={selectAll}
                                            className={styles.button}
                                          >
                                            Seleccionar todos
                                          </Button>

                                          {(searchUsers.length
                                            ? searchUsers
                                            : usersList
                                          ).map((user: UserInterface) => {
                                            return (
                                              <UserCard
                                                key={user.id}
                                                user={user}
                                                selected={Boolean(
                                                  selectedUsers.find(
                                                    u => u.id === user.id
                                                  )
                                                )}
                                                onClick={handleClickUser}
                                              />
                                            );
                                          })}
                                        </div>
                                      </Grid>
                                      <Grid
                                        className={styles.selectedUsers}
                                        item
                                        sm={12}
                                        md={6}
                                      >
                                        <Typography
                                          fontWeight={'700'}
                                          style={{ marginBottom: 0 }}
                                          className={styles.title}
                                          variant="h6"
                                          component="h2"
                                        >
                                          Jugadores Seleccionados:{' '}
                                          {selectedUsers.length}
                                        </Typography>
                                        <Typography className={styles.subtitle}>
                                          Se generaran{' '}
                                          {selectedUsers.length / 4} mesas.
                                        </Typography>
                                        {selectedUsers.length % 4 !== 0 && (
                                          <Typography
                                            style={{ color: 'red' }}
                                            className={styles.subtitle}
                                          >
                                            No es posible comenzar un torneo con
                                            mesas incompletas.
                                          </Typography>
                                        )}
                                        <div className={styles.usersList}>
                                          {selectedUsers.map(
                                            (user: UserInterface) => {
                                              return (
                                                <UserCard
                                                  key={user.id}
                                                  user={user}
                                                />
                                              );
                                            }
                                          )}
                                        </div>
                                      </Grid>
                                    </>
                                  )}
                                </>
                              )}
                              {index === 2 && (
                                <>
                                  {loadingCreateTournament && (
                                    <Grid
                                      alignItems={'center'}
                                      justifyItems={'center'}
                                      className={styles.loader}
                                      xs={12}
                                    >
                                      <CircularProgress
                                        size={60}
                                        color="primary"
                                      />
                                      <Typography
                                        fontWeight={'600'}
                                        style={{ marginTop: '10px' }}
                                        variant="h6"
                                        component="h2"
                                      >
                                        Creando torneo...
                                      </Typography>
                                    </Grid>
                                  )}
                                  {!loadingCreateTournament &&
                                    successCreateTournament && (
                                      <Grid
                                        alignItems={'center'}
                                        justifyItems={'center'}
                                        className={styles.loader}
                                        xs={12}
                                      >
                                        <CheckCircle
                                          style={{
                                            color: 'green',
                                            fontSize: '60px'
                                          }}
                                        />
                                        <Typography
                                          fontWeight={'600'}
                                          style={{ marginTop: '10px' }}
                                          variant="h6"
                                          component="h2"
                                        >
                                          Torneo creado existosamente!
                                        </Typography>
                                      </Grid>
                                    )}
                                  {!loadingCreateTournament &&
                                    errorCreateTournament && (
                                      <Grid
                                        alignItems={'center'}
                                        justifyItems={'center'}
                                        className={styles.loader}
                                        xs={12}
                                      >
                                        <Close
                                          style={{
                                            color: 'red',
                                            fontSize: '60px'
                                          }}
                                        />
                                        <Typography
                                          fontWeight={'600'}
                                          style={{
                                            marginTop: '10px',
                                            color: 'red'
                                          }}
                                          variant="h6"
                                          component="h2"
                                        >
                                          {errorCreateTournament}
                                        </Typography>
                                      </Grid>
                                    )}
                                </>
                              )}
                            </Grid>
                          </div>
                        );
                      }) as any
                    }
                  </SwipeableViews>
                </div>

                <div className={styles.buttons}>
                  {activeStep === 0 && (
                    <Button
                      disableElevation
                      variant="contained"
                      onClick={() => handleCleanClose(resetForm)}
                      className={styles.cancelButton}
                      endIcon={<Close />}
                    >
                      Cancelar
                    </Button>
                  )}
                  {activeStep === 1 && (
                    <Button
                      disableElevation
                      variant="contained"
                      onClick={handlePreviousStep}
                      className={styles.cancelButton}
                      startIcon={<ArrowBack />}
                    >
                      Atras
                    </Button>
                  )}
                  {activeStep === 2 && errorCreateTournament && (
                    <Button
                      disableElevation
                      variant="contained"
                      onClick={handlePreviousStep}
                      className={styles.cancelButton}
                      startIcon={<ArrowBack />}
                    >
                      Atras
                    </Button>
                  )}
                  <Button
                    disableElevation
                    disabled={loadingCreateTournament || loadingUsersList}
                    variant="contained"
                    onClick={() => submitForm()}
                    className={styles.button}
                    endIcon={
                      activeStep === 2 ? <CheckCircleOutline /> : <Send />
                    }
                  >
                    {activeStep === 2 ? 'Continuar' : 'Siguiente'}
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

export default CreateTournamentsModal;

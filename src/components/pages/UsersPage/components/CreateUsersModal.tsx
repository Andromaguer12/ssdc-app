import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from '../styles/CreateUsersModal.module.scss';
import { CheckCircleOutline, Close, Send } from '@mui/icons-material';
import { Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import useFetchingContext from '@/contexts/backendConection/hook';
import { createUser, updateUser } from '@/redux/reducers/usersList/actions';
import { UserInterface } from '@/typesDefs/constants/users/types';
import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
// import AvatarEditor from 'react-avatar-editor'

interface ModalProps {
  open: boolean;
  editMode?: Partial<UserInterface>;
  handleClose: () => any;
}

const CreateUsersModal: React.FC<ModalProps> = ({
  open,
  editMode,
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
    borderRadius: '7px'
  };

  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const formikRef = React.useRef<any>();

  const {
    createUser: { loadingCreateUser, successCreateUser, errorCreateUser },
    updateUser: { loadingUpdateUser, successUpdateUser, errorUpdateUser }
  } = useAppSelector(({ usersList }) => usersList);

  interface formState {
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    // isAdmin?: boolean;
  }

  const formInitialFormState: formState = {
    name: editMode ? editMode?.name : '',
    email: editMode ? editMode?.email : '',
    phone: editMode ? editMode?.phone : '',
    image: editMode ? editMode?.image : ''
    // isAdmin: editMode ? editMode?.isAdmin : false
  };

  React.useEffect(() => {
    if (successCreateUser || successUpdateUser) {
      handleClose();
      if (formikRef.current) formikRef.current?.resetForm();
    }
  }, [successCreateUser, successUpdateUser]);

  const handleSubmit = React.useCallback(
    (values: formState, { resetForm }: { resetForm: any }) => {
      if (editMode) {
        dispatch(
          updateUser({
            context: fContext,
            id: editMode.id,
            body: { ...values }
          })
        );
      }
      if (!editMode) {
        dispatch(
          createUser({
            context: fContext,
            name: values.name,
            email: values.email,
            phone: values.phone,
            image: values.image,
            isAdmin: false
          })
        );
      }
    },
    [editMode]
  );

  const labels = {
    name: 'Nombre completo',
    email: 'Correo',
    phone: 'Telefono',
    image: 'Foto de perfil'
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => handleClose()}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Formik
        innerRef={formikRef}
        onSubmit={handleSubmit}
        initialValues={formInitialFormState}
      >
        {({ values, handleChange, submitForm, setValues, resetForm }) => {
          return (
            <Fade in={open}>
              <Box sx={style}>
                <div className={styles.header}>
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    {editMode ? 'Editar Usuario' : 'Crear un Usuario'}
                  </Typography>
                </div>
                <div className={styles.body}>
                  {Object.keys(formInitialFormState).map(key => {
                    return (
                      <>
                        {key !== 'image' && key !== 'isAdmin' && (
                          <TextField
                            key={key}
                            id={key}
                            label={labels[key as keyof typeof labels]}
                            variant="outlined"
                            value={values[key as keyof typeof values] ?? ''}
                            className={styles.inputs}
                            onChange={handleChange(key)}
                          />
                        )}
                        {/* {key === 'isAdmin' && (
                          <FormGroup
                            style={{ marginTop: '15px', marginLeft: '10px' }}
                          >
                            <FormControlLabel
                              control={
                                <Switch
                                  onChange={() => {
                                    setValues({
                                      ...values,
                                      [key as keyof typeof values]: !values[key]
                                    });
                                  }}
                                  checked={values[key]}
                                />
                              }
                              label="Es Admin"
                            />
                          </FormGroup>
                        )} */}
                        {/* {key === "image" && (
                        <AvatarEditor
                          image="http://example.com/initialimage.jpg"
                          width={250}
                          height={250}
                          border={50}
                          color={[255, 255, 255, 0.6]} // RGBA
                          scale={1.2}
                          rotate={0}
                        />
                      )} */}
                      </>
                    );
                  })}
                </div>

                <div className={styles.buttons}>
                  <Button
                    disableElevation
                    variant="contained"
                    onClick={() => handleClose()}
                    className={styles.cancelButton}
                    endIcon={<Close />}
                  >
                    Cancelar
                  </Button>
                  <Button
                    disableElevation
                    disabled={loadingCreateUser || loadingUpdateUser}
                    variant="contained"
                    onClick={() => submitForm()}
                    className={styles.button}
                    endIcon={<Send />}
                  >
                    {editMode
                      ? loadingUpdateUser
                        ? 'Actualizando'
                        : errorUpdateUser
                          ? 'Error Actualizando'
                          : 'Actualizar Usuario'
                      : loadingCreateUser
                        ? 'Creando'
                        : errorCreateUser
                          ? 'Error creando'
                          : 'Crear Usuario'}
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

export default CreateUsersModal;

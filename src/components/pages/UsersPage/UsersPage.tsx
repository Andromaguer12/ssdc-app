'use client';
import styles from './styles/UsersPage.module.scss';
import { Button, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { EmojiEvents, Person, Warning } from '@mui/icons-material';
import CreateUsersModal from './components/CreateUsersModal';
import { useCallback, useEffect, useState } from 'react';
import {
  clearGetUsers,
  deleteUser,
  getAllUsers
} from '@/redux/reducers/usersList/actions';
import useFetchingContext from '@/contexts/backendConection/hook';
import ReactTable from '@/components/ReactTable/ReactTable';
import { usersColumns } from './constants/usersColumns';
import { usersMapper } from './constants/mapper';
import AcceptModal from '@/components/AcceptModal/AcceptModal';
import { UserInterface } from '@/typesDefs/constants/users/types';

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const fContext = useFetchingContext();
  const [openModal, setOpenModal] = useState(false);
  const {
    getUsers: { loadingGetUsers, successGetUsers, usersList, errorGetUsers },
    createUser: { successCreateUser },
    updateUser: { successUpdateUser },
    deleteUser: { loadingDeleteUser, successDeleteUser, errorDeleteUser }
  } = useAppSelector(({ usersList }) => usersList);
  const [DeleteUser, setDeleteUser] = useState('');
  const [updateModal, setUpdateModal] = useState<Partial<UserInterface> | null>(
    null
  );

  const [allUsers, setAllUsers] = useState([]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setUpdateModal(null);
  };

  const handleDeleteModal = (id: string) => {
    setDeleteUser(id);
  };

  const handleUpdateModal = (user: UserInterface) => {
    setUpdateModal(user);
  };

  useEffect(() => {
    if (successGetUsers && usersList) {
      const mappedData = usersMapper(
        usersList,
        handleUpdateModal,
        handleDeleteModal
      );

      setAllUsers(mappedData);
    }
  }, [successGetUsers, usersList]);

  useEffect(() => {
    dispatch(
      getAllUsers({
        context: fContext
      })
    );
  }, []);

  useEffect(() => {
    if (successCreateUser || successUpdateUser || successDeleteUser) {
      dispatch(
        getAllUsers({
          context: fContext
        })
      );
      setDeleteUser('');
    }
  }, [successCreateUser, successUpdateUser, successDeleteUser]);

  useEffect(() => {
    return () => {
      dispatch(clearGetUsers());
    };
  }, []);

  const acceptAction = useCallback(() => {
    if (DeleteUser) {
      dispatch(
        deleteUser({
          context: fContext,
          id: DeleteUser
        })
      );
    }
  }, [DeleteUser]);

  return (
    <section className={styles.pageContainer}>
      <Typography sx={{ marginBottom: '20px', color: '#fff' }} variant="h3">
        Administracion de usuarios
      </Typography>
      <div className={styles.tounamentsContainer}>
        <div className={styles.listHeader}>
          <Typography variant="h5">Lista de Usuarios</Typography>
          <span className={styles.UsersPageRegisterUser}>
            <Button
              onClick={handleOpenModal}
              variant="contained"
              endIcon={<Person />}
            >
              Nuevo Usuario
            </Button>
          </span>
        </div>
        <div className={styles.listBody}>
          {loadingGetUsers ? (
            <div className={styles.loading}>
              <CircularProgress color="primary" size={50} />
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                Cargando usuarios...
              </Typography>
            </div>
          ) : allUsers.length > 0 ? (
            <ReactTable columns={usersColumns} data={allUsers} />
          ) : (
            <div className={styles.loading}>
              <Warning style={{ color: '#7a7a7a', fontSize: 50 }} />
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                No hay usuarios registrados...
              </Typography>
            </div>
          )}
        </div>
      </div>
      <CreateUsersModal
        open={openModal || Boolean(updateModal)}
        handleClose={handleCloseModal}
        editMode={updateModal as Partial<UserInterface>}
      />
      <AcceptModal
        acceptAction={acceptAction}
        handleClose={() => setDeleteUser('')}
        open={Boolean(DeleteUser)}
        loading={loadingDeleteUser}
        error={errorDeleteUser}
        text="Estas seguro de eliminar este usuario?"
        title="Advertencia"
      />
    </section>
  );
};

export default UsersPage;

import { Avatar, IconButton, Typography } from '@mui/material';
import { Delete, Edit, RemoveRedEye } from '@mui/icons-material';
import Link from 'next/link';
import { UserInterface } from '@/typesDefs/constants/users/types';
import styles from '../styles/UsersPage.module.scss';

export const usersMapper = (
  data: any,
  handleUpdateModal: any,
  handleDeleteModal: any
) => {
  return data.map((row: UserInterface) => {
    return {
      name: (
        <div className={styles.commonCell}>
          <Avatar src={row?.image} />
          <Typography className={styles.name}>{row?.name}</Typography>
        </div>
      ),
      email: <>{row?.email}</>,
      phone: <>{row?.phone}</>,

      actions: (
        <>
          <IconButton onClick={() => handleUpdateModal(row)}>
            <Edit style={{ color: 'green' }} />
          </IconButton>

          <IconButton onClick={() => handleDeleteModal(row?.id ?? '')}>
            <Delete style={{ color: 'red' }} />
          </IconButton>
        </>
      )
    };
  });
};

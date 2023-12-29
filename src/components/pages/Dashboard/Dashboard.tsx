"use client"
import UserList from "@/components/pages/Dashboard/components/UserList/UserList"
import styles from './Dashboard.module.scss';
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getUsersList } from "@/redux/reducers/usersList/actions";
import useFirebaseContext from "@/contexts/firebaseConnection/hook";

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const fbContext = useFirebaseContext();

  const [form, setForm] = useState(false);

  useEffect(() => {
    dispatch(getUsersList({
        context: fbContext,
    }))
  }, [])

  return (
    <section className={styles.Dashboard}>
      <Typography sx={{ marginBottom: '20px', color: '#fff'}} variant="h3">Panel Principal</Typography>
      <div className={styles.DashboardUserList}>
        <div className={styles.DashboardUserListDiv}>
          <Typography variant="h5">Lista de usuarios</Typography>
          <span className={styles.DashboardRegisterUser} onClick={() => setForm(true)}><Typography variant="button">Registrar usuario</Typography></span>
        </div>
        <UserList />
      </div>
      {form && <Modal setModal={() => setForm(false)} format="user"/>}
    </section>
  )
}

export default Dashboard
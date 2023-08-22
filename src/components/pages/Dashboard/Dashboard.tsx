import UserList from "@/components/UserList/UserList"
import styles from './Dashboard.module.scss';
import { Typography } from "@mui/material";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";

const Dashboard = () => {
  const [form, setForm] = useState(false);

  return (
    <section className={styles.Dashboard}>
      <Typography variant="h3">Panel Administrativo</Typography>
      <div className={styles.DashboardUserList}>
        <Typography variant="h5">Lista de usuarios</Typography>
        <span className={styles.DashboardRegisterUser} onClick={() => setForm(true)}><Typography variant="button">Registrar usuario</Typography></span>
        <UserList />
      </div>
      {form && <Modal setModal={() => setForm(false)} data={null} />}
    </section>
  )
}

export default Dashboard
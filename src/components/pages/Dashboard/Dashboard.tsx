import UserList from "@/components/UserList/UserList"
import Link from "next/link"
import styles from './Dashboard.module.scss';
import { Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <section className={styles.Dashboard}>
      <Typography variant="h3">Panel Administrativo</Typography>
      <div className={styles.DashboardUserList}>
        <Typography variant="h5">Lista de usuarios</Typography>
        <Link href='/admin/dashboard/newUser'>Registrar usuario</Link>
        <UserList />
      </div>

    </section>
  )
}

export default Dashboard
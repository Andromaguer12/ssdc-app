import React from 'react'
import style from './Modal.module.scss'
import ClearIcon from '@mui/icons-material/Clear';
import UserForm from '../UserForm/UserForm';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';

const Modal = ({ setModal, data, format }:
  { setModal: (boolean: boolean) => void, data: UserReducerInitialState | null, format: "tournament" | "user" }) => {
  return (
    <div className={style.Modal}>
      <section onSubmit={() => setModal(false)}>
        <ClearIcon onClick={() => setModal(false)} className={style.ModalCloseICon} />
        {format === "user"
          ? <UserForm data={data} eventSubmit={data ? "Update" : "Create"} />
          : <p>TournamentForm</p>}
      </section>
    </div>
  )
}

export default Modal
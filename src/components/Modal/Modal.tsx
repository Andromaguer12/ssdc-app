import React from 'react'
import style from './Modal.module.scss'
import ClearIcon from '@mui/icons-material/Clear';
import UserForm from './components/UserForm/UserForm';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';

const Modal = ({ setModal, userData, format, matchesData, tournamentId, handleReloadData, standingIndex }:
  {
    setModal: (boolean: boolean) => void,
    userData?: UserReducerInitialState,
    matchesData?: TablePlayers[][],
    format: "tournament" | "user" | "matches" | "sanction",
    tournamentId?: string,
    standingIndex?: number,
    handleReloadData?: () => any
  }
) => {

  switch (format) {
    case "user":
      return (
        <div className={style.Modal}>
          <section onSubmit={() => setModal(false)}>
            <ClearIcon onClick={() => setModal(false)} className={style.ModalCloseICon} />
            <UserForm data={userData} eventSubmit={userData ? "Update" : "Create"} />
          </section>
        </div>
      )
  }

}

export default Modal
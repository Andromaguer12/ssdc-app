import React from 'react'
import style from './Modal.module.scss'
import ClearIcon from '@mui/icons-material/Clear';
import UserForm from '../UserForm/UserForm';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';
import { TournamentForm } from '../TournamentForm/TournamentForm';
import { TablePlayers } from '@/typesDefs/constants/tournaments/types';
import { MatchesForm } from '../MatchesForm/MatchesForm';

const Modal = ({ setModal, userData, format, matchesData }:
  {
    setModal: (boolean: boolean) => void,
    userData?: UserReducerInitialState,
    matchesData?: TablePlayers[][],
    format: "tournament" | "user" | "matches"
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
    case "tournament":
      return (
        <div className={style.Modal}>
          <section onSubmit={() => setModal(false)}>
            <ClearIcon onClick={() => setModal(false)} className={style.ModalCloseICon} />
            <TournamentForm />
          </section>
        </div>
      )
    case "matches":
      return (
        <div className={style.Modal}>
          <section onSubmit={() => setModal(false)}>
            <ClearIcon onClick={() => setModal(false)} className={style.ModalCloseICon} />
            {matchesData && <MatchesForm data={matchesData}/>}
          </section>
        </div>
      )
  }

}

export default Modal
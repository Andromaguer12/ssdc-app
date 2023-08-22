import React from 'react'
import style from './Modal.module.scss'
import ClearIcon from '@mui/icons-material/Clear';
import UserForm from '../UserForm/UserForm';
import { UserReducerInitialState } from '@/redux/reducers/user/actions';

const Modal = ({ setModal, data }: { setModal: (boolean: boolean) => void, data: UserReducerInitialState | null }) => {
  return (
    <div className={style.Modal}>
      <section onSubmit={() => setModal(false)}>
        <ClearIcon onClick={() => setModal(false)} />
        <UserForm data={data} eventSubmit='Create' />
      </section>
    </div>
  )
}

export default Modal
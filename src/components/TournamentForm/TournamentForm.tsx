"use client"
import useFirebaseContext from '@/contexts/firebaseConnection/hook';
import { tournamentCreateFunction } from '@/redux/reducers/tournament/actions';
import { getUsersList } from '@/redux/reducers/usersList/actions';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { TablePlayers, TournamentInterface } from '@/typesDefs/constants/tournaments/types';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState, useCallback } from 'react'
import CustomizedAlert from '../CustomizedAlert/CustomizedAlert';

import style from "./TournamentForm.module.scss";
import { emptyTournamentinitialState } from '@/typesDefs/constants/tournaments/emptyTournamentInitialState';

const TournamentForm = () => {

  const fbContext = useFirebaseContext();
  const userList = useAppSelector(state => state.usersList.data);
  const dispatch = useAppDispatch();
  const [error, setError] = useState("");

  //Select config
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };



  const fecha = new Date();
  const startDate = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
  // Estado para los datos del formulario
  const [usersName, setUsersName] = useState<string[]>([]);
  const [formData, setFormData] = useState<TournamentInterface>(emptyTournamentinitialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleSelectChange = (id: string) => {
    if(usersName.includes(id)){
      setUsersName(usersName.filter(d => d !== id))
    } else {
      setUsersName(usersName.concat([id]))
    }
  };
  const handleCheckAll = () => {
    setUsersName(userList.map(u => u.id))
  };
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('entro aqui')
    if((!formData.name || usersName.length < 20 || !(usersName.length % 4 === 0))) {
      if(!(usersName.length % 4 === 0) || usersName.length < 20) {
        setError(`El torneo debe tener al menos 20 integrantes y de numero de integrantes debe ser multiplo de 4, es decir que el torneo no puede ser de ${usersName.length} integrantes`)
      }
      if(!formData.name) {
        setError('Rellena todos los campos por favor')
      }

      return;
    }

    setError("");
    console.log(formData)
    // dispatch(tournamentCreateFunction({
    //   context: fbContext,
    //   tournamentData: formData
    // }));
  }, [formData, usersName])
  

  useEffect(() => {
    dispatch(getUsersList({
      context: fbContext,
    })).then(() => "setLoading(false)");
  }, [userList]);

  useEffect(() => {
    const usersToAdd = usersName.map(name => {
      const list = userList.filter(user => user.name === name)
      const user = list[0];
      return user;
    });
    const tableToAdd: TablePlayers[] = usersToAdd.map((user, index) => ({
      team: [user],
      won: 0,
      form: [],
      draw: 0,
      lost: 0,
      points: 0,
      difference: 0,
      position: index + 1,
      playedRounds: 0,
      sanction: null
    }))

    setFormData(prev => ({
      ...prev,
      table: [{
        results: [],
        standings: tableToAdd
      }]
    }))
  }, [usersName]);


  return (
    <form onSubmit={handleSubmit} className={style.TournamentForm}>
      <Typography variant="h4" className={style.title}>
        Crear Torneo
      </Typography>
      <Typography variant="h6" className={style.subtitle}>
        Necesitaremos ciertos datos para comenzar el torneo
      </Typography>
      <div className={style.header}>
        <TextField
          label="Nombre del torneo"
          name="name"
          type="text"
          margin="normal"
          color='primary'
          value={formData.name}
          onChange={handleChange}
          className={style.name}
        />
        <FormControl className={style.formGroup} >
          <FormLabel>Formato</FormLabel>
          <RadioGroup
            defaultValue="individual"
            name="format"
            row
            value={formData.format}
            onChange={handleChange}
          >
            <FormControlLabel value="individual" control={<Radio />} label="Individual" />
            <FormControlLabel value="pairs" control={<Radio />} label="Parejas" />
            <FormControlLabel value="team" control={<Radio />} label="Equipos" />
          </RadioGroup>
        </FormControl>
      </div>
      <FormControl fullWidth sx={{ marginBottom: '10px' }} >
        <FormLabel>Juego</FormLabel>
        <RadioGroup
          defaultValue="Domino"
          name="game"
          row
          value={formData.game}
          onChange={handleChange}
        >
          {/* <FormControlLabel value="ajedrez" control={<Radio />} label="Ajedrez" /> */}
          <FormControlLabel value="domino" control={<Radio />} label="Domino" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth>
        <FormLabel>Jugadores seleccionados {usersName.length}</FormLabel>
      </FormControl>
      <FormGroup sx={{ width: '100%' }}>
        <FormControlLabel control={<Checkbox onClick={handleCheckAll} checked={usersName.length === userList.length} />} label="Seleccionar todos" />
      </FormGroup>
      <div className={style.usersListRow}>
        {userList.map((user, index) => (
          <div key={index} className={style.userCard} onClick={() => handleSelectChange(user.id)}>
            <Typography>
              {user.name}
            </Typography>
            <Checkbox checked={usersName.includes(user.id)} />
          </div>
        ))}
      </div>
      {/* <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Jugadores</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={usersName}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Jugadores" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          <MenuItem value={usersName.map(name => name)}>
            <Checkbox checked={usersName.length === userList.length} />
            <ListItemText primary={"Todos"} />
          </MenuItem>
          {userList.map((user, index) => (
            <MenuItem key={index} value={user.name}>
              <Checkbox checked={usersName.indexOf(user.name) > -1} />
              <ListItemText primary={user.name} />
            </MenuItem>
          ))}
        </Select>
        <p>Jugadores: {usersName.length}</p>
      </FormControl> */}
      {/* Validacion de datos del formulario*/}
      {error && <CustomizedAlert noElevation type='error' message={error} />}
      <Button fullWidth disableElevation variant="contained" color="primary" type="submit" className={style.TournamentFormButton}>
          Enviar
      </Button>
      
    </form>
  )
}

export { TournamentForm }
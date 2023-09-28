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
  FormLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomizedAlert from '../CustomizedAlert/CustomizedAlert';

import style from "./TournamentForm.module.scss";

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
  const [formData, setFormData] = useState<TournamentInterface>({
    name: "",
    rules: "",
    format: "individual",
    startDate: startDate,
    endDate: "",
    currentRound: 1,
    winner: null,
    table: [{
      team: [],
      points: 0,
      position: 0,
      playedRounds: 0,
      draw: 0,
      won: 0,
      lost: 0,
      form: []
    }],
    game: "Ajedrez"
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleSelectChange = (event: SelectChangeEvent<typeof usersName>) => {
    const { value } = event.target;
    setUsersName((prev => (prev === value ? [''] : typeof value === 'string' ? value.split(',') : value))
    );
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    dispatch(tournamentCreateFunction({
      context: fbContext,
      tournamentData: formData
    }));
    console.log("submit");
  }

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
      position: index + 1,
      playedRounds: 0
    }))

    setFormData(prev => ({
      ...prev,
      table: tableToAdd
    }))
  }, [usersName]);


  return (
    <form onSubmit={handleSubmit} className={style.TournamentForm}>
      <TextField
        label="Nombre del torneo"
        name="name"
        type="text"
        fullWidth
        margin="normal"
        color='secondary'
        value={formData.name}
        onChange={handleChange}
      />
      <FormControl fullWidth={true} >
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
      <FormControl fullWidth={true} >
        <FormLabel>Juego</FormLabel>
        <RadioGroup
          defaultValue="Ajedrez"
          name="game"
          row
          value={formData.game}
          onChange={handleChange}
        >
          <FormControlLabel value="ajedrez" control={<Radio />} label="Ajedrez" />
          <FormControlLabel value="domino" control={<Radio />} label="Domino" />
        </RadioGroup>
      </FormControl>
      <FormControl sx={{ m: 1, width: 300 }}>
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
      </FormControl>
      {/* Validacion de datos del formulario*/}
      {(!formData.name || usersName.length < 20)
        ? <Button fullWidth disableElevation variant="contained" color="primary" type="button"
          onClick={() => setError(formData.name
            ? "El torneo debe tener al menos 20 integrantes"
            : "Por favor, rellena todos los campos")}
          className={style.TournamentFormButton}>
          Enviar
        </Button>
        : <Button fullWidth disableElevation variant="contained" color="primary" type="submit"
          className={style.TournamentFormButton}>
          Enviar
        </Button>
      }
      {error && <CustomizedAlert noElevation type='error' message={error} />}
    </form>
  )
}

export { TournamentForm }
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentProps } from 'react';
import { Grid } from '@mui/material';
import styles from './styles/LoginAndRegisterLayout.module.scss';

export default function LoginAndRegisterLayout({
  children,
}: ComponentProps<any>) {
  return (
    <>
      <Grid container className={styles.layout}>
        <Grid item xs={12}>{children}</Grid>
      </Grid>
    </>
  );
}

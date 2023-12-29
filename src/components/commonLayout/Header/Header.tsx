import { Language } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';
import { HeaderButtons } from '../../../constants/components/commonLayout/Header/header';
import { Menu } from '@/components/commonLayout/Menu/Menu';

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.delimeter}>
        <Menu />
        <div className={styles.buttons}>
          {HeaderButtons.map(button => {
            return (
              <Link
                key={button.id}
                className={styles.headerButton}
                href={"button.link"}
              >
                Buttons
              </Link>
            );
          })}
          <IconButton className={styles.iconButtons}>
            <Language sx={{ color: '#ffffff' }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

import { Language } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';
import { HeaderButtons } from '../../../constants/components/commonLayout/Header/header';
import { Menu } from '@/components/Menu/Menu';

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <section className={styles.delimeter}>
        <div className={styles.logoAndMenu}>
          <Menu />
          <div className={styles.image}></div>
        </div>
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
            <Language style={{ color: '#003994' }} />
          </IconButton>
        </div>
      </section>
    </header>
  );
}

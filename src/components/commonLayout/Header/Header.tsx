import { Language } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { HeaderButtons } from '../../../constants/components/commonLayout/Header/header';

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.delimeter}>
        <div className={styles.logoAndSearch}>
          <div className={styles.image}></div>
        </div>
        <div className={styles.buttons}>
          {HeaderButtons.map(button => {
            return (
              <Link
                key={button.id}
                className={styles.headerButton}
                href={button.link}
              >
                'AKSHJGDHJKASD'
              </Link>
            );
          })}
          <IconButton className={styles.iconButtons}>
            <Language style={{ color: '#fff' }} />
          </IconButton>
          <IconButton>
            <LinkedInIcon style={{ color: '#fff' }} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

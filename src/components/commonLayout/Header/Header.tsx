import { Language, MenuBook } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';
import { HeaderButtons } from '../../../constants/components/commonLayout/Header/header';
import { Menu } from '@/components/commonLayout/Menu/Menu';
import Image from 'next/image';
import logo3 from '../../../assets/pages/home/logo3.png';

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.delimeter}>
        <Menu />
        <Image src={logo3} alt="logoHorizontal" className={styles.image} />
        <div><MenuBook style={{ color: "transparent"}} /></div>
      </div>
    </div>
  );
}

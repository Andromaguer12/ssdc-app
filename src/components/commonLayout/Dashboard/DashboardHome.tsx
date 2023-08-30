/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentProps } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './DashboardHome.module.scss';

export default function DashboardHome({
  children,
  showHeader,
  showFooter
}: ComponentProps<any>) {
  return (
    <>
      <div className={styles.dashboard}>
        {showHeader && <Header />}
        <div className={styles.dashboardComponent}>{children}</div>
      </div>
      {showFooter && <Footer />}
    </>
  );
}

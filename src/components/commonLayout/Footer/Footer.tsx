import { KeyboardDoubleArrowUpOutlined } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FooterSections } from '../../../constants/components/commonLayout/Footer/footer';
import styles from './styles/Footer.module.scss';
import {
  AlternateEmailOutlined,
  LocalPhoneOutlined,
  LocationOnOutlined
} from '@mui/icons-material';
import { FooterIcons } from '../../../typesDefs/components/commonLayout/Footer/enums';
import { styles as sxStyles } from './styles/sxStyles';

const FooterItemsIcons = {
  [FooterIcons.Address]: <LocationOnOutlined sx={sxStyles.icons} />,
  [FooterIcons.Phone]: <LocalPhoneOutlined sx={sxStyles.icons} />,
  [FooterIcons.Email]: <AlternateEmailOutlined sx={sxStyles.icons} />
};

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {/* TODO: add the functionality to scroll to top */}
        <div className={styles.button}>
          <KeyboardDoubleArrowUpOutlined
            style={{ fontSize: '30px' }}
            color="primary"
          />
          <p>TEXTO</p>
        </div>
      </div>
      <div className={styles.delimeter}>
        {FooterSections.map((section, i) => {
          return (
            <React.Fragment key={i}>
              <div className={styles.containers}>
                {section.showLogo && (
                  <div className={styles.logoIconFooter}></div>
                )}
                {/* TODO: add the app logo in black scheme */}
                {section?.image && (
                  <Image
                    src={section?.image as string}
                    width={50}
                    height={30}
                    alt={section.name as string}
                  />
                )}
                <div className={styles.thisHeaders}>
                  {section.title && (
                    <p className={styles.title}>{''}</p>
                  )}
                  {section.text && (
                    <p className={styles.text}>{''}</p>
                  )}
                </div>
                {section?.itemsList && (
                  <div className={styles.thisHeaders}>
                    {section?.itemsList?.map((item) => (
                      <Link
                        className={
                          item.icon
                            ? styles.listItems__noBold
                            : styles.listItems
                        }
                        href={item.link}
                        key={item.id}
                      >
                        {item.icon && <>{FooterItemsIcons[item.icon]}</>}
                        <p>
                          {!item.icon ? '• ' : ''}
                          {item.noTranslate ? item.name :''}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div className={styles.bottom}>
        <div className={styles.delimiter}>
          <p>'ASDGAHJSD</p>
        </div>
      </div>
    </div>
  );
}

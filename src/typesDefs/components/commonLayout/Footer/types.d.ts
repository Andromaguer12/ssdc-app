import { HeaderButtonsType } from '../Header/types';

export type FooterLinkItem = {
  link: string;
  name: string;
};

export interface FooterSectionsInterface {
  name: string;
  title?: string;
  text?: string;
  itemsList?: HeaderButtonsType[];
  image?: string;
  showLogo?: boolean;
}

import { FooterIcons } from '../../../../typesDefs/components/commonLayout/Footer/enums';
import { FooterSectionsInterface } from '../../../../typesDefs/components/commonLayout/Footer/types';
import { HeaderButtons } from '../Header/header';

export const FooterSections: Partial<FooterSectionsInterface>[] = [
  {
    name: 'main',
    showLogo: true,
    itemsList: [
      {
        id: 'address',
        name: 'Mérida, Venezuela',
        link: '/',
        icon: FooterIcons.Address,
        noTranslate: true
      },
      {
        id: 'phone',
        name: '+58 (416) 674-9068',
        link: '/',
        icon: FooterIcons.Phone,
        noTranslate: true
      },
      {
        id: 'email',
        name: 'contact@it-tech.dev',
        link: '/',
        icon: FooterIcons.Email,
        noTranslate: true
      }
    ]
  },
  {
    name: 'navigation',
    title: 'pages.commonLayout.footer.navigation',
    text: 'pages.commonLayout.footer.navigationText',
    itemsList: HeaderButtons
  },
  // TODO: add more content to this sections
  {
    name: 'portfolios',
    title: 'pages.commonLayout.footer.portfolios',
    text: 'pages.commonLayout.footer.portfoliosText'
  },
  { name: 'contact', title: 'pages.commonLayout.footer.socials' }
];

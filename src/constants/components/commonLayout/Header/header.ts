import { HeaderButtonsType } from '../../../../typesDefs/components/commonLayout/Header/types';
import { AllRoutes } from '../../../routes/routes';

export const HeaderButtons: HeaderButtonsType[] = [
  {
    id: 'about-us',
    link: AllRoutes.ABOUTUS,
    name: 'pages.header.about-us'
  },
  {
    id: 'my-skills',
    link: AllRoutes.SKILLS,
    name: 'pages.header.skills'
  },
  {
    id: 'blog',
    link: AllRoutes.BLOG,
    name: 'pages.header.blog'
  },
  {
    id: 'work-team-section',
    link: AllRoutes.WORK_TEAM,
    name: 'pages.header.work-team'
  },
  {
    id: 'contact-section',
    link: AllRoutes.CONTACT,
    name: 'pages.header.contact'
  }
];

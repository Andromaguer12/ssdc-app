import { ProjectDevTimes, ProjectTypes } from './about-us.enums';

export interface AboutMeCardImage {
  _id: string;
  link: string;
  name: string;
}

export interface AboutMeCard {
  _id: string;
  title: string;
  aproxDate?: number;
  devTime?: ProjectDevTimes;
  projectType: ProjectTypes;
  description?: string;
  icon: string;
  images?: AboutMeCardImage[];
  showInAboutUs?: boolean;
}

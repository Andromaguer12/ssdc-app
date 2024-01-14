import { RoutesClassification } from '../../typesDefs/constants/routes/types';

export const AllRoutes = {
  ADMIN_LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard/',
  HOME: '/'
};

export const AppRoutes: RoutesClassification = {
  PRIVATE: {
    ADMIN_DASHBOARD: {
      path: AllRoutes.ADMIN_DASHBOARD,
      exact: false
    }
  },
  PUBLIC: {
    HOME: {
      path: AllRoutes.HOME,
      exact: false
    },
    ADMIN: {
      path: AllRoutes.ADMIN_LOGIN,
      exact: true
    }
  }
};

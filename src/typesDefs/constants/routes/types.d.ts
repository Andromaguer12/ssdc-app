export type RouteDeclaration = {
  path: string;
  exact: boolean;
};

export type AppRoutesObject = {
  ADMIN: string;
  HOME: string;
  ABOUTME: string;
};

export type RoutesClassification = {
  PRIVATE: {
    ADMIN_DASHBOARD: RouteDeclaration;
  };
  PUBLIC: {
    HOME: RouteDeclaration;
    ADMIN: RouteDeclaration;
  };
};

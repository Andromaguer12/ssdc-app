export const isEnvironmentDev = (): boolean => {
  const env = process.env.NODE_ENV;
  let isDev = true;
  if (env == 'production') {
    isDev = false;
  }
  return isDev;
};

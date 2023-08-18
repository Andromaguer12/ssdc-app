import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type CustomizedAlertProps = {
  type: string;
  message: string;
  noElevation: boolean;
};

const CustomizedAlert = ({
  type = 'info',
  message,
  noElevation
}: CustomizedAlertProps) => {
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
      return (
        <MuiAlert
          elevation={noElevation ? 0 : 6}
          sx={{ width: '100%', boxSizing: 'border-box' }}
          ref={ref}
          variant="filled"
          {...props}
        />
      );
    }
  );

  return (
    <>
      {type === 'error' && <Alert severity="error">{message}</Alert>}
      {type === 'warning' && <Alert severity="warning">{message}</Alert>}
      {type === 'info' && <Alert severity="info">{message}</Alert>}
      {type === 'success' && <Alert severity="success">{message}</Alert>}
    </>
  );
};

export default CustomizedAlert;

import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './styles/AcceptModal.module.scss';
import { CheckCircleOutline, Close, Send } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

interface ModalProps {
  open: boolean;
  handleClose: () => any;
  acceptAction: () => any;
  text: string;
  title: string;
  error: string;
  loading: boolean;
}

const AcceptModal: React.FC<ModalProps> = ({
  open,
  handleClose,
  acceptAction,
  text,
  title,
  loading
}) => {
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '7px'
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <div className={styles.header}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {title}
            </Typography>
          </div>
          <div className={styles.body}>
            <Typography variant="h6" sx={{ m: 3 }}>
              {text}
            </Typography>
          </div>

          <div className={styles.buttons}>
            <Button
              disableElevation
              variant="contained"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button
              disableElevation
              variant="contained"
              onClick={acceptAction}
              className={styles.button}
            >
              {loading ? (
                <CircularProgress size={'15px'} color="secondary" />
              ) : (
                'Aceptar'
              )}
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AcceptModal;

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type SnackedBackType = {
    error: null | string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({error} : SnackedBackType) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    error ? setOpen(true) : setOpen(false)  
  }, [error])
console.log(error);

  /* const handleClick = () => {
    setOpen(true);
  }; */

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'left' }} open={open} autoHideDuration={6000} onClose={handleClose} 
>
        <Alert onClose={handleClose} severity={`${error ? 'error' : 'success'}`} sx={{ width: '100%' }}>
        {error ? error : 'This is a success message!'}
        </Alert>
      </Snackbar>{/* 
      <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
    </Stack>
  );
}
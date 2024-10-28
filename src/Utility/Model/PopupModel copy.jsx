import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from 'react';
import AuthContext from '../../Component/context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import api from '../../Component/context/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',

  boxShadow: 24,
  p: 4,
};

export default function PopupModel(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { logoutUser } = useContext(AuthContext);

  return (
    <div>
      <span onClick={handleOpen}>
        Sign out
      </span>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
          {props.title}
          </Typography>
          <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }} onClick={handleClose}>
            <button className="btn btn-danger" onClick={logoutUser} >Log out</button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
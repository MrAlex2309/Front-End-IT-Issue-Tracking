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
  let navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const {authToken} = useContext(AuthContext)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const DeleteHandler = async() => {
   
    const response = await api.delete(`/api/files/${props.id}`)
    if(response.status === 200 || response.status === 204){
      props.getData()
    }
    if(response.status === 403){
      window.alert("You are now alow to delete this Report")
    }
  }

  return (
    <div>
      <Button onClick={handleOpen}>
        <DeleteIcon />
      </Button>
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
            <button className="btn btn-danger" onClick={DeleteHandler} >Delete</button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
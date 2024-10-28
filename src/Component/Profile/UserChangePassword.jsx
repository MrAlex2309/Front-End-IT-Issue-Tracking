import React from "react";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import "./UserProfile.css";
import api from "../context/api";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  faCircleCheck,
  faTriangleExclamation,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
function UserChangePassword() {
  const { userInfo } = useContext(AuthContext);
  const [msg, setMsg] = useState();
  const [current, setCurrent] = useState();
  const [first, setFirst] = useState();
  const [seco, setSeco] = useState();
  const [suc, setSuc] = useState(false);
  const id = userInfo.id;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [opens, setOpens] = React.useState(false);
  const handleCloses = () => {
    setOpens(false);
  };
  const handleOpens = () => {
    setOpens(true);
  };  const SubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await api.put(`/api/users/${id}/change_password/`, {
        old_password: current,
        password: first,
        password2: seco,
      });
      handleCloses()
      setSuc(true);
    } catch (err) {
      handleCloses()
      handleOpen();
      if (err.response.data.old_password) {
        setMsg(err.response.data.old_password.old_password);
      }
      if (err.response.data.password) {
        setMsg(err.response.data.password[0]);
      }
    }
  };
  return (
    <div >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={opens}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {suc && (
        <div
        className="d-flex justify-content-between"
          style={{
            backgroundColor: "#A8FFA2",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <div>
          <FontAwesomeIcon color="green" icon={faCircleCheck} /> Password Change
          successfully.
          </div>
          
          <div style={{cursor:'pointer'}} onClick={()=>{setSuc(false)}}>
            <FontAwesomeIcon icon={faXmark}/>
          </div>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="child-modal-title"> <FontAwesomeIcon color="red" icon={faTriangleExclamation}/> Error!!</h2>
          <p id="child-modal-description">{msg}.</p>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
      <div className="container-fluid mt-3">
        <form onSubmit={SubmitHandler} >
          <h4>Change Password</h4>
          <label className="form-label">
            Enter a new password for the user
          </label>
          <hr />
          <div className="d-flex align-items-center row">
            <label className="form-label me-3 col-2">Current Password:</label>
            <input
              name="current"
              type="password"
              className="form-control w-25 col-10"
              onChange={(e) => {
                setCurrent(e.target.value);
              }}
              required
            />
          </div>

          <div className="d-flex  mt-5 row">
            <label className="form-label me-3 col-2">New Password:</label>
            <div className="d-flex flex-column w-25 col-10 p-0">
              <input
                name="first"
                type="password"
                className="form-control"
                onChange={(e) => {
                  setFirst(e.target.value);
                }}
                required
              />
              <ul class="b">
                <li>
                  <p className="text-secondary mb-0">Your password can’t be too similar to your other personal information.</p>
                </li>
                <li>
                  <p className="text-secondary mb-0">Your password must contain at least 8 characters.</p>
                </li>
                <li>
                  <p className="text-secondary mb-0">Your password can’t be entirely numeric.</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-center mt-2 row">
            <label className="form-label me-3 col-2">Retype Password:</label>
            <input
              name="seco"
              type="password"
              className="form-control w-25 col-10"
              onChange={(e) => {
                setSeco(e.target.value);
              }}
              required
            />
          </div>
          <div
            className="d-flex flex-row-reverse w-100 bg-light p-3 mt-5"
            style={{ paddingBottom: "10px" }}
          >
            <button onClick={handleOpens} className="btn btn-primary text-end">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserChangePassword;

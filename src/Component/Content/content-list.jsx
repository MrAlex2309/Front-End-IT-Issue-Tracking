import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddHomeIcon from "@mui/icons-material/AddHome";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Link } from "react-router-dom";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import "../Content/content.css";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import FilterListIcon from "@mui/icons-material/FilterList";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import api from "../context/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import checkPermissions from "../context/PermissionFilter";
import CircularProgress from "@mui/material/CircularProgress";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import PersonIcon from "@mui/icons-material/Person";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};
const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 490,
  bgcolor: "background.paper",
  boxShadow: 24,
};

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    height: "15px",
    borderRadius: "50%",
    width: "15px",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

function AvatarProfile({ name }) {
  const [profile, setProfile] = useState();

  const getProfile = async () => {
    try {
      const getPhoto = await api.get(`${name}`, {
        responseType: "blob",
      });
      if (getPhoto.data instanceof Blob) {
        setProfile(URL.createObjectURL(getPhoto.data));
      }
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };
  useEffect(() => {
    getProfile();
  }, [name]);
  return <img src={profile} style={{ borderRadius: "50%", width: "40px" }} />;
}

function Content({ onData }) {
  const [open, setOpen] = useState(false);
  // const { userInfo } = useContext(AuthContext);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { logoutUser } = useContext(AuthContext);
  const [see, setSee] = useState(false);
  const [opens, setOpens] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState(false);
  const [newPass, setNewPass] = useState(false);
  const [retypePass, setRetypePass] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [retypePassword, setRetypePassword] = useState();
  const [snackBar, setSnackBar] = useState(false);
  const [oldPassValid, setOldPassValid] = useState(false);
  const [oldPassMsg, setOldPassMsg] = useState();
  const [newPassValid, setNewPassValid] = useState(false);
  const [newPassMsg, setNewPassMsg] = useState();
  const [circle, setCircle] = useState(false);
  const handleCloseProfile = () => setShow(false);
  const handleShowProfile = () => setShow(true);
  const handleOpen = () => setOpens(true);
  const handleClose = () => setOpens(false);
  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBar(false);
  };
  useEffect(() => {
    onData(open);
  }, [open]);
  const ChangPasswordHandler = async (e) => {
    e.preventDefault();
    setCircle(true);
    try {
      await api.put(`/api/users/${userInfo.id}/change_password/`, {
        old_password: oldPassword,
        password: newPassword,
        password2: retypePassword,
      });
      setSnackBar(true);
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
      setOldPassValid(false);
      setNewPassValid(false);
      setCircle(false);
    } catch (e) {
      setCircle(false);
      const error = e.response.data;
      if (error.old_password) {
        setOldPassValid(true);
        setOldPassMsg(error.old_password.old_password);
      }
      if (!error.old_password) {
        setOldPassValid(false);
        setOldPassMsg("");
      }
      if (error.password) {
        setNewPassValid(true);
        setNewPassMsg(error.password[0]);
      }
      if (!error.password) {
        setNewPassValid(false);
        setNewPassMsg("");
      }
      console.log(error);
    }
  };
  const permissionArr = JSON.parse(localStorage.getItem("userInfo"));
  const names = permissionArr.Permissions;
  const name = [];
  names.map((e) => {
    name.push(e.name);
  });
  const access = checkPermissions(permissionArr && permissionArr.Permissions, [
    "User",
  ]);
  const ITaccess = checkPermissions(
    permissionArr && permissionArr.Permissions,
    ["Admin"]
  );
  return (
    <Sidebar
      rootStyles={{
        backgroundColor: "white",
        height: "100%",
        position: "fixed",
        width: "270px",
        zIndex: "10",
      }}
      collapsed={open}
    >
      <Menu>
        <MenuItem
          icon={<MenuOutlinedIcon />}
          style={{ textAlign: "center" }}
          onClick={() => {
            setOpen((prev) => !prev);
          }}
        >
          <span style={{ fontSize: "19px" }}>Issue Tracking System</span>
        </MenuItem>
        <hr />
        {userInfo && (
          <MenuItem
            // component={<Link to="/user" />}
            rootStyles={{ padding: "0px" }}
            onClick={handleShowProfile}
          >
            <div className="d-flex align-items-center w-100">
              <AvatarProfile name={userInfo.profile} />
              <p
                className="text-start ms-1 mb-0 text-center"
                style={
                  userInfo.username === "Chea Monysatyakvathna" ||
                  userInfo.username === "Songheak Chanratanak"
                    ? {}
                    : { paddingLeft: "10px" }
                }
              >
                {userInfo.username}
              </p>
            </div>
          </MenuItem>
        )}
        <hr />
        {!access ? (
          <div>
            <MenuItem
              component={<Link to="/CardReport" />}
              icon={<CreditCardIcon />}
            >
              Card Report
            </MenuItem>

            <div style={{ bottom: "0px" }}>
              <MenuItem
                rootStyles={{ marginTop: "0px" }}
                icon={<ExitToAppIcon />}
                onClick={handleOpen}
              >
                Sign out
              </MenuItem>
            </div>
          </div>
        ) : (
          <div>
            <div className="GG">
              <MenuItem component={<Link to="/" />} icon={<LeaderboardIcon />}>
                {" "}
                Dashboard{" "}
              </MenuItem>
            </div>
            <MenuItem component={<Link to="/home" />} icon={<AddCircleIcon />}>
              {" "}
              Case Adding{" "}
            </MenuItem>
            {/* <SubMenu label="Report" icon={<AssessmentIcon />}> */}
            <MenuItem
              component={<Link to="/report" />}
              icon={<AssessmentIcon />}
            >
              Issue Report
            </MenuItem>
            <MenuItem
              component={<Link to="/CardReport" />}
              icon={<CreditCardIcon />}
            >
              Card Report
            </MenuItem>
            <MenuItem
              component={<Link to="/monthly-report" />}
              icon={<SummarizeOutlinedIcon />}
            >
              Report
            </MenuItem>
            {!ITaccess ? (
              <div style={{ bottom: "0px" }}>
                <MenuItem
                  rootStyles={{ marginTop: "0px" }}
                  icon={<ExitToAppIcon />}
                  onClick={handleOpen}
                >
                  Sign out
                </MenuItem>
              </div>
            ) : (
              <div>
                {/* </SubMenu> */}
                <MenuItem
                  component={<Link to="/client" />}
                  icon={<AddHomeIcon />}
                >
                  {" "}
                  Client{" "}
                </MenuItem>
                <MenuItem component={<Link to="/user" />} icon={<PersonIcon />}>
                  {" "}
                  User{" "}
                </MenuItem>
                <div style={{ bottom: "0px" }}>
                  <MenuItem
                    rootStyles={{ marginTop: "0px" }}
                    icon={<ExitToAppIcon />}
                    onClick={handleOpen}
                  >
                    Sign out
                  </MenuItem>
                </div>
              </div>
            )}
          </div>
        )}
      </Menu>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={opens}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={opens}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              <Alert severity="warning" sx={{ fontSize: 16 }}>
                Sign Out
              </Alert>
            </Typography>
            <Typography id="transition-modal-description" sx={{ padding: 2 }}>
              Are you sure to sign out?
            </Typography>
            <div className="me-2 mb-2 d-flex justify-content-end">
              <Button onClick={logoutUser} variant="outlined" color="error">
                Log out
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={show}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={show}>
          <Box sx={styles}>
            <div className="d-flex justify-content-between align-items-center p-2 bg-primary">
              <h4 className="text-white">Profile</h4>
              <h4
                className="text-white"
                onClick={handleCloseProfile}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </h4>
            </div>
            <form action="" onSubmit={ChangPasswordHandler}>
              <div className="border border-2 m-3 p-2">
                <div className="d-flex justify-content-center m-3">
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={`${import.meta.env.VITE_API_URL}:${
                        import.meta.env.VITE_API_PORT
                      }${userInfo.profile}`}
                      sx={{ width: 100, height: 100 }}
                    />
                  </StyledBadge>
                </div>
                <p className="text-center fw-bold fs-5">{userInfo.name}</p>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-outline-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setPassword((prev) => !prev);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserPen}
                      style={{ marginRight: "5px" }}
                    />{" "}
                    Change Password
                  </button>
                </div>
                <div
                  className="d-flex flex-column justify-content-center"
                  style={{ margin: "20px 10px" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="fs-6" htmlFor="">
                      Telephone :
                    </label>
                    <input
                      className="form-control"
                      style={{ width: "70%" }}
                      type="text"
                      disabled
                      value={!access ? "--- --- ---" : "012 786 341"}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <label className="fs-6" htmlFor="">
                      Position :
                    </label>
                    <input
                      className="form-control"
                      style={{ width: "70%" }}
                      type="text"
                      disabled
                      value={!access ? "Customer Service" : "IT Officer"}
                    />
                  </div>
                  {password && (
                    <div>
                      <div className="d-flex justify-content-between  align-items-center mt-3">
                        <label className="fs-6" htmlFor="">
                          *Old password :
                        </label>
                        <div
                          className="input-group flex-nowrap"
                          style={{ width: "70%" }}
                        >
                          <input
                            value={oldPassword}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                            type={see ? "text" : "password"}
                            required
                            className="form-control"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Username"
                            aria-label="Username"
                          />

                          <span
                            className="input-group-text input"
                            id="addon-wrapping"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setSee((prev) => !prev);
                            }}
                          >
                            @
                          </span>
                        </div>
                      </div>
                      {oldPassValid && (
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor=""></label>
                          <div
                            className="input-group flex-nowrap"
                            style={{ width: "70%" }}
                          >
                            <p className="text-danger mb-0">*{oldPassMsg}</p>
                          </div>
                        </div>
                      )}

                      <div className="d-flex justify-content-between  align-items-center mt-3">
                        <label className="fs-6" htmlFor="">
                          *New password :
                        </label>
                        <div
                          className="input-group flex-nowrap"
                          style={{ width: "70%" }}
                        >
                          <input
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                            }}
                            type={newPass ? "text" : "password"}
                            className="form-control"
                            required
                            aria-describedby="passwordHelpBlock"
                            placeholder="Username"
                            aria-label="Username"
                          />

                          <span
                            className="input-group-text input"
                            id="addon-wrapping"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setNewPass((prev) => !prev);
                            }}
                          >
                            @
                          </span>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <label className="" htmlFor=""></label>
                        <div style={{ width: "70%" }}>
                          <p className="mb-0">
                            *Your password can’t be too similar to your other
                            personal information.
                          </p>
                          <p className="mb-0">
                            *Your password must contain at least 8 characters.
                          </p>
                          <p className="mb-0">
                            *Your password can’t be a commonly used password.
                          </p>
                          <p className="mb-0">
                            *Your password can’t be entirely numeric..
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between  align-items-center mt-3">
                        <label className="fs-6" htmlFor="">
                          *Retype password :
                        </label>
                        <div
                          className="input-group flex-nowrap"
                          style={{ width: "67%" }}
                        >
                          <input
                            value={retypePassword}
                            onChange={(e) => {
                              setRetypePassword(e.target.value);
                            }}
                            type={retypePass ? "text" : "password"}
                            className="form-control"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Username"
                            aria-label="Username"
                            required
                          />
                          <span
                            className="input-group-text input"
                            id="addon-wrapping"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setRetypePass((prev) => !prev);
                            }}
                          >
                            @
                          </span>
                        </div>
                      </div>
                      {newPassValid && (
                        <div className="d-flex justify-content-between">
                          <label className="" htmlFor=""></label>
                          <div
                            className="input-group flex-nowrap"
                            style={{ width: "67%" }}
                          >
                            <p className="text-danger mb-0">*{newPassMsg}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-end me-3 mb-3">
                <button
                  className="btn btn-primary"
                  disabled={!password}
                  onClick={() => {}}
                >
                  Save
                </button>
              </div>
            </form>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={circle}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Fade>
      </Modal>
      <Snackbar open={snackBar} autoHideDuration={5000} onClose={handleClosed}>
        <Alert
          onClose={handleClosed}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          You have successfuly change your password!!
        </Alert>
      </Snackbar>
    </Sidebar>
  );
}
export default Content;

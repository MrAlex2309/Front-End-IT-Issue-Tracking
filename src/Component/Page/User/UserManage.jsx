import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../context/api";
import CreateIcon from "@mui/icons-material/Create";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DeleteIcon from '@mui/icons-material/Delete';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserProfileImage = ({ profilePicPath }) => {
  const [imageUrl, setImageUrl] = useState("");
  const fetchImage = async () => {
    if (profilePicPath) {
      try {
        const url = await api.get(profilePicPath, {
          responseType: "blob",
        });
        if (url.data instanceof Blob) {
          setImageUrl(URL.createObjectURL(url.data));
        }
      } catch (error) {
        setImageUrl(URL.createObjectURL(profilePicPath));
      }
    }
  };

  useEffect(() => {
    fetchImage();
  }, [profilePicPath]);
  // const border = imageUrl ? '' : 'border border-primary'
  return (
    <>
      <img
        required
        className={`img-fluid  `}
        src={imageUrl}
        alt="User Profile"
      />
      ;
    </>
  );
};

function UserManage() {
  const initUser = {
    contact: "",
    firstName: "",
    lastName: "",
    password: "",
    position: "",
    username: "",
    profile_pic: "",
  };

  const [users, setUsers] = useState();
  const [open, setOpen] = React.useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [userInfo, setUserInfo] = useState();
  const [userAdd, setUserAdd] = useState(initUser);
  const [color, setColor] = useState();
  const [roleIndex, setRoleIndex] = useState(null);
  const [viewPhoto, setViewPhoto] = useState(false);
  const [snaBar, setSnaBar] = useState(false);

  const changePhotoRef = useRef();
  const handleOpenSnackBar = () => {
    setSnaBar(true);
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickalway") {
      return;
    }
    setSnaBar(false);
  };
  const handleAddOpen = () => {
    setAddOpen(true);
  };
  const handleCloseAddOpen = () => {
    setAddOpen(false);
    setUserAdd(initUser);
  };
  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseOpenDelete = () => {
    setOpenDelete(false);
  };
  const handleClickOpen = (value) => {
    setUserInfo(value);
    setOpen(true);
  };
  const handleClose = async () => {
    setUserInfo();
    setOpen(false);
  };
  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", userAdd.firstName);
    formData.append("lastName", userAdd.lastName);
    formData.append("position", userAdd.position);
    formData.append("username", userAdd.username);
    formData.append("contact", userAdd.contact);
    formData.append("file", userAdd.profile_pic);
    formData.append("password", userAdd.password);
    await api
      .post("/api/user", formData)
      .then((res) => {
        if (res.status === 201) {
          handleCloseAddOpen();
          getAllUser();
        }
      })
      .catch((e) => console.log(e));
  };
  const handleEditUser = async () => {
    const formData = new FormData();
    formData.append("firstName", userInfo.firstName);
    formData.append("lastName", userInfo.lastName);
    formData.append("position", userInfo.position);
    formData.append("username", userInfo.username);
    formData.append("contact", userInfo.contact);
    formData.append("file", userInfo.profile_pic);
    await api.patch(`/api/user/${userInfo.id}`, formData).then((res) => {
      if (res.status === 200) {
        getAllUser();
        handleOpenSnackBar();
      }
      if (res.data.id === JSON.parse(localStorage.getItem("userInfo")).id) {
        console.log("Tre");
        const names = res.data.roleList;
        const name = [];
        names.map((e) => {
          name.push(e.name);
        });
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            name: res.data.firstName + res.data.lastName,
            profile: res.data.profile_pic,
            username: res.data.username,
            id: res.data.id,
            Permissions: name,
          })
        );
      }
    });
  };
  const getAllUser = async () => {
    await api.get(`api/user`).then((res) => {
      setUsers(res.data);
    });
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };
  const handleAddOnChange = (e) => {
    const { name, value } = e.target;
    setUserAdd({
      ...userAdd,
      [name]: value,
    });
  };
  useEffect(() => {
    getAllUser();
  }, []);
  const updatedDateFormats = (prop) => {
    var dateFormat = new Date(prop);
    let month = dateFormat.getMonth() + 1;
    let year = dateFormat.getFullYear();
    let day = dateFormat.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    let s = `${year}-${month}-${day}`;
    return s;
  };
  return (
    <div className="">
      <div className="p-3 bg-primary">
        <h3 className="mb-0 text-white">User Management</h3>
      </div>
      <div className="container d-flex justify-content-between mt-3">
        <div className="input-group w-50">
          <span className="input-group-text" id="basic-addon1">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </div>
        <div>
          <button onClick={handleAddOpen} className="btn btn-primary">
            Add User
          </button>
        </div>
      </div>
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          // maxWidth='md'
          fullWidth
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"User Preview"}</DialogTitle>
          <DialogContent sx={{ width: 600 }}>
            <DialogContentText id="alert-dialog-slide-description">
              {userInfo && (
                <div className="d-flex justify-content-between">
                  <div className="me-3">
                    <div className="d-flex align-items-center">
                      <p className="mb-0 me-2">UserName: </p>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={userInfo.username}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">First_Name: </p>
                      <input
                        name="firstName"
                        type="text"
                        className="form-control"
                        value={userInfo.firstName}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Last_Name: </p>
                      <input
                        name="lastName"
                        type="text"
                        className="form-control"
                        value={userInfo.lastName}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Position: </p>
                      <input
                        name="position"
                        type="text"
                        className="form-control"
                        value={userInfo.position}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Contact: </p>
                      <input
                        name="contact"
                        type="text"
                        className="form-control"
                        value={userInfo.contact}
                        onChange={handleOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Role: </p>
                      {userInfo.roleList.map((value, index) => {
                        return (
                          <span
                            key={index}
                            className="badge rounded-pill bg-success d-flex align-items-center me-2"
                          >
                            <p className="mb-0 me-1">{value.name}</p>
                            <div
                              onMouseEnter={() => {
                                setRoleIndex(index);
                                setColor("black");
                              }}
                              onMouseLeave={() => {
                                setRoleIndex(null);
                                setColor("white");
                              }}
                            >
                              <CancelIcon
                                sx={{
                                  color: roleIndex === index ? color : "white ",
                                  cursor: "pointer",
                                }}
                              />
                            </div>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    style={{ width: "200px" }}
                    className="position-relative"
                    onMouseEnter={() => {
                      setViewPhoto(true);
                    }}
                    onMouseLeave={() => {
                      setViewPhoto(false);
                    }}
                  >
                    <UserProfileImage
                      profilePicPath={userInfo.profile_pic}
                      alt=""
                    />
                    <div
                      className="position-absolute bottom-0 end-0 bg-secondary"
                      style={{ opacity: "0.5", cursor: "pointer" }}
                    >
                      {viewPhoto && (
                        <MoreHorizIcon
                          onClick={() => {
                            changePhotoRef.current.click();
                          }}
                        />
                      )}
                      <input
                        name="profile_pic"
                        type="file"
                        onChange={(event) => {
                          setUserInfo({
                            ...userInfo,
                            profile_pic: event.target.files[0],
                          });
                        }}
                        ref={changePhotoRef}
                        hidden
                      />
                    </div>
                  </div>
                </div>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="btn btn-primary" onClick={handleEditUser}>
              Agree
            </button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={addOpen}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          onClose={handleCloseAddOpen}
          aria-describedby="alert-dialog-slide-description"
        >
          <form onSubmit={handleAddUser}>
            <DialogTitle>{"Add User"}</DialogTitle>
            <DialogContent sx={{ width: 600 }}>
              <DialogContentText id="alert-dialog-slide-description">
                <div className="d-flex justify-content-between">
                  <div className="me-3">
                    <div className="d-flex align-items-center">
                      <p className="mb-0 me-2">UserName: </p>
                      <input
                        required
                        type="text"
                        name="username"
                        className="form-control"
                        value={userAdd && userAdd.username}
                        onChange={handleAddOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">First_Name: </p>
                      <input
                        required
                        name="firstName"
                        type="text"
                        className="form-control"
                        value={userAdd && userAdd.firstName}
                        onChange={handleAddOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Last_Name: </p>
                      <input
                        required
                        name="lastName"
                        type="text"
                        className="form-control"
                        value={userAdd && userAdd.lastName}
                        onChange={handleAddOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Position: </p>
                      <input
                        required
                        name="position"
                        type="text"
                        className="form-control"
                        value={userAdd && userAdd.position}
                        onChange={handleAddOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Contact: </p>
                      <input
                        required
                        name="contact"
                        type="text"
                        className="form-control"
                        value={userAdd && userAdd.contact}
                        onChange={handleAddOnChange}
                      />
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 me-2">Password: </p>
                      <input
                        required
                        name="password"
                        type="password"
                        className="form-control"
                        value={userAdd && userAdd.password}
                        onChange={handleAddOnChange}
                      />
                    </div>
                  </div>

                  <div
                    style={{ width: "200px" }}
                    className={`position-relative ${
                      userAdd && userAdd.profile_pic
                        ? ""
                        : "border border-5 rounded"
                    }`}
                    onMouseEnter={() => {
                      setViewPhoto(true);
                    }}
                    onMouseLeave={() => {
                      setViewPhoto(false);
                    }}
                  >
                    <UserProfileImage
                      profilePicPath={userAdd && userAdd.profile_pic}
                      alt=""
                    />
                    <div
                      className="position-absolute bottom-0 end-0 bg-secondary"
                      style={{ opacity: "0.5", cursor: "pointer" }}
                    >
                      {viewPhoto && (
                        <MoreHorizIcon
                          onClick={() => {
                            changePhotoRef.current.click();
                          }}
                        />
                      )}
                      <input
                        name="profile_pic"
                        type="file"
                        onChange={(event) => {
                          setUserAdd({
                            ...userAdd,
                            profile_pic: event.target.files[0],
                          });
                        }}
                        ref={changePhotoRef}
                        hidden
                      />
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
      <div className="mt-5 container-fluid table-responsive">
        <table className="table table-bordered ">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Username</th>
              <th scope="col">Position</th>
              <th scope="col">Contact</th>
              <th scope="col">Join at</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((value, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{`KTS-` + index}</th>
                    <td>
                      {value.firstName} {value.lastName}
                    </td>
                    <td>{value.position}</td>
                    <td>{value.contact}</td>
                    <td>{updatedDateFormats(value.create_at)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => {
                          handleClickOpen(value);
                        }}
                      >
                        <CreateIcon />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-3"
                        onClick={() => {
                          handleOpenDelete()
                        }}
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Dialog
        open={openDelete}
        onClose={handleCloseOpenDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        
        <Alert severity="warning">Warning!!</Alert>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="btn btn-danger" onClick={handleCloseOpenDelete} autoFocus>
            Agree
          </button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snaBar}
        autoHideDuration={2000}
        onClose={handleCloseSnackBar}
        message="Note archived"
      >
        <Alert variant="filled" severity="success">
          User updated successfully
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserManage;

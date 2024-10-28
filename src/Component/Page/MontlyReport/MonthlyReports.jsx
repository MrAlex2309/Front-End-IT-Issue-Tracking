import React, { useState } from "react";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";
import folder from "./folder.png";
import { Link } from "react-router-dom";
import api from "../../context/api";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Box from "@mui/material/Box";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";


function MonthlyReports() {
  const [user, setUser] = useState();
  const [addFolder, setAddFolder] = useState(false);
  const [deletePicture, setDeletePicture] = useState(false);
  const [folderName, setFolderName] = useState();
  const [more, setMore] = useState(null);
  const [editFolder, setEditFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState();
  const [editId, setEditId] = useState();
 

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
  };

  const getFolder = async () => {
    await api.get("/api/folder").then((dat) => setUser(dat.data));
  };
  const editNameFolder = async () => {
    await api.patch(`/api/folder/${editId}`, {
      folderName: editFolderName,
    });
    getFolder();
    setEditFolderName();
    setEditFolder(null);
  };
  const deleteFolder = async () => {
    await api.delete(`/api/folder/${editId}`);
    getFolder();
    setEditFolder(null);
    handleClose();
    setEditId(null);
  };
  const handleOpen = () => {
    setDeletePicture(true);
  };
  const handleClose = () => {
    setDeletePicture(false);
  };
  useEffect(() => {
    getFolder();
  }, []);
  const onAddFolderHandler = async () => {
    await api.post("/api/folder", { folderName: folderName });
    getFolder();
  };
  return (
    <div className="container-fluid p-0 bg-light w-100 vh-100">
      <div className="bg-primary p-3">
        <h3 className="text-white mb-0">Monthly Report</h3>
      </div>
      <div className="p-3 d-flex justify-content-between align-items-center">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Library
            </li>
          </ol>
        </nav>
        <div>
          {editFolderName && (
            <button
              className="btn btn-success me-3"
              onClick={() => {
                editNameFolder();
              }}
            >
              <CheckCircleOutlineIcon
              // style={{ marginBottom: "2px", marginRight: "7px" }}
              />
            </button>
          )}
          {folderName && (
            <button
              className="btn btn-success me-3"
              onClick={() => {
                setAddFolder((prev) => !prev);
                setFolderName();
                onAddFolderHandler();
              }}
            >
              <CheckCircleOutlineIcon
              // style={{ marginBottom: "2px", marginRight: "7px" }}
              />
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => {
              setAddFolder((prev) => !prev);
              setFolderName();
            }}
          >
            <FolderOutlinedIcon
              style={{ marginBottom: "2px", marginRight: "7px" }}
            />
            Create Folder
          </button>
        </div>
      </div>
      <hr className="m-0" />
      <div className="m-3" style={{ width: "300px" }}>
        <div className="input-group input-group-sm mb-3">
          <span className="input-group-text" id="inputGroup-sizing-sm">
            <SearchIcon />
          </span>
          <input
            placeholder="search.."
            type="text"
            class="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
      </div>
      
      <div className="container-fluid">
        <div className="row ">
          {user
            ? user.map((e, index) => {
                return (
                  <div
                    onMouseEnter={() => {
                      setMore(index);
                    }}
                    onMouseLeave={() => {
                      setMore(null);
                    }}
                    key={index}
                    className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-1.5 col-xxl-1"
                    style={{ margin: "0px 0px" }}
                  >
                    <Link to={`/monthly-report/${e.id}`} style={{textDecoration: 'none', color:'black'}}>
                    <div class="d-flex flex-column align-items-center">
                      <div className="position-relative">
                        <img src={folder} alt="" style={{ width: "75px" }} />
                        {more === index && (
                          <div
                            className="position-absolute top-0 start-100 translate-middle"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ cursor: "pointer", zIndex: "100" }}
                            onClick={() => {
                              setEditId(e.id);
                            }}
                          >
                            <MoreHorizIcon />
                            <ul
                              class="dropdown-menu"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="#"
                                  onClick={() => {
                                    setEditFolderName(e.folderName);
                                    setEditFolder(index);
                                  }}
                                >
                                  Rename
                                </a>
                              </li>
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="#"
                                  onClick={handleOpen}
                                >
                                  Delete
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      {editFolder === index ? (
                        <input
                          type="text"
                          value={editFolderName}
                          style={{ width: "90px" }}
                          onChange={(e) => {
                            setEditFolderName(e.target.value);
                          }}
                        />
                      ) : (
                        <p className="text-center">{e.folderName}</p>
                      )}
                    </div>
                    </Link>
                    
                  </div>
                );
              })
            : "No Document"}
          <Modal
            open={deletePicture}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div className="bg-danger">
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ color: "white" }}
                >
                  <WarningAmberIcon color="warning" />
                  Warning
                </Typography>
              </div>
              <Typography id="modal-modal-description" sx={{ p: 2 }}>
                Are you sure to delete this picture?
              </Typography>
              <button
                className="btn btn-danger btn-sm ms-2 mb-2"
                onClick={deleteFolder}
              >
                Delete
              </button>
            </Box>
          </Modal>
          {addFolder ? (
            <div
              className="col-6 col-sm-6 col-md-4 col-lg-2 col-xl-1"
              style={{ margin: "0px 20px" }}
            >
              <div class="d-flex flex-column align-items-center">
                <img src={folder} alt="" style={{ width: "75px" }} />
                <input
                  type="text"
                  style={{ width: "90px" }}
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyReports;

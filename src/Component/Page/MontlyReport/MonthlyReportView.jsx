import React, { useEffect, useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useParams } from "react-router-dom";
import api from "../../context/api";
import DownloadIcon from "@mui/icons-material/Download";
import { Avatar } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import filePhoto from "../../assets/filePhoto.webp";
import docx from "../../assets/word.png";
import xlsx from "../../assets/excels.png";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

function AvatarProfile({ name }) {
  const [profile, setProfile] = useState();
  const getProfile = async () => {
    await api.get(`/api/user/by/${name}`).then((res) => {
      setProfile(res.data.userProfileDTO.profile_pic);
    });
  };
  useEffect(() => {
    getProfile();
  }, []);
  return <UserProfileImage profilePicPath={profile} />;
}
const UserProfileImage = ({ profilePicPath }) => {
  const [imageUrl, setImageUrl] = useState('')
  const fetchImage = async () => {
      try {
        const url = await api.get(profilePicPath, {
          responseType:'blob'
        });
        if(url.data instanceof Blob){
          setImageUrl(URL.createObjectURL(url.data))
        }
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };
  useEffect(() => {
    fetchImage();
  }, [profilePicPath]);

  return (
    <Avatar sx={{ width: 27, height: 27 }} src={imageUrl} />
  );
};

function MonthlyReportView() {
  const [file, setFile] = useState();
  const [moreToggle, setMoreToggle] = useState(null);
  const [editFileNameIndex, setEditFileNameIndex] = useState(null);
  const [editFileName, setEditFileName] = useState(null);
  const [files, setFiles] = useState();
  const [fileDetail, setFileDetail] = useState();
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [openDrop, setOpenDrop] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setFile();
    setOpen(false);
  };
  const getFile = async () => {
    const res = await api.get(`/api/folder/${id}`);
    setFiles(res.data);
    setFileDetail(res.data.fileAttachments);
  };

  useEffect(() => {
    getFile();
  }, []);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folderId", id);
  const fileUpload = async () => {
    await api.post(`/api/file`, formData);
    handleClose();
    getFile();
  };
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
  const getExtenstion = (value) => {
    if (value.fileType === "application/pdf") {
      return `${import.meta.env.VITE_API_URL}:${
        import.meta.env.VITE_API_PORT
      }/api/file/thumbnail/${value.fileName}`;
    } else if (
      value.fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return docx;
    } else return xlsx;
  };
  const inputRef = useRef(null);
  return (
    <div className="container-fluid p-0 w-100">
      <div className="bg-primary p-3">
        <h3 className="text-white mb-0">Monthlyk Report</h3>
      </div>
      <div className="p-3 d-flex justify-content-between align-items-center">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <Link to="/monthly-report">Library</Link>
            </li>
            <li class="breadcrumb-item">{files && files.folderName}</li>
          </ol>
        </nav>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              inputRef.current.click();
            }}
          >
            Import file
            <input
              hidden
              ref={inputRef}
              className="form-control"
              type="file"
              onChange={(e) => {
                if (e) {
                  setFile(e.target.files[0]);
                  handleClickOpen();
                }
              }}
            />
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
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Card sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h6">
                    {file && file.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{ color: "text.secondary" }}
                  >
                    {file && file.type}
                  </Typography>
                </CardContent>
              </Box>
              <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={filePhoto}
                alt="Live from space album cover"
              />
            </Card>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={fileUpload} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <div className="container-fluid">
        <div className="row">
          {fileDetail &&
            fileDetail.map((value, index) => {
              // console.log(value)
              return (
                <Card
                  key={index}
                  sx={{
                    maxWidth: 200,
                    padding: 0,
                    margin: 2,
                    backgroundColor: "#F9F9F9",
                  }}
                >
                  <div
                    onMouseEnter={() => {
                      setMoreToggle(index);
                    }}
                    onMouseLeave={() => {
                      setMoreToggle(null);
                    }}
                    className="position-relative"
                  >
                    <CardMedia
                      sx={{ height: 250 }}
                      image={getExtenstion(value)}
                      title="green iguana"
                    />

                    {moreToggle === index && (
                      <div className="m-1 p-2 position-absolute top-0 end-0 dropdown">
                        <div
                          style={{ opacity: "0.8", cursor: "pointer" }}
                          className="bg-light dropdown-toggle p-2"
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        ></div>
                        <ul
                          class="dropdown-menu"
                          // style={{ opacity: "1" }}
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <li
                            onClick={() => {
                              setEditFileNameIndex(index);
                              setEditFileName(value.fileName.split(".")[0]);
                            }}
                          >
                            <p className="dropdown-item m-0">Rename</p>
                          </li>
                          <li onClick={async()=>{
                            await api.delete(`/api/file/${value.id}`)
                            getFile()
                          }}>
                            <p className="dropdown-item m-0 text-danger">
                              Delete
                            </p>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <CardContent
                    onClick={async () => {
                      if (editFileNameIndex === index) {
                        await api
                          .patch(`/api/file/${value.id}`, {
                            name: editFileName,
                          })
                          .then((res) => {
                            setOpenDrop(true);
                            if (res.status == 200) {
                              setEditFileName();
                              setEditFileNameIndex(null);
                              getFile();
                              setOpenDrop(false);
                            }
                          });
                      } else {
                        setEditFileName();
                        setEditFileNameIndex(null);
                      }
                    }}
                  >
                    {editFileNameIndex === index ? (
                      <input
                        autoFocus={true}
                        value={editFileName}
                        type="text"
                        onChange={(e) => {
                          setEditFileName(e.target.value);
                        }}
                        className="form-control mb-1 p-1"
                      />
                    ) : (
                      <h7>{value.fileName.split(".")[0]}</h7>
                    )}
                    <div className="d-flex justify-content-between mt-1">
                      <DownloadIcon
                        onClick={() => {
                          window.open(
                            `http://localhost:8080/api/file/${value.fileName}`
                          );
                        }}
                      />
                      {updatedDateFormats(value.createdDate)}
                      <Tooltip title={value.handler}>
                        <div>
                          <AvatarProfile name={value.handler} />
                        </div>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default MonthlyReportView;

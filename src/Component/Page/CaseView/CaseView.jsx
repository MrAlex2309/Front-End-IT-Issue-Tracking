import React, { useEffect } from "react";
import "../CaseView/CaseView.css";
import logo from "../../assets/logoKts.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import api from "../../context/api";
import Card from "react-bootstrap/Card";
import ImgPreview from "../../../Utility/Model/ImgPreview";
import Box from "@mui/material/Box";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
};

export default function CaseView() {
  let navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [img, setImg] = useState([]);
  const [file, setFile] = useState([]);
  const { id } = useParams();
  const [clients, setClients] = useState([]);
  const [cli, setCli] = useState();
  const [solu, setSolu] = useState(true);
  const [clientErrMsg, setClientErrMsg] = useState();
  const [tog, setTog] = useState(false);
  const [check, setCheck] = useState();
  const [imgShow, setImgShow] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [deletePicture, setDeletePicture] = useState(false);
  const [urlPic, setUrlPic] = useState();
  const [userinfo, setUserInfo] = useState({
    languages: [],
    response: [],
  });
  const [permission, setpermission] = useState(false)
  const [language, setLanguage] = useState();
  const handleOpen = (url) => {
    setUrlPic(url);
    setDeletePicture(true);
  };
  const handleClose = () => {
    setDeletePicture(false);
    setUrlPic();
  };
  const inputRef = useRef();
  const handleClick = () => {
    inputRef.current.click();
  };

  const onInputChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  const handleClient = async () => {
    await api
      .get("/api/clients/")
      .then((res) => res.data)
      .then((ress) => setClients(ress))
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    handleClient();
  }, []);
  const options = [];

  clients.map((e) => {
    options.push({ value: e.cid, label: e.name });
  });

  const deleteHandler = async () => {
  await api.delete(`/api/issue/${id}`).then((res)=>{
    navigate("/report")
  }).catch((e)=>{
    window.alert(e.response.data.msg)
  })
    
    
  };
  const [info, setInfo] = useState({
    issue_type: "",
    location: "",
    description: "",
    solution: "",
    status: "DONE",
    client: "",
  });
  const fetchSingle = async () => {
    await api.get(`/api/issue/${id}`).then((datas) => {
      setInfo(datas.data);
      setImg(datas.data.attachments);
    });
  };
  useEffect(() => {
    fetchSingle();
  }, []);
  useEffect(()=>{
    if(info.creator === JSON.parse(localStorage.getItem("userInfo")).name){
      setpermission(true)
    }
  },[info.creator])
  function handlePaste(event) {
    let paste = event.clipboardData || window.clipboardData;
    let files = paste.files;

    // Use the files as needed
    if (files.length) {
      const targetFilesObj = files[0];
      setTog((prev) => !prev);
      setFile((prevFile) => {
        return prevFile ? [...prevFile, targetFilesObj] : targetFilesObj;
      });
    }
  }
  const handleMultipleImages = (evnt) => {
    const targetFiles = evnt.target.files;
    const selectedFiles = [];
    const targetFilesObj = [...targetFiles];
    targetFilesObj.map((file) => {
      return selectedFiles.push(URL.createObjectURL(file));
    });
    setFile((prevFile) => {
      return prevFile ? [...prevFile, ...targetFilesObj] : targetFilesObj;
    });
    setTog((prev) => !prev);
  };
  const handleMultipleImage = (evnt) => {
    const targetFiles = evnt.target.files;
    const selectedFiles = [];
    const targetFilesObj = [...targetFiles];
    targetFilesObj.map((file) => {
      return selectedFiles.push(URL.createObjectURL(file));
    });
    setFile(targetFilesObj);
    setTog((prev) => !prev);
  };
  const arrFile = [];
  file &&
    file.forEach((e) => {
      if (e.targetFilesObj) {
        e.targetFilesObj.map((e1) => {
          arrFile.push(e1);
        });
      } else {
        arrFile.push(e);
      }
    });
  const selectedFiles = [];
  useEffect(() => {
    arrFile.map((file) => selectedFiles.push(URL.createObjectURL(file)));
    setImages(selectedFiles);
  }, [tog]);
  const handleRemove = (index) => {
    const newFile = arrFile.filter((items, i) => i !== index);
    const newImage = images.filter((items, i) => i !== index);
    setImages(newImage);
    setFile(newFile);
  };
  const { issue_type, location, description, solution } = info;
  useEffect(() => {
    if (info.client) {
      setCli({
        value: info.client.id,
        label: info.client.name,
      });
    }
  }, [info]);
  info.status = "PENDING";
  useEffect(() => {
    if (info.solution) {
      setSolu(false);
    }
    if (!info.solution) {
      setSolu(true);
    }
  }, [info.solution]);
  const formData = new FormData();
  const submitHandler = async (e) => {
    e.preventDefault();
    info.status = "DONE";
    if (cli) {
      info.client = cli.value;
    }
    if (arrFile == undefined) {
      formData.append("issueType", info.issue_type);
      formData.append("location", info.location);
      formData.append("description", info.description);
      formData.append("status", info.status);
      formData.append("solution", info.solution);
      if (info.client) {
        formData.append("clientId", info.client && info.client);
      }
    } else {
      arrFile.forEach((item) => {
        formData.append("files", item);
      });

      formData.append("issueType", info.issue_type);
      formData.append("location", info.location);
      formData.append("description", info.description);
      formData.append("status", info.status);
      formData.append("solution", info.solution);
      if (info.client) {
        formData.append("clientId", info.client && info.client);
      }
    }
    await api.patch(`/api/issue/${id}`, formData).then((data) => {
      if (data.status === 200 || data.status === 201) {
        navigate("/report");
      }
    });
  };

  const SaveHandler = async () => {
    info.status = "PENDING";
    if (cli) {
      info.client = cli.value;
    }
    if (arrFile == undefined) {
      formData.append("issueType", info.issue_type);
      formData.append("location", info.location);
      formData.append("description", info.description);
      formData.append("status", info.status);
      formData.append("solution", info.solution);
      {
        userinfo.languages.length !== 0 &&
          userinfo.languages.forEach((item) => {
            formData.append("delete_ids", item);
          });
      }
      if (info.client) {
        formData.append("clientId", info.client && info.client);
      }
    } else {
      arrFile.forEach((item) => {
        formData.append("files", item);
      });
      formData.append("issueType", info.issue_type);
      formData.append("location", info.location);
      formData.append("description", info.description);
      formData.append("status", info.status);
      formData.append("solution", info.solution);
      {
        userinfo.languages.length !== 0 &&
          userinfo.languages.forEach((item) => {
            formData.append("delete_ids", item);
          });
      }

      if (info.client) {
        formData.append("clientId", info.client && info.client);
      }
    }
    await api
      .patch(`/api/issue/${id}`, formData)
      .then((data) => {
        if (data.status === 200 || data.status === 201) {
          setClientErrMsg();
          fetchSingle();
          setFile([]);
          setImages();
          setUserInfo({
            languages: [],
            response: [],
          });
        }
      })
      .catch((e) => {
        window.alert(e.response.data.msg)
      });
  };
  const handleChangeCheckBox = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { languages } = userinfo;
    setCheck(checked);
    setLanguage(languages);

    // Case 1 : The user checks the box
    if (checked) {
      setUrlPic({
        id: [...languages, value]
      })
      setUserInfo({
        languages: [...languages, value],
        response: [...languages, value],
      });
    }

    // Case 2  : The user unchecks the box
    else {
      setUrlPic({
        id: languages.filter((e)=> e !== value)
      })
      setUserInfo({
        languages: languages.filter((e) => e !== value),
        response: languages.filter((e) => e !== value),
      });
    }
  };
  const deletePictureHandler = async() => {
    await api.put('/api/issue/deletePic',[urlPic.id])
    fetchSingle()
    handleClose()
  }
  const deletePicturesHandler = async() => {
    await api.put('/api/issue/deletePic',urlPic.id)
    setUrlPic()
    fetchSingle()
  }
  return (
    <div className="container-fluid p-0 bg-light">
      <div className="bg-primary" style={{ height: "354px" }}>
        <p className="fs-4 fw-bolder text-light pt-4 ps-4">
          KTS Support Center
        </p>
      </div>
      <div className="d-flex justify-content-md-center" style={{ height: "" }}>
        <div className=" container bg-white px-5 py-4 mb-3">
          <div className="d-flex flex-column">
            <header>
              <div className="d-flex justify-content-start align-items-center">
                <div
                  style={{ height: "50px", width: "50px", marginRight: "16px" }}
                >
                  <img src={logo} alt="logo" className="w-100 h-100" />
                </div>
                <span className="fs-3">KTS Service Desk</span>
              </div>
              <div className="w-100 mt-3">
                <p className="fs-6">
                  សូមស្វាគមន៍មកកាន់សេវាជំនួយបច្ចេកទេសរបស់ក្រុមហ៊ុនKTS
                </p>
              </div>
            </header>
            <span className="my-2">Contact Us About</span>
            <div className="w-100 sui">
              <span>
                {issue_type == "EXTERNAL"
                  ? "ជំនួយផ្នែកបច្ចេកទេសទូទៅ (Customers IT Support)"
                  : "ជំនួយផ្នែកបច្ចេកទេសសម្រាប់ KTS (Internal IT Support)"}
              </span>
            </div>
            <span style={{ marginTop: "30px" }}>What can we help you?</span>
            <div className="w-100 sui d-flex align-items-center">
              <FontAwesomeIcon
                icon={faScrewdriverWrench}
                style={{ marginRight: "10px" }}
              />
              <span className="fw-bold text-primary">
                {issue_type == "EXTERNAL"
                  ? "ជំនួយការបច្ចេកទេសសំរាប់អតិថិជន"
                  : "ជំនួយការបច្ចេកទេសសំរាប់ KTS"}
              </span>
            </div>
            <div className="mt-4"></div>
            <form
              action=""
              className="form-floating"
              onSubmit={(e) => {
                submitHandler(e);
              }}
            >
              <p htmlFor="" style={{ marginBottom: "0px" }}>
                Reporter:
              </p>

              <select
                class="form-select"
                style={{ padding: "6px 12px", height: "36px" }}
                aria-label="Default select example"
                disabled
              >
                {info !== null ? (
                  <option selected>{info.creator}</option>
                ) : (
                  <option selected>no user</option>
                )}
                <option selected>{info.creator}</option>
              </select>
              <div className="mt-4">
                <label htmlFor="">Location Problem</label>
                <div className="mb-3">
                  <Select
                    required
                    value={cli}
                    options={options}
                    onChange={(e) => {
                      setCli(e);
                    }}
                    isClearable={true}
                  />
                  {/* {!info.client && (
                    <input
                      type="text"
                      className="form-control mt-3"
                      placeholder=""
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      name="location"
                      value={location}
                      onChange={(e) => {
                        onInputChange(e);
                      }}
                      required
                    />
                  )}
                  {clientErrMsg && (
                    <p className="text-danger">*Please Select Location</p>
                  )} */}
                </div>
              </div>
              <div class="form-outline mt-4">
                <textarea
                  class="form-control"
                  id="textAreaExample1"
                  rows="4"
                  placeholder="Place your problem"
                  name="description"
                  value={description}
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  required
                ></textarea>
              </div>
              <div class="form-floating mt-4">
                <input
                  type="text"
                  class="form-control"
                  id="floatingInputGrid"
                  placeholder=""
                  name="solution"
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  value={solution}
                />
                <label for="floatingInputGrid">Place your Resolve</label>
              </div>

              <div style={{ marginTop: "20px" }}>
                <span>ភ្ជាប់ឯកសារបន្ថែម</span>
                {
                  permission && <div class="input-group mt-2">
                  <input
                    type="file"
                    class="form-control"
                    id="inputGroupFile04"
                    aria-describedby="inputGroupFileAddon04"
                    aria-label="Upload"
                    onChange={handleMultipleImage}
                    multiple
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="inputGroupFileAddon04"
                    onClick={handleClick}
                  >
                    Add more
                    <input
                      type="file"
                      hidden
                      ref={inputRef}
                      onChange={handleMultipleImages}
                      multiple
                    />
                  </button>
                </div>
                }
                
                <div className="mt-3 d-flex align-items-center">
                  <b className="mb-0 me-5">
                    {urlPic && urlPic.id.length
                      ? `Selected ${userinfo.languages.length}`
                      : ""}
                  </b>
                  {
                    urlPic && urlPic.id.length && <button className="btn btn-danger" type="button" onClick={()=>{deletePicturesHandler()}}>Delete</button>
                  }
                
                </div>
                <div className="row mt-2 border border-1 p-2 rounded ">
                  <div
                    className="p-2 mt-3"
                    style={{ borderStyle: "dashed" }}
                    onPaste={handlePaste}
                  >
                    <p className="text-center">Drop Picture Here!</p>
                    <ImgPreview
                      show={modalShow}
                      img={imgShow}
                      onHide={() => {
                        setModalShow(false);
                      }}
                    />
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
                            sx={{color: 'white'}}
                          >
                            <WarningAmberIcon color="warning" />
                            Warning
                          </Typography>
                        </div>
                        <Typography
                          id="modal-modal-description"
                          sx={{ p: 2 }}
                        >
                          Are you sure to delete this picture?
                        </Typography>
                        <button className="btn btn-danger btn-sm ms-2 mb-2" onClick={deletePictureHandler}>Delete</button>
                      </Box>
                    </Modal>
                    <div className="row p-5">
                      {img &&
                        img.map((url, index) => {
                          return (
                            <div
                              className="col-sm-12 col-md-6 col-lg-4 col-xl-3"
                              key={index}
                            >
                              <Card style={{ margin: "10px" }}>
                                <div className="d-flex justify-content-center mt-1">
                                  <Card.Img
                                    onClick={() => {
                                      setModalShow(true);
                                      setImgShow("http://" + url.url);
                                    }}
                                    variant="top"
                                    style={{ cursor: "pointer" }}
                                    src={"http://" + url.url}
                                  />
                                </div>
                                <Card.Body>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      value={url.id}
                                      onChange={handleChangeCheckBox}
                                    />
                                    {/* <p className="ms-1 mb-0">Delete</p> */}
                                    <div
                                      onClick={() => {
                                        handleOpen(url);
                                      }}
                                    >
                                      { permission &&
                                       <FontAwesomeIcon
                                      icon={faTrash}
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                    />
                                    }
                                  
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          );
                        })}
                      {images &&
                        images.map((url, index) => {
                          return (
                            <div
                              className="col-sm-12 col-md-6 col-lg-4 col-xl-3"
                              key={index}
                            >
                              <Card style={{ margin: "10px" }}>
                                <div className="d-flex justify-content-center mt-1">
                                  <Card.Img
                                    onClick={() => {
                                      setModalShow(true);
                                      setImgShow(url);
                                    }}
                                    variant="top"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    src={url}
                                  />
                                </div>
                                <Card.Body>
                                  <div className="d-flex justify-content-between">
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      style={{
                                        color: "red",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        handleRemove(index);
                                      }}
                                    />
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
              {
                permission && <div className="d-flex  mt-4 mb-3 justify-content-start">
                <button
                  type="submit"
                  class="btn btn-success me-3"
                  disabled={solu}
                >
                  Complete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={SaveHandler}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Delete
                </button>
              </div>
              }
              

              <div
                class="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        Warning!!!
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      Are you sure to delete this record?
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger"
                        onClick={deleteHandler}
                        data-bs-dismiss="modal"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

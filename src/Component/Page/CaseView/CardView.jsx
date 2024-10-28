import React, { useEffect, useRef } from "react";
import "./IssueStyle.css";
import logo from "../../assets/logoKts.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Select from "react-select";
import api from "../../context/api";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import checkPermissions from "../../context/PermissionFilter";
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

export default function CardView() {
  const navigate = useNavigate();
  const [date, setStartDate] = useState();
  const [card_type, setCard_type] = useState();
  const [serial_number, setSerialNumber] = useState();
  const [amount, setAmount] = useState();
  const [reason, setReason] = useState();
  const [caused_by, setCause_by] = useState();
  const [location, setLocation] = useState([]);
  const [card, setCard] = useState();
  const [file, setFile] = useState([]);
  const [tog, setTog] = useState(false);
  const [images, setImages] = useState([]);
  const [img, setImg] = useState([]);
  const [client, setClientId] = useState();
  const [errMsg, setErrMsg] = useState();
  const [imgShow, setImgShow] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [deletePicture, setDeletePicture] = useState(false);
  const [permission, setpermission] = useState(false);
  const permissionArr = JSON.parse(localStorage.getItem("userInfo"));
  const [urlPic, setUrlPic] = useState();
  const access = checkPermissions(permissionArr && permissionArr.Permissions, [
    "User",
  ]);
  const handleOpen = (url) => {
    setUrlPic(url);
    setDeletePicture(true);
  };
  const handleClose = () => {
    setDeletePicture(false);
    setUrlPic();
  };
  const { id } = useParams();
  const getCardbyid = async () => {
    const res = await api.get(`/api/card/${id}`);
    setCard(res.data);
    setClientId({ value: res.data.client.cid, label: res.data.client.name });
    setImg(res.data.cardAttachment);
  };

  const [language, setLanguage] = useState();
  const [check, setCheck] = useState();
  const [userinfo, setUserInfo] = useState({
    languages: [],
    response: [],
  });
  const getLocation = async () => {
    const res = await api.get(`/api/clients/`);
    setLocation(res.data);
  };
  useEffect(() => {
    getCardbyid();
    getLocation();
  }, []);
  useEffect(() => {
    if (
      card &&
      card.handler === JSON.parse(localStorage.getItem("userInfo")).name
    ) {
      setpermission(true);
    }
  }, [card && card.handler]);
  const deletePictureHandler = async () => {
    await api.put("/api/card/deletePic", [urlPic.id]);
    getCardbyid();
    handleClose();
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
  useEffect(() => {
    if (card) {
      setCard_type(card.cardType);
      setStartDate(updatedDateFormats(card.createdAt));
      setSerialNumber(card.serialNumber);
      setAmount(card.amount);
      setReason(card.reason);
      setCause_by(card.causedBy);
    }
  }, [card]);
  const nameLocation = [];
  location.map((e) => {
    nameLocation.push({ label: e.name, id: e.id });
  });

  const handleChangeCheckBox = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { languages } = userinfo;
    setCheck(checked);
    setLanguage(languages);

    // Case 1 : The user checks the box
    if (checked) {
      setUrlPic({
        id: [...languages, value],
      });
      setUserInfo({
        languages: [...languages, value],
        response: [...languages, value],
      });
    } else {
      setUrlPic({
        id: languages.filter((e) => e !== value),
      });
      setUserInfo({
        languages: languages.filter((e) => e !== value),
        response: languages.filter((e) => e !== value),
      });
    }
  };
  const deleteCardReportHandler = async () => {
    try {
      await api.delete(`/api/card/${id}`);
      navigate("/cardReport");
    } catch (e) {}
  };
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
  const inputRef = useRef(null);
  const handleClick = () => {
    inputRef.current.click();
  };
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
  file
    ? file.forEach((e) => {
        if (e.targetFilesObj) {
          e.targetFilesObj.map((e1) => {
            arrFile.push(e1);
          });
        } else {
          arrFile.push(e);
        }
      })
    : "";
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
  const info = {
    date: date,
    client: client && client.value,
    card_type: card_type,
    serial_number: serial_number,
    amount: amount,
    reason: reason,
    caused_by: caused_by,
  };
  const options = [];
  location.map((e) => {
    options.push({ value: e.cid, label: e.name });
  });

  if (client) {
    info.client = client.value;
  }
  const formData = new FormData();
  const submitHandler = async (e) => {
    e.preventDefault();
    arrFile &&
      arrFile.forEach((item) => {
        formData.append("file", item);
      });
    formData.append("date", info.date);
    formData.append("ClientId", info.client && info.client);
    formData.append("cardType", info.card_type);
    formData.append("serialNumber", info.serial_number);
    formData.append("amount", info.amount);
    formData.append("reason", info.reason);
    formData.append("causedBy", info.caused_by);
    {
      userinfo.languages.length !== 0 &&
        userinfo.languages.forEach((item) => {
          formData.append("delete_ids", item);
        });
    }

    try {
      await api.patch(`/api/card/${id}`, formData).then((res) => {});
      setErrMsg();
      getCardbyid();
      setFile([]);
      setImages();
      setUserInfo({
        languages: [],
        response: [],
      });
    } catch (e) {
      setErrMsg(e.response.data);
    }
  };
  return (
    <div className="container-fluid p-0 bg-light">
      <div className="bg-primary" style={{ height: "354px" }}>
        <p className="fs-4 fw-bolder text-light pt-4 ps-4">
          KTS Support Center
        </p>
      </div>
      <div
        className="d-flex justify-content-md-center"
        style={{ height: "100%" }}
      >
        <div className=" container bg-white px-5 py-4 mb-3">
          <div className="d-flex flex-column">
            <header>
              <div className="d-flex justify-content-start align-items-center">
                <div
                  style={{
                    height: "50px",
                    width: "50px",
                    marginRight: "16px",
                  }}
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
                ជំនួយផ្នែកបច្ចេកទេសទូទៅ (External IT Support & Internal IT
                Support)
              </span>
            </div>
            <span style={{ marginTop: "30px" }}>What can we help you?</span>
            <div className="w-100 sui d-flex align-items-center">
              <FontAwesomeIcon
                icon={faAddressCard}
                style={{ marginRight: "10px" }}
              />
              <span className="fw-bold text-primary">
                របាយការណ៏បណ្ណខូច ទូទាត់​ និងមិនទូទាត់
              </span>
            </div>
            <div className="mt-4"></div>
            <form
              action=""
              onSubmit={(e) => {
                submitHandler(e);
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col">
                    <label htmlFor="">Start Date: </label>
                    <input
                      required
                      disabled={!access}
                      type="date"
                      className="mt-1 me-4 form-control"
                      name="start_date"
                      value={date}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    />
                    <label className="mt-4" htmlFor="">
                      Client Location:{" "}
                    </label>
                    <Select
                      options={options}
                      value={client}
                      onChange={(e) => {
                        setClientId(e);
                      }}
                      isClearable={true}
                    />
                    <label className="mt-4" htmlFor="">
                      Choose type of Card:{" "}
                    </label>
                    <select
                      disabled={!access}
                      className="form-select"
                      required
                      aria-label="Default select example"
                      value={card_type}
                      onChange={(e) => {
                        setCard_type(e.target.value);
                      }}
                    >
                      <option disabled selected>
                        Select card
                      </option>
                      <option value="Registration_Certificate">
                        Registeration Certificate
                      </option>
                      <option value="Driving_License">
                        Driving License Card
                      </option>
                    </select>
                    <label className="mt-4" htmlFor="">
                      Serial Number:{" "}
                    </label>
                    <input
                      disabled={!access}
                      required
                      className="mt-1 me-4 form-control"
                      value={serial_number}
                      onChange={(e) => {
                        setSerialNumber(e.target.value);
                      }}
                    />
                    {errMsg ? (
                      errMsg.serial_number ? (
                        <p className="text-danger mb-0">
                          *{errMsg.serial_number[0]}
                        </p>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col">
                    <label htmlFor="">Amount of Card: </label>
                    <input
                      disabled={!access}
                      type="number"
                      required
                      className="mt-1 me-4 form-control"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                    <label htmlFor="" className="mt-4">
                      Reason:{" "}
                    </label>
                    <input
                      disabled={!access}
                      required
                      className="mt-1 me-4 form-control"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                      }}
                    />
                    <label htmlFor="" className="mt-4">
                      Cause by:{" "}
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      disabled={!access}
                      value={caused_by}
                      onChange={(e) => {
                        setCause_by(e.target.value);
                      }}
                    >
                      <option disabled selected>
                        Select causes
                      </option>
                      <option value="MACHINE">Machine</option>
                      <option value="USER">User</option>
                    </select>
                    <label htmlFor="" className="mt-4">
                      Author:{" "}
                    </label>
                    <input
                      disabled
                      className="mt-1 me-4 form-control"
                      value={card && card.handler}
                    />
                  </div>
                </div>
                {permission && (
                  <div style={{ marginTop: "20px" }}>
                    <span>ភ្ជាប់ឯកសារបន្ថែម</span>
                    <div class="input-group mt-2">
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
                        style={{ zIndex: 0 }}
                        type="button"
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
                  </div>
                )}

                <div className="mt-3 d-flex align-items-center">
                  <b className="mb-0 me-5">
                    {urlPic && urlPic.id.length
                      ? `Selected ${userinfo.languages.length}`
                      : ""}
                  </b>
                  {urlPic && urlPic.id.length && (
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => {
                        deletePicturesHandler();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div
                  className="p-2 mt-3"
                  style={{ borderStyle: "dashed" }}
                  onPaste={handlePaste}
                >
                  <ImgPreview
                    show={modalShow}
                    img={imgShow}
                    onHide={() => {
                      setModalShow(false);
                      setImgShow();
                    }}
                  />
                  <p className="text-center fs-5">Drop Picture Here!</p>
                  <div className="row mt-4 p-2 m-0">
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
                                {permission && (
                                  <div className="d-flex align-items-center justify-content-between">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      value={url.id}
                                      onChange={handleChangeCheckBox}
                                    />
                                    <div
                                      onClick={() => {
                                        handleOpen(url);
                                      }}
                                    >
                                      <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}
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
                                  style={{ cursor: "pointer" }}
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
                {permission && (
                  <div className="mt-3 d-flex justify-content-start">
                    <button
                      type="submit"
                      className="btn btn-primary me-3"
                      hidden={!access}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      hidden={!access}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </form>
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
                  onClick={deletePictureHandler}
                >
                  Delete
                </button>
              </Box>
            </Modal>
            <div
              className="modal fade"
              id="deleteModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="bg-danger d-flex">
                    <div className="m-2">
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        style={{ color: "white", fontSize: "20px" }}
                      />
                    </div>
                    <p className="m-2 text-white fs-6 fw-bold">Warning!!</p>
                  </div>
                  <div className="modal-body">
                    Are you sure to delete this Card Report with serial number{" "}
                    <b>{serial_number}</b> ?
                  </div>
                  <div className="modal-footer">
                    <button
                      data-bs-dismiss="modal"
                      type="button"
                      className="btn btn-danger"
                      onClick={deleteCardReportHandler}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

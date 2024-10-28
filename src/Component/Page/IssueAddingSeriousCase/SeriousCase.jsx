import React, { useEffect, useRef } from "react";
import "./IssueStyle.css";
import logo from "../../assets/logoKts.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import api from "../../context/api";
import ImgPreview from "../../../Utility/Model/ImgPreview";

export default function SeriousIssue() {
  const navigate = useNavigate();
  const [date, setStartDate] = useState();
  const [card_type, setCard_type] = useState();
  const [serial_number, setSerialNumber] = useState();
  const [amount, setAmount] = useState();
  const [reason, setReason] = useState();
  const [caused_by, setCause_by] = useState();
  const [location, setLocation] = useState();
  const [client, setClientId] = useState();
  const [errMsg, setErrMsg] = useState();
  const [file, setFile] = useState([]);
  const [tog, setTog] = useState(false);
  const [images, setImages] = useState();
  const [imgShow, setImgShow] = useState();
  const [modalShow, setModalShow] = useState(false);

  
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
        return prevFile ? [...prevFile,  targetFilesObj ] : targetFilesObj;
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
      return prevFile ? [...prevFile,  ...targetFilesObj ] : targetFilesObj;
    });
    setTog((prev) => !prev);
  };
  const handleMultipleImage = (evnt) => {
    const targetFiles = evnt.target.files;
    console.log(targetFiles)
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
    arrFile.map((file) => 
       selectedFiles.push(URL.createObjectURL(file))
    );
    setImages(selectedFiles);
  }, [tog]);  
 
  const handleRemove = (index) => {
    const newFile = arrFile.filter((items, i) => i !== index);
    const newImage = images.filter((items, i) => i !== index);
    setImages(newImage);
    setFile(newFile);
  };
  
  const getLocation = async () => {
    const res = await api.get("/api/clients/");
    setLocation(res.data);
  };
  
  useEffect(() => {
    getLocation();
  }, []);
  const nameLocation = [];
  if (location) {
    location.map((e) => {
      nameLocation.push({ label: e.name, id: e.cid });
    });
  }
  const handleAutocompleteChange = async (event, value) => {
    setClientId(value.id);
  };

  const formData = new FormData()
  arrFile && arrFile.map((item)=>{
    formData.append("file",item)
  })
  formData.append("date",date)
  formData.append("ClientId",client)
  formData.append("cardType",card_type)
  formData.append("serialNumber",serial_number)
  formData.append("amount",amount)
  formData.append("reason",reason)
  formData.append("causedBy",caused_by)
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/card/`, formData);
      navigate("/CardReport");
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
        <div className=" container bg-white px-5 py-4">
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
                  <div className="col-md-6">
                    <label htmlFor="">Date: </label>
                    <input
                      required
                      type="date"
                      className="mt-1 me-4 form-control"
                      name="start_date"
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    />
                    <label className="mt-4" htmlFor="">
                      Client Location:{" "}
                    </label>
                    <Autocomplete
                      disablePortal
                      onChange={handleAutocompleteChange}
                      id="combo-box-demo"
                      size="small"
                      value={client}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      options={nameLocation}
                      renderInput={(params) => (
                        <TextField required {...params} />
                      )}
                    />
                    <label className="mt-4" htmlFor="">
                      Choose type of Card:{" "}
                    </label>
                    <select
                      required
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => {
                        setCard_type(e.target.value);
                      }}
                    >
                      <option disabled selected>
                        Select card
                      </option>
                      <option value="Registration_Certificate">Registration Certificate</option>
                      <option value="Driving_License">Driving License</option>
                    </select>
                    {errMsg ? (
                      errMsg.card_type ? (
                        <p className="text-danger mb-0">
                          *{errMsg.card_type[0]}
                        </p>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                    <label className="mt-4" htmlFor="">
                      Serial Number:{" "}
                    </label>
                    <input
                      required
                      className="mt-1 me-4 form-control"
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
                  <div className="col-md-6">
                    <label htmlFor="">Amount of Card: </label>
                    <input
                      type="number"
                      required
                      className="mt-1 me-4 form-control"
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                    <label htmlFor="" className="mt-4">
                      Reason:{" "}
                    </label>
                    <input
                      required
                      className="mt-1 me-4 form-control"
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
                    {errMsg ? (
                      errMsg.caused_by ? (
                        <p className="text-danger">*{errMsg.caused_by[0]}</p>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                  </div>
                </div>
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
                <div
                  className="p-2 mt-3"
                  style={{ borderStyle: "dashed" }}
                  onPaste={handlePaste}
                >
                  <p className="text-center">Drop Picture Here!</p>
                  <ImgPreview show={modalShow} img={imgShow} onHide={()=>{setModalShow(false)}}/>
                  {images && (
                    <div className="row mt-4  p-2 m-0">
                      {images.map((url, index) => {
                        console.log(url)
                        return (
                          <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                          <Card
                            key={index}
                            style={{ margin: "5px" }}
                            
                          >
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
                  )}
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

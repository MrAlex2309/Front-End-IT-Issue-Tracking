import React from "react";
import "./IssueStyle.css";
import logo from "../../assets/logoKts.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import api from "../../context/api";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import ImgPreview from "../../../Utility/Model/ImgPreview";
export default function Issue() {
  let navigate = useNavigate();
  const [images, setImages] = useState([]);
  const issue_type = "EXTERNAL";
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState();
  const [title, setTitle] = useState("Issue Adding");
  const status = "OPEN";
  const [solution, setSolution] = useState();
  const [clients, setClients] = useState([]);
  const [file, setFile] = useState([]);
  const [client, setClient] = useState();
  const info = {
    issue_type,
    location,
    description,
    status,
    solution,
    client,
  };
  const [imgShow, setImgShow] = useState();
  const [modalShow, setModalShow] = useState(false);

  const inputRef = useRef(null);
  const handleClick = () => {
    inputRef.current.click();
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
    options.push({
      value: e.cid,
      label: e.name_en ? e.name + " - " + e.name_en : e.name,
    });
  });

  useEffect(() => {
    document.title = title;
  }, []);
  const onChangeHandler = (selectOption) => {
    setClient(selectOption);
  };
  const [tog, setTog] = useState(false);
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
  const formData = new FormData();
  arrFile &&
    arrFile.forEach((item) => {
      formData.append("files", item);
    });
  formData.append("issueType", info.issue_type);
  formData.append("location", info.location);
  formData.append("description", info.description);
  formData.append("status", info.status);
  formData.append("clientId", info.client ? info.client.value : "");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await api.post(`/api/issue/`, formData);
      navigate("/report");
    } catch (err) {
      console.log(err);
    }
  };

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
              <span>ជំនួយផ្នែកបច្ចេកទេសទូទៅ (Customers IT Support)</span>
            </div>
            <span style={{ marginTop: "30px" }}>What can we help you?</span>
            <div className="w-100 sui d-flex align-items-center">
              <FontAwesomeIcon
                icon={faScrewdriverWrench}
                style={{ marginRight: "10px" }}
              />
              <span className="fw-bold text-primary">
                ជំនួយការបច្ចេកទេសសំរាប់អតិថិជន
              </span>
            </div>
            <div className="mt-4"></div>
            <form
              action=""
              onSubmit={(e) => {
                submitHandler(e);
              }}
            >
              <div className="mt-4 z-1">
                <Select
                  options={options}
                  onChange={onChangeHandler}
                  isClearable={true}
                />
              </div>
              <div className="form-outline mt-4">
                <textarea
                  className="form-control"
                  id="textAreaExample1"
                  rows="4"
                  placeholder="Descript your problem"
                  name="probledescriptionmDetail"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  required
                ></textarea>
              </div>
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
                      return (
                        <div
                          key={index}
                          className="col-sm-12 col-md-6 col-lg-4 col-xl-3"
                        >
                          <Card style={{ margin: "5px" }}>
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

              <button type="submit" className="btn btn-primary mt-3 mb-3">
                Save
              </button>
              {/* Model */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

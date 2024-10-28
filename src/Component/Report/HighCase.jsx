import React, { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Link } from "react-router-dom";
import api from "../context/api";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import checkPermissions from "../context/PermissionFilter";
import ImgPreview from "../../Utility/Model/ImgPreview";

import Select from "react-select";

const Preview = (p) => {
  return (
    <Link to={`/CardReport/${p.data.id}`}>
      <FontAwesomeIcon icon={faEdit} />
    </Link>
  );
};

function HighCase() {
  const [rows, setRows] = useState([]);
  const gridRef = useRef();
  const [cardType, setCardType] = useState();
  const [search, setSearch] = useState();
  const [startDate, setStartDate] = useState("");
  const [cause, setCause] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [yearEmpty, setYearEmpty] = useState(false);
  const [show, setShow] = useState(false);
  const [months, setMonths] = useState();
  const [dates, setDates] = useState();
  const [year, setYear] = useState();
  const [filters, setFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [location, setLocation] = useState();
  const [client, setClient] = useState();
  const [date, setStartDates] = useState();
  const [card_type, setCard_type] = useState();
  const [caused_by, setCause_by] = useState();
  const [serial_number, setSerialNumber] = useState();
  const [endDate, setEndDate] = useState();
  const [amount, setAmount] = useState();
  const [reason, setReason] = useState();
  const [errMsg, setErrMsg] = useState();
  const [file, setFile] = useState([]);
  const [tog, setTog] = useState(false);
  const [images, setImages] = useState();
  const [clients, setClients] = useState([]);
  const [clientPost, setClientPost] = useState([]);
  const inputRef = useRef(null);
  const [imgShow, setImgShow] = useState();
  const [modalShow, setModalShow] = useState(false);
  const handleClick = () => {
    inputRef.current.click();
  };
  const handleCloseAdd = () => {
    setShowAdd(false);
    setAmount("");
    setCard_type("");
    setCause_by("");
    setClient("");
    setStartDates("");
    setReason("");
    setSerialNumber("");
    setFile();
    setImages();
  };
  const permissionArr = JSON.parse(localStorage.getItem("userInfo"));
  const access = checkPermissions(permissionArr && permissionArr.Permissions, [
    "User",
  ]);
  const handleShowAdd = () => setShowAdd(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);

    return debouncedValue;
  }
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
  const debouncedSearchTerm = useDebounce(search, 1500);
  const getCardReport = async () => {
    api
      .get(
        `/api/card/?${cardType ? "cardType=" + cardType : ""}${
          cause ? "&causedBy=" + cause : ""
        }${client ? "&client=" + client : ""}${
          startDate ? "&startDate=" + startDate : ""
        }${endDate ? "&endDate=" + endDate : ""}${
          debouncedSearchTerm ? "&reason=" + debouncedSearchTerm : ""
        }`
      )
      .then((res) => res.data)
      .then((response) => setRows(response));
  };
  useEffect(() => {
    getCardReport();
  }, [cardType, cause, debouncedSearchTerm, startDate, endDate, client]);
  const [column, setColumn] = useState([
    {
      headerName: "Date",
      field: "createdAt",

      maxWidth: 150,
      filter: "agDateColumnFilter",
      filterParams: {
        inRangeInclusive: true,
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }
          const dateParts = cellValue.split("-");
          const day = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const year = Number(dateParts[2]);
          const cellDate = new Date(day, month, year);
          if (cellDate < dateFromFilter) {
            return -1;
          } else if (cellDate > dateFromFilter) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "Name of Client",
      field: "client.name",
    },
    { headerName: "Type", field: "cardType" },
    { headerName: "Serial Number", field: "serialNumber" },
    {
      headerName: "Amount",
      field: "amount",
    },
    {
      headerName: "Reason",
      field: "reason",
      filterParams: {
        inRangeInclusive: true,
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }
          const dateParts = cellValue.split("-");
          const year = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const day = Number(dateParts[2]);
          const cellDate = new Date(year, month, day);
          if (cellDate < dateFromFilter) {
            return -1;
          } else if (cellDate > dateFromFilter) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: "Cause by",

      field: "causedBy",
    },
    {
      headerName: "Author",

      field: "handler",
    },
    { headerName: "Action", cellRenderer: Preview, maxWidth: 100 },
  ]);

  const onChangeHandler = (selectOption) => {
    setClientPost(selectOption && selectOption.id);
  };
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      minWidth: 100,
      flex: 1,
      filter: true,
      sortable: true,
      useValueFormatterForExport: true,
    };
  }, []);

  const updatedDateFormat = (prop) => {
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
  const updatedData = rows.map((item) => {
    return {
      ...item,
      createdAt: updatedDateFormat(item.createdAt),
      updated_at: updatedDateFormat(item.updated_at),
    };
  });

  const onBtExportIssue = async () => {
    try {
      const res = await api.get(
        `/api/card-report/export_excel/?date_from=${
          startDate ? startDate : ""
        }&date_to=${endDate ? endDate : ""}&card_type=${
          cardType ? cardType : ""
        }`,
        {
          responseType: "arraybuffer",
        }
      );
      const response = await res.data;
      const bol = new Blob([response], { type: res.type });
      const filename = res.headers
        .get("content-disposition")
        .split(";")
        .find((n) => n.includes("filename="))
        .replace("filename=", "")
        .trim();
      let url = window.URL.createObjectURL(bol);
      let a = document.createElement("a");
      a.href = url;
      a.setAttribute(
        "download",
        `${filename.substring(0, filename.length - 1)}`
      );
      document.body.appendChild(a);
      a.click();
      setYearEmpty(false);
      setIsEmpty(false);
      setEmpty(false);
      handleClose();
    } catch (e) {
      console.log(e);
    }
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
  const clearFilterhandler = () => {
    setStartDate("");
    setCardType("");
    setCause("");
    setFilters(false);
    setEndDate("");
  };
  useEffect(() => {
    if (startDate === "" && cardType === "" && cause === "") {
      setFilters(false);
    }
  }, [startDate, cardType, cause]);

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
    arrFile.map((item) => {
      formData.append("file", item);
    });
  formData.append("date", date);
  formData.append("ClientId", clientPost);
  formData.append("cardType", card_type);
  formData.append("serialNumber", serial_number);
  formData.append("amount", amount);
  formData.append("reason", reason);
  formData.append("causedBy", caused_by);
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/card/`, formData);
      handleCloseAdd();
      getCardReport();
      setErrMsg();
    } catch (e) {
      setErrMsg(e.response.data);
    }
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
  const optionFiltered = [];
  clients.map((e) => {
    options.push({ value: e.cid, label: e.name });
  });
  clients.map((e) => {
    optionFiltered.push({ value: e.name, label: e.name });
  });
  const onChangeHandlerFilter = (selectOption) => {
    setClient(selectOption && selectOption.value);
  };
  return (
    <div className="container-fluid p-0 bg-light w-100">
      <div className="bg-primary p-3">
        <h3 className="text-white mb-0">Card Report</h3>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary m-2"
          hidden={!access}
          onClick={handleShowAdd}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
          Add
        </button>
        {filters && (
          <div className="d-flex justify-content-end m-2">
            <div className="d-flex m-1">
              <p
                className="mb-0 rounded-start bg-danger text-white"
                style={{ fontSize: "13px", padding: "5px" }}
              >
                <FontAwesomeIcon icon={faFilter} />
              </p>
              <p
                className=" mb-0  bg-opacity-50"
                style={{
                  fontSize: "13px",
                  padding: "5px",
                  backgroundColor: "rgb(210, 210, 210)",
                }}
              >
                Clear your Filter
              </p>
              <b
                className="rounded-end cancel"
                style={{
                  fontSize: "13px",
                  padding: "5px",
                  backgroundColor: "rgb(210, 210, 210)",
                }}
                onClick={clearFilterhandler}
              >
                X
              </b>
            </div>
          </div>
        )}
      </div>
      <ImgPreview
        show={modalShow}
        img={imgShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
      <Modal
        show={showAdd}
        onHide={handleCloseAdd}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Card</Modal.Title>
        </Modal.Header>
        <form
          action=""
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <Modal.Body>
            <div className="container">
              <label htmlFor="">Date: </label>
              <input
                required
                type="date"
                className="mt-1 me-4 form-control"
                name="start_date"
                onChange={(e) => {
                  setStartDates(e.target.value);
                }}
              />
              <label className="mt-2" htmlFor="">
                Client Location:{" "}
              </label>
              <Select
                options={nameLocation}
                required
                isClearable={true}
                onChange={onChangeHandler}
              />
              <label className="mt-2" htmlFor="">
                Choose type of Card:{" "}
              </label>
              <select
                className="form-select"
                required
                aria-label="Default select example"
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
                <option value="Driving_License">Driving License</option>
              </select>
              {errMsg ? (
                errMsg.card_type ? (
                  <p className="text-danger mb-0">*{errMsg.card_type[0]}</p>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <label className="mt-2" htmlFor="">
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
                  <p className="text-danger mb-0">*{errMsg.serial_number[0]}</p>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
              <label className="mt-2" htmlFor="">
                Amount of Card:{" "}
              </label>
              <input
                type="number"
                required
                className="mt-1 me-4 form-control"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
              <label htmlFor="" className="mt-2">
                Reason:{" "}
              </label>
              <input
                required
                className="mt-1 me-4 form-control"
                onChange={(e) => {
                  setReason(e.target.value);
                }}
              />
              <label htmlFor="" className="mt-2">
                Cause by:{" "}
              </label>
              <select
                className="form-select"
                required
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
                {images && (
                  <div className="row mt-4  p-2 m-0">
                    {images.map((url, index) => {
                      return (
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                          <Card key={index} style={{ margin: "5px" }}>
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      <div
        // className="d-lg-flex justify-content-between align-items-center"
        style={{ margin: "25px 0px" }}
      >
        <div
          className="d-none d-sm-none d-md-none d-lg-block m-1"
          style={{ width: "40%" }}
        >
          <div className="input-group input-group-sm ">
            <span className="input-group-text" id="basic-addon1">
              @
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="d-block d-sm-block d-md-block d-lg-none w-75 m-1">
          <div className="input-group input-group-sm m-1 " style={{}}>
            <span className="input-group-text" id="basic-addon1">
              @
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="d-xl-flex">
          <div
            className="input-group input-group-sm m-1 "
            style={{ width: "200px" }}
          >
            <span className="input-group-text" id="basic-addon1">
              From
            </span>
            <input
              type="date"
              value={startDate}
              class="form-control"
              placeholder="Search..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                setFilters(true);
                setStartDate(e.target.value);
              }}
            />
          </div>
          <div
            className="input-group input-group-sm m-1"
            style={{ width: "200px" }}
          >
            <span className="input-group-text" id="basic-addon1">
              To
            </span>
            <input
              type="date"
              value={endDate}
              class="form-control"
              placeholder="Search..."
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={(e) => {
                setFilters(true);
                setEndDate(e.target.value);
              }}
            />
          </div>
          <div className="d-xl-flex align-items-center">
            <select
              className="form-select form-select-sm m-1"
              value={cardType}
              aria-label="Default select example"
              style={{ width: "200px" }}
              onChange={(e) => {
                setCardType(e.target.value);
                setFilters(true);
              }}
            >
              <option selected value="">
                select Card Type
              </option>
              <option value="Driving_License">Driving License</option>
              <option value="Registration_Certificate">
                Registeration Card
              </option>
            </select>
            <Select
              styles={{
                control: (baseStyle) => ({
                  ...baseStyle,
                  minHeight: "31px",
                  height: "31px",
                  width: "200px",
                }),
                input: (baseStyle) => ({
                  ...baseStyle,

                  height: "31px",
                  margin: "0px",
                }),
                valueContainer: (baseStyle) => ({
                  ...baseStyle,

                  height: "31px",
                  padding: "0px 8px",
                }),
                indicatorsContainer: (baseStyle) => ({
                  ...baseStyle,
                  height: "31px",
                }),
              }}
              options={optionFiltered}
              onChange={onChangeHandlerFilter}
              isClearable={true}
            />
            <select
              className="form-select form-select-sm m-1"
              value={cause}
              aria-label="Default select example"
              style={{ width: "150px" }}
              onChange={(e) => {
                setCause(e.target.value);
                setFilters(true);
              }}
            >
              <option selected value="">
                select Causes
              </option>
              <option value="USER">User</option>
              <option value="MACHINE">Machine</option>
            </select>
          </div>

          <Tooltip title="Export" arrow>
            <button className="btn btn-primary m-1" onClick={onBtExportIssue}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </Tooltip>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Export as Excel</Modal.Title>
        </Modal.Header>
        <form onSubmit={onBtExportIssue} action="">
          <Modal.Body>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={["DatePicker", "DatePicker", "DatePicker"]}
              >
                <DatePicker
                  disabled={empty || yearEmpty}
                  onChange={(e) => {
                    if (e) {
                      setDates(updatedDateFormats(e.$d));
                      setIsEmpty(true);
                    } else {
                      setIsEmpty(false);
                    }
                  }}
                  disableFuture={true}
                  label={'"year", "month" and "day"'}
                  views={["year", "month", "day"]}
                />

                <DatePicker
                  disabled={isEmpty}
                  label={'"month" and "year"'}
                  disableFuture={true}
                  views={["month", "year"]}
                  onChange={(e) => {
                    if (e) {
                      setYearEmpty(true);
                      setEmpty(true);
                      setMonths(e.$M + 1);
                      setYear(e.$y);
                    } else {
                      setYearEmpty(false);
                      setEmpty(false);
                    }
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Export
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div className="ag-theme-alpine" style={{ height: "81vh" }}>
        <AgGridReact
          rowData={updatedData}
          columnDefs={column}
          ref={gridRef}
          animateRows={true}
          defaultColDef={defaultColDef}
          paginationPageSize={15}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default HighCase;

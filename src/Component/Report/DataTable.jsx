import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect, useMemo, useRef } from "react";
import React from "react";
import "../Report/DataTable.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@mui/material";
import api from "../context/api";
import Button from "react-bootstrap/Button";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Card from "react-bootstrap/Card";
import ImgPreview from "../../Utility/Model/ImgPreview";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Pagination from '@mui/material/Pagination';

function DataTable() {
  const [datas, setDatas] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [filter, setFilter] = useState();
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState(false);
  const [page, setPage] = useState()
  const [pageApi, setPageApi] = useState()
  const [limit, setLimit] = useState(1)
  const [file, setFile] = useState([]);
  const [images, setImages] = useState([]);
  const [clients, setClients] = useState([]);
  const [issue_type, setIssueType] = useState();
  const [client, setClient] = useState();
  const [description, setDescription] = useState();
  const [showAdd, setShowAdd] = useState(false);
  const [issueTypeErrMsg, setIssueTypeErrMsg] = useState();
  const statuss = "OPEN";
  const inputRef = useRef();
  const [imgShow, setImgShow] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [tog, setTog] = useState(false);
  const [filterdClients, setFilterdClient] = useState();

  const handleClose = () => {
    setShow(false);
    setYearEmpty(false);
    setIsEmpty(false);
    setEmpty(false);
    setDatas();
    setMonths();
    setYear();
  };
  const handleClick = () => {
    inputRef.current.click();
  };
  const handleCloseAdd = () => {
    setShowAdd(false);
    setClient("");
    setIssueType("");
    setDescription("");
  };
  const handleShowAdd = () => setShowAdd(true);
  const changeBackGroun = (status)=>{
    if(status === 'DONE'){
      return 'green'
    } else if(status === 'PENDING'){
      return 'gray'
    } else return 'red'
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

  const onChangeHandlerFilter = (selectOption) => {
    setFilterdClient(selectOption && selectOption.value);
  };
  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      minWidth: 100,
      flex: 1,
      filter: true,
      sortable: true,
    };
  }, []);
  const paginationPageSizeSelector = useMemo(() => {
    return [15, 30, 50];
  }, []);

  const onGridReady = (params) => {
    api
      .get("/api/issue/")
      .then((res) => {
        setDatas(res.data.content);
      })
      .catch((err) => {
        console.error(err);
      });
  };
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
  const debouncedSearchTerm = useDebounce(filter, 1500);
  const debounceSearchClient = useDebounce(filterdClients, 1000);
  const fetchIssue = async () => {
    await api
      .get(
        `/api/issue/?${
          debounceSearchClient ? "client=" + debounceSearchClient : ""
        }${debouncedSearchTerm ? "&search=" + debouncedSearchTerm : ""}${status ? "&issueType=" + status : ""}${startDate ? "&startDate=" + startDate : ""}${endDate ? "&endDate=" + endDate : ""}${
          limit ? "&limit=" + limit : ""}${pageApi ? "&page=" + pageApi : ""}`
      )
      .then((res) => res.data)
      .then((ress) => {setDatas(ress.content)
        setPage(ress.totalElements)
      });
  };
  useEffect(() => {
    fetchIssue();
  }, [startDate, endDate, status, debouncedSearchTerm, debounceSearchClient, pageApi, limit]);

  const roundedNumber = Math.ceil(page / limit);
console.log(limit)
  const onBtExportIssue = async (e) => {
    if (startDate || endDate) {
      try {
        const res = await api.get(
          `/api/issues/export_excel/?date_from=${startDate}&date_to=${endDate}`,
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
    }
  };
  const clearFilterhandler = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    setFilters(false);
  };
  useEffect(() => {
    if (startDate === "" && endDate === "" && status === "") {
      setFilters(false);
    }
  }, [startDate, endDate, status]);
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

  const onChangeHandler = (selectOption) => {
    console.log(selectOption);
    setClient(selectOption);
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
  arrFile.forEach((item) => {
    formData.append("files", item);
  });
  formData.append("issueType", issue_type);
  formData.append("clientId", client ? client.value : "");
  formData.append("description", description);
  formData.append("status", statuss);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    await api
      .post("/api/issue/", formData)
      .then((e) => {
        if (e.status === 200 || e.status === 201) {
          handleCloseAdd();
          fetchIssue();
          setIssueTypeErrMsg();
        }
      })
      .catch((e) => setIssueTypeErrMsg(e.response.data.issue_type));
  };

  return (
    <div className="container-fluid p-0 w-100">
      <div className="bg-primary p-3">
        <h3 className="text-white mb-0">Cases Report</h3>
      </div>
      <div className="d-flex justify-content-between m-2">
        <button className="btn  btn-outline-primary " onClick={handleShowAdd}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
          Add
        </button>
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
            <Modal.Title> Adding Issue</Modal.Title>
          </Modal.Header>
          <form action="" onSubmit={onSubmitHandler}>
            <Modal.Body>
              <select
                class="form-select"
                value={issue_type}
                aria-label="Default select example"
                required
                onChange={(e) => {
                  setIssueType(e.target.value);
                }}
              >
                <option selected>Open this select menu</option>
                <option value="INTERNAL">Internal Issue</option>
                <option value="EXTERNAL">External Issue</option>
              </select>
              {issueTypeErrMsg && (
                <p className="text-danger">
                  *Please input type of your issue!!
                </p>
              )}
              <div className="mt-3"></div>
              <Select
                // defaultInputValue={client}
                required
                options={options}
                isClearable={true}
                onChange={onChangeHandler}
              />
              <div className="form-outline mt-3">
                <textarea
                  className="form-control"
                  id="textAreaExample1"
                  rows="4"
                  value={description}
                  placeholder="Descript your problem"
                  name="description"
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
                            <Card key={index} style={{ margin: "10px" }}>
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
              <Button type="submit" variant="primary">
                Add
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
        {filters && (
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
        )}
      </div>
      <div
        className="d-lg-flex justify-content-lg-between align-items-center"
        style={{ margin: "25px 0px" }}
      >
        <div
          className="d-none d-sm-none d-md-none d-lg-block m-1"
          style={{ width: "40%" }}
        >
          <div className="input-group input-group-sm">
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
                setFilter(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="d-block d-sm-block d-md-block d-lg-none w-75">
          <div className="input-group m-1">
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
                setFilter(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="d-md-flex align-items-center justify-content-between m-1">
          <div className="input-group input-group-sm" style={{}}>
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

          <div className="input-group input-group-sm m-1" style={{}}>
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

          <select
            className="form-select form-select-sm m-1"
            value={status}
            style={{}}
            onChange={(e) => {
              setStatus(e.target.value);
              setFilters(true);
            }}
          >
            <option selected value="">
              select status
            </option>
            <option value="INTERNAL">Internal Case</option>
            <option value="EXTERNAL">External Case</option>
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
          <Tooltip title="Export" arrow>
            <button
              hidden={!startDate && !endDate}
              type="button"
              className="btn btn-primary m-1"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              data-bs-title="Tooltip on top"
              onClick={onBtExportIssue}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* <div className="ag-theme-alpine" style={{ height: "700px" }}>
        <AgGridReact
          rowData={updatedData}
          columnDefs={columns}
          // ref={gridRef}
          paginationPageSize={15}
          animateRows={true}
          paginationPageSizeSelector={paginationPageSizeSelector}
          defaultColDef={defaultColDef}
          pagination={true}
          onGridReady={onGridReady}
        />
      </div> */}
      <div className="">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Date</th>
              <th scope="col">Client</th>
              <th scope="col">Problem</th>
              <th scope="col">Solution</th>
              <th scope="col">Type</th>
              <th scope="col">Handler</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {datas &&
              datas.map((value, index) => {
                return (
                  <tr key={index}>
                    <th
                      style={{ fontSize: "14px", textDecoration: "none" }}
                      scope="row"
                    >
                      <Link to={`/report/Detail/${value.id}`}>
                        {value.issue_code}
                      </Link>
                    </th>

                    <td style={{ fontSize: "14px" }}>
                      {updatedDateFormats(value.create_at)}
                    </td>
                    <td style={{ fontSize: "14px" }}>{value.client.name}</td>
                    <td style={{ fontSize: "14px" }}>{value.description}</td>
                    <td style={{ fontSize: "14px" }}>{value.solution}</td>
                    <td style={{ fontSize: "14px" }}>{value.issue_type}</td>
                    <td style={{ fontSize: "14px" }}>{value.creator}</td>
                    <td style={{ fontSize: "12px",}}>
                      <p className="mb-0 rounded text-center" style={{ backgroundColor: changeBackGroun(value.status), color:'white', fontWeight:'bold' }}>
                      {value.status}
                      </p>
                      
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Pagination count={roundedNumber}  onChange={(e, value) => setPageApi(value-1)}/>
    </div>
  );
}

export default DataTable;

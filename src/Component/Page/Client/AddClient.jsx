import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faTriangleExclamation,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import api from "../../context/api";
import Pagination from "@mui/material/Pagination";
import ModalClient from "./ModalClient";
function AddClient() {
  const [dat, setDat] = useState();
  const [dats, setDats] = useState([]);
  const [title, setTitle] = useState();
  const [nameEn, setNameEn] = useState()
  const [binCode, setBinCode] = useState();
  const [id, setId] = useState();
  const [plus, setPlus] = useState(0);
  const [pluss, setPluss] = useState(0);
  const [getPageAmount, setGetPageAmount] = useState();
  const [page, setPage] = useState(10);
  const [limit, setLimit] = useState(page);
  const [offset, setOffset] = useState(0);
  const [res, setRes] = useState([]);
  const [errorMsg, setErrorMsg] = useState();
  const [apiPath, setApiPath] = useState(
    `/api/clients/`
  );
  const [rowEdit, setRowEdit] = useState();
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [valid, setValid] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloses = () => setEditShow(false);
  const handleShows = (e) => {
    setEditShow(true);
    setRowEdit(e);
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
  const debouncedSearchTerm = useDebounce(search, 1500);
  const fetchData = async () => {
    await api
      .get(`${apiPath}`)
      .then((res) => res.data)
      .then((ress) => setDat(ress));
    setId("");
    setBinCode("");
    setTitle("");
  };
  const handleClickOpen = (e) => {
    setTitle(e.name);
    setBinCode(e.code);
    setId(e.id);
  };
  useEffect(() => {
    setLimit(page);
  }, [page]);
  useEffect(() => {
    setApiPath(
      `/api/clients/?limit=${limit}&offset=${offset}&search=${debouncedSearchTerm}`
    );
  }, [offset, limit, debouncedSearchTerm]);
  useEffect(() => {
    fetchData();
  }, [apiPath, plus]);
  useEffect(() => {
    if (dat) {
      setDats(dat.results);
      setGetPageAmount(dat.count);
    }
  }, [dat]);
  const patchClientHandler = async (e, data) => {
    e.preventDefault();
    try {
      await api.patch(`/api/clients/${data.id}/`, {
        code: data.binCode,
        name: data.title,
        name_en:data.nameEn
      });
      setPlus(plus + 1);
      setValid(false)
      handleCloses();
    } catch (e) {
      if (e) {
        setValid(true)
        setRes(e.response.data);
      }
    }
  };
  const deleteClientHandler = async () => {
    await api.delete(`/api/clients/${id}/`);
    setPlus(plus + 1);
  };
  const AddClientHandler = async (e, data) => {
    e.preventDefault();
    try {
      await api.post("/api/clients/", {
        code: data.binCode,
        name: data.title,
      });
      setBinCode("");
      setTitle("");
      setNameEn("")
      setPluss(pluss + 1);
      setPlus(plus + 1);
      handleClose();
      setValid(false)
    } catch (e) {
      if (e) {
        setValid(true)
        setRes(e.response.data);
      }
    }
  };
  useEffect(() => {
    if (res.code) {
      setErrorMsg(res.code[0]);
    }
  }, [res]);
  const roundedNumber = Math.ceil(getPageAmount / limit);
  return (
    <div>
      <h5 className="p-4 bg-primary text-white">Client Management</h5>
      <div className="container-fluid">
        <div className="d-flex justify-content-between">
            <div className="input-group m-3" style={{width:'50%'}}>
              <span className="input-group-text" id="basic-addon1">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                type="text"
                className="form-control btn-small"
                placeholder="Client"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </div>
          <button
            type="button"
            className="btn btn-primary m-3"
            onClick={handleShow}
          >
            Add Client
          </button>
          <ModalClient
            show={show}
            onHide={handleClose}
            onAddClient={AddClientHandler}
            binCodes={binCode}
            titles={title}
            pluss={pluss}
            res={errorMsg}
            nameEns={nameEn}
            valid={valid}
            name="Add Client"
            buttonu="Add"
            updateCheck={setValid}
          />
          <div
            className="modal fade"
            id="actionBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
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
                  Are you sure to delete this client <b>{title}</b> ?
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary m-2"
                    data-bs-dismiss="modal"
                    onClick={() => {
                      setId();
                      setBinCode();
                      setTitle();
                    }}
                  >
                    Close
                  </button>
                  <button
                    data-bs-dismiss="modal"
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={deleteClientHandler}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <table className="table table-bordered">
            <thead>
              <tr className="table-dark text-center">
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Name in Englis</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {dat &&
                dat.map((row, index) => (
                  <tr className="text-center" key={index}>
                    <td>{row.cid}</td>
                    <td>{row.code}</td>
                    <td>{row.name}</td>
                    <td className="fs-6">
                      <div>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ marginRight: "20px", cursor: "pointer" }}
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Edit"
                          onClick={() => {
                            handleShows(row);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: "red", cursor: "pointer" }}
                          data-bs-toggle="modal"
                          data-bs-target="#actionBackdrop"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Delete"
                          onClick={() => {
                            handleClickOpen(row);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <ModalClient
            show={editShow}
            onHide={handleCloses}
            onAddClient={patchClientHandler}
            nameEns={nameEn}
            binCodes={binCode}
            titles={title}
            pluss={pluss}
            editRow={rowEdit}
            res={errorMsg}
            valid={valid}
            buttonu="Update"
            updateCheck={setValid}
            name="Edit Client"
          />
        </div>
        <div className="d-flex align-items-center justify-content-end m-2">
          <p className="m-2">Row per page</p>
          <select
            className="form-select"
            style={{ width: "70px" }}
            onChange={(e) => {
              setPage(e.target.value);
            }}
          >
            <option defaultValue="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <Pagination
            count={roundedNumber}
            shape="rounded"
            onChange={(e, value) => {
              const values = value - 1;
              const offsets = limit;
              setOffset(offsets * values);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AddClient;

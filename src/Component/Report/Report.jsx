import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useState, useEffect, useMemo, useRef } from "react";
import React from "react";
import "../Report/DataTable.css";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import api from "../context/api";

const Preview = (p) => {
  return <Link to={`/report/Detail/${p.data.id}`}>
    <p><b>{p.data.issue_code}</b></p>
  </Link>;
};

function DataTable() {
  const [datas, setDatas] = useState([]);
  const [gridApi, setGridApi] = useState();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("Report")

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
    let s = `${day}/${month}/${year}`;
    return s;
  };
  const gridRef = useRef();
  const columns = [
    { headerName: "No", field: "issue_code", cellRenderer: Preview },
    { headerName: "Loaction", field: "location", minWidth: 150, filter: 'agTextColumnFilter' },
    { headerName: "Problem", field: "description" },
    {
      headerName: "Reporter",
      field: "creator",
      filter: "agMultiColumnFilter",
      filterParams: {
        excelMode: "windows",
      },
    },
    { headerName: "Option", field:"issue_type" },
     { headerName: "Status", 
   
    field: 'status', 
    cellRenderer: p=>{
      if(p.data.status === "DONE"){
        
            return <span class="badge bg-success">{p.data.status}</span>
          } else if(p.data.status === "OPEN") {
            return <span class="badge bg-danger">{p.data.status}</span>
          }
          else if(p.data.status === "PENDING") {
            return <span class="badge bg-secondary">{p.data.status}</span>
          }
      },
      filter: 'agTextColumnFilter' 
    },
    {
      headerName: "Start Date",
      field: "created_at",
      filter: "agDateColumnFilter",
      filterParams: {
        inRangeInclusive: true,
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }
          const dateParts = cellValue.split("/");
          const day = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const year = Number(dateParts[2]);
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
      headerName: "End Date",
      field: "updated_at",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (dateFromFilter, cellValue) => {
          if (cellValue == null) {
            return 0;
          }

          const dateParts = cellValue.split("/");
          const day = Number(dateParts[0]);
          const month = Number(dateParts[1]) - 1;
          const year = Number(dateParts[2]);
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
    
  ];

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      minWidth: 100,
      flex: 1,
      filter: true,
      sortable: true,
    };
  }, []);

  const onBtExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);
  const onGridReady = (params) => {
    setGridApi(params);
        api
        .get(`/api/issues/`)
        .then((res) => {
          setDatas(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
  };
  
  const StartDateHandler=(event)=>{    
    setStartDate(event.target.value)    
  }
  const EndDateHandler = async(event)=>{
    setEndDate(event.target.value)
  }
  useEffect(()=>{
    document.title = title
  },[])
  useEffect(()=>{
    if(startDate && endDate==''){
      api.get(`/api/issues/?min_created=${startDate}`)
        .then(res=>setDatas(res.data))

    }
    else if(startDate && endDate){
      api.get(`/api/issues/?min_created=${startDate}&max_created=${endDate}`)
        .then(res=>setDatas(res.data))

    }    
  },[startDate, endDate])

  const updatedData = datas.map((item) => {
    return {
      ...item,
      created_at: updatedDateFormat(item.created_at),
      updated_at: updatedDateFormat(item.updated_at),
    };
  });

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setQuickFilter(
      document.getElementById("filter-text-box").value
    );
  }, []);

  return (
    <div className="container-fluid p-0 bg-light w-100">
      <div className="mt-4">
        <h1 className="text-center">All Issue</h1>
      </div>
      <div className="d-flex justify-content-end mt-2 mb-2 me-5 align-items-center">
        <div className="filterInput">
          <FontAwesomeIcon icon={faFilter} />
          <input
            type="text"
            id="filter-text-box"
            style={{ fontFamily: "Font Awesome 5 Free", fontWeight: "700px" }}
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
            className="FilterSearch"
          ></input>
        </div>
        <button onClick={onBtExport} className="ms-2">
          <span className="me-2">Export</span>
          <FontAwesomeIcon icon={faFileExport} />
        </button>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: "87vh", width: "100%", marginTop: "30px" }}
      >
        <div className="filter d-flex justify-content-md-end align-items-md-baseline">
          <p className="fs-6 me-2">From : </p>
          <input
            type="date"                                                                 
            className="me-4 pt- pb-1"                                                                                                            
            onChange={(event) => {              
              StartDateHandler(event)
            }}
          />
          <p className="fs-6 me-2">To :</p>
          <input
            type="date"
            className="me-4 pt- pb-1" 
            onChange={(e) => {
              EndDateHandler(e)
            }}                                                                      
          />
        </div>
        <br />
        <AgGridReact
          ref={gridRef}
          rowData={updatedData}
          columnDefs={columns}
          animateRows={true}
          defaultColDef={defaultColDef}
          paginationAutoPageSize={true}
          pagination={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default DataTable;

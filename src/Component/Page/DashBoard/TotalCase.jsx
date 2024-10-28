import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../context/api";

function TotalCase() {
  const urlGetCount = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}/api/issues/count_issues/`
  const [count, setCount] = useState({});
  const getCount = async() =>{
    const countRow = await api.get(urlGetCount)
    const res = await countRow.data;
   setCount(res)
  }
  useEffect(()=>{
    getCount()
  },[])
  return (
    <div
      className="w-100 border border-2 rounded "
      style={{ padding: "10px 5px", marginTop: "" }}
    >
      <div className="d-flex justify-content-center mb-4">
        <h3>Total Case</h3>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-center w-100" style={{borderRight: '6px solid grey'}}>
          <div className="d-flex flex-column align-item-center">
              <h4 className="text-center">{count.all_issues}</h4>
              <span>Case Complete</span>
          </div>
        </div>
        <div className="d-flex justify-content-center w-100">
          <div className="d-flex flex-column align-item-center">
              <h4 className="text-center">{count.closed_issues}</h4>
              <span>Case In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TotalCase;

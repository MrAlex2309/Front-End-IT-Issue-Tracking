import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import IssuePieChart from "./IssuePieChart";
import CardChart from "./CardChart";
import IssueChart from "./IssueChart";
import {
  Chart,
  LinearScale,
  CategoryScale,
  BarElement,
  Legend,
  Title,
  Tooltip,
} from "chart.js";

Chart.register(LinearScale, CategoryScale, BarElement, Legend, Title, Tooltip);

function MainDash() {
  return (
    <div
      className="container-fluid"
      style={{
        height: "100%",

        paddingBottom: "50px",
      }}
    >
      <h3 className="text-center pt-4 mb-5">
        Welcome to Issue Tracking System
      </h3>
      <div
        className="container p-3 mb-4"
        // style={{ backgroundColor: "#f8f9fa" }}
      >
        
        <div className=" border border-1 shadow">
        <h3 className="m-2">Dashboard</h3>
          <BarChart />
        </div>
        <div className="row mt-4">
          <div className="col-xl-4 col-lg-8 ">
            <div className="border border-1 m-1 shadow">
              <h3 className="text-center p-3">Issue Condition</h3>
              <IssueChart />
            </div>
          </div>
          <div className="col-xl-4 col-lg-4">
            <div className="border border-1 m-1 shadow">
              <h3 className="text-center p-3 ">Issue Total</h3>
              <div className="d-flex justify-content-center" style={{marginBottom:'50px'}}>
                <IssuePieChart />
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="border border-1 m-1 shadow">
              <h3 className="text-center p-3">Card Condition</h3>
              <CardChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MainDash;

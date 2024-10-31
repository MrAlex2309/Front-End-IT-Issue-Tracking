import * as React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../../context/api";
import { useState, useEffect } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function IssuePieChart() {
    const [issues, setIssues] = useState([])
    const [internalIssue, setInternalIssue] = useState()
    const [externalIssue, setExternalIssue] = useState()
    const getIssue = async()=>{
        await api.get('api/issue/').then(res=>res.data).then(ress=>setIssues(ress))
    }
    useEffect(()=>{
        getIssue()
    },[])
    const internal = issues.filter(issues=>issues.issue_type==="INTERNAL")
    const external = issues.filter(issues=>issues.issue_type==="EXTERNAL")
    useEffect(()=>{
        setInternalIssue(internal.length)
        setExternalIssue(external.length)
    },[internal, external])
  const data = {
    labels: ["Internal", "External"],
    datasets: [
      {
        label: "Case",
        data: [internalIssue, externalIssue],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div style={{height:"250px"}}>
      <Pie data={data}/>
    </div>
  );
}

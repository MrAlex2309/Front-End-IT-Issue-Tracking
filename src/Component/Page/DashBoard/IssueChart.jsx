import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useEffect } from 'react';
import api from '../../context/api';


export default function IssueChart() {
    const [internalPending, setInternalPending] = useState([])
    const [externalPending, setExternalPending] = useState([])
    const [internalByComplete, setInternalByComplete] = useState([])
    const [internalByPending, setInternalByPending] = useState()
    const [externalByComplete, setExternalByComplete] = useState([])
    const [externalByPening, setExternalByPending] = useState()
    const getIssueInternalbyComplete=async()=>{
        await api.get('/api/issue/?issueType=INTERNAL&status=DONE').then(res=>res.data).then(ress=>setInternalByComplete(ress.content))
    }
    const getIssueExternalbyComplete = async()=>{
        await api.get('/api/issue/?issueType=EXTERNAL&status=DONE').then(res=>res.data).then(ress=>setExternalByComplete(ress.content))
    }
    const getIssueInternalbyPending=async()=>{
        await api.get('/api/issue/?issueType=INTERNAL').then(res=>res.data).then(ress=>setInternalPending(ress.content))
    }
    const getIssueExternalbyPending=async()=>{
        await api.get('/api/issue/?issueType=EXTERNAL').then(res=>res.data).then(ress=>setExternalPending(ress.content))
    }
    useEffect(()=>{
        getIssueExternalbyComplete()
        getIssueInternalbyComplete()
        getIssueInternalbyPending()
        getIssueExternalbyPending()
    },[])
    const internalPend = internalPending.filter(issue=>issue.status==="PENDING")
    const internalOpen = internalPending.filter(issue=>issue.status==="OPEN")

    const externalPend = externalPending.filter(issue=>issue.status==="PENDING")
    const externalOpen = externalPending.filter(issue=>issue.status==="OPEN")
useEffect(()=>{
    setInternalByPending(internalOpen.length+internalPend.length)
    setExternalByPending(externalPend.length+externalOpen.length)
},[internalPend,internalOpen,externalPend,externalOpen])
const internal = [internalByComplete.length, internalByPending];
const external = [externalByComplete.length, externalByPening];
const xLabels = [
  'Complete',
  'Inprogress',
];
  return (
    <BarChart
      height={300}
      series={[
        { data: internal, label: 'Internal', id: 'internalId' },
        { data: external, label: 'External', id: 'externalId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band',categoryGapRatio: 0.4,
      barGapRatio: 0.4 }]}
    />
  );
}
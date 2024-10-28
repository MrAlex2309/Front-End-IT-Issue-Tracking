import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useEffect } from 'react';
import api from '../../context/api';


export default function CardChart() {

const [card, setCard] = useState([])
const [DLuser, setDLuser] = useState()
const [DLmachine, setDLmachine] = useState()
const [RCuser, setRCuser] = useState()
const [RCmachine, setRCmachine] = useState()

 const AllCard=async()=>{
  await api.get('api/card/').then(res=>res.data).then(ress=>setCard(ress))
 }
 useEffect(()=>{
  AllCard()
 },[])
 const dluser = card.filter(card=>card.cardType==="Driving_License"&&card.causedBy==="USER")
 const dlmachine = card.filter(card=>card.cardType==="Driving_License"&&card.causedBy==="MACHINE")
 const rcuser = card.filter(card=>card.cardType==="Registration_Certificate"&&card.causedBy==="USER")
 const rcmachine = card.filter(card=>card.cardType==="Registration_Certificate"&&card.causedBy==="MACHINE")
 useEffect(()=>{
  setDLuser(dluser.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0))
  setDLmachine(dlmachine.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0))
  setRCuser(rcuser.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0))
  setRCmachine(rcmachine.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0))
 },[dluser,dlmachine,rcuser,rcmachine])

 const dl = [DLuser,DLmachine]
 const rc = [RCuser,RCmachine]
 const xLabels = [
  'USER',
  'MACHINE',
];
 return (
    <BarChart
      height={300}
      series={[
        { data: dl, label: 'Driving License', id: 'dlId' },
        { data: rc, label: 'Registeration Certificate', id: 'rcId' },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band',categoryGapRatio: 0.4,
      barGapRatio: 0.4 }]}
    />
  );
}
import React, { useState } from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import api from '../../context/api'
import { useEffect } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

function BarChart() {
  const reporter = []
  const [datas, setDatas] = useState([])
  const getReporter = async () => {
    const response = await api.get('/api/issue/count')
    const data = response.data
    setDatas(data)
  }
  useEffect(()=>{
    getReporter()
  },[])

  datas && datas.map((value, index)=>{
    reporter.push(value.firstName+" "+value.lastName)
  })
   const loadData = []
  datas.forEach(item=>{loadData.push(item.counts)})
  const data = {
        labels: reporter,
        updateMode:"resize",
        datasets: [
          {
            label: 'Cases',
            data: loadData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(204, 204, 255, 0.2)',
              'rgba(255, 204, 229, 0.2)'

            ],
            borderColor: [
              'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(204, 204, 255)',
      'rgb(255, 204, 229)'

            ],
            borderWidth: 1,
            hoverOffset: 4,
            
          },
        ],
    }
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Issue Tracker",
        },
      },
    };

  return (
    <div className='w-75  m-auto'>
            <Bar data={data} options={options}/>
    </div>
  )
}

export default BarChart

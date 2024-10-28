import React, { useState } from 'react'
import pic from "../Content/IMG_0006.jpg"
import { Link } from 'react-router-dom'

function NavigationBar() {
    const [issueReport, setIssueReport] = useState(false)
    const [adding, setAdding] = useState(false)
    const [posting, setPosting] = useState(false)
    const style = 'text-white mb-0 me-5 text-decoration-none'
    const reportStyle = issueReport ? "translate(0px,-2px)" : ''
    const addingStyle = adding ? "translate(0px,-2px)" : ''
    const postingStyle = posting ? "translate(0px,-2px)" : ''
  return (
    <div className='container d-flex justify-content-between align-items-center p-2'>
        <h4 className='text-white mb-0'>
            IT Issue Tracker
        </h4>
        <div className='d-flex justify-content-between'>
            <Link className={style} style={{transform: reportStyle, transition:"transform 0.3s", cursor: 'pointer'}}  onMouseEnter={()=>{setIssueReport(true)}} onMouseLeave={()=>{setIssueReport(false)}} onClick={()=>{}}>
                Issue
            </Link>
            <Link className={style} style={{transform: addingStyle, transition:"transform 0.3s", cursor: 'pointer'}}  onMouseEnter={()=>{setAdding(true)}} onMouseLeave={()=>{setAdding(false)}} onClick={()=>{}}>
                Card
            </Link>
            <Link to="/home" className={style} style={{transform: postingStyle, transition:"transform 0.3s", cursor: 'pointer'}}  onMouseEnter={()=>{setPosting(true)}} onMouseLeave={()=>{setPosting(false)}} onClick={()=>{}}>
                Post
            </Link>
        </div>
        <div className='d-flex align-items-center'>
            <img className='img-fluid' style={{width:"40px", borderRadius:"50%"}} src={pic} alt="" />
            <p className='mb-0 text-white d-none d-sm-none d-md-block' style={{marginLeft:"10px"}}>Songheak Chanratanak</p>
        </div>
    </div>
  )
}

export default NavigationBar
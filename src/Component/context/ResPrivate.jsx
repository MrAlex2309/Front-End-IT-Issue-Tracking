import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan } from '@fortawesome/free-solid-svg-icons'
function ResPrivate() {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center' style={{height:'100vh'}}>
      <div className='text-secondary' style={{fontSize:'100px'}}><FontAwesomeIcon icon={faBan} /></div>
      <div className='text-secondary fs-1'>
        
      You cannot access this site!!
      </div>
    </div>
  )
}

export default ResPrivate
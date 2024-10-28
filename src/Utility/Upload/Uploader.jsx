import React from 'react'
import { useState } from 'react'
import '../Upload/uploader.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowDown, faFile, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

function Uploader(props) {
  const [image, setImage]=useState(null)
  const [filename, setFileName] = useState("No selected file")
  useEffect(()=>{
    props.onImage(filename)
  },[filename])
  // console.log(filename)

  return (
    <main className='d-flex flex-column'>
      <form className='Con-Image' onClick={()=>document.querySelector(".input-field").click()}>
        <input type="file" accept='image/*' className='input-field' hidden onChange= {({target: {files}})=>{
          files[0] && setFileName(files[0].name)
          if(files){
            setImage(URL.createObjectURL(files[0]))            
          }
          
        }}/>
        {image ? <img src={image} height={290} width={490} /> : <FontAwesomeIcon icon={faCloudArrowDown} color='#1475cf' style={{fontSize: '60px'}}/>}
      </form>
      <section className='mt-2 d-flex justify-content-between align-item-center p-3 rounded-3'>
        <FontAwesomeIcon icon={faFile} style={{fontSize: '18px'}} color='#1475cf'/>
        <span>
            {filename} - <FontAwesomeIcon icon={faTrash} style={{fontSize: '18px', cursor: 'pointer'}} color='red' onClick={()=>{
                setImage(null)
                setFileName('No selected file')
            }}/>
            
        </span>
      </section>
    </main>
  )
}


export default Uploader

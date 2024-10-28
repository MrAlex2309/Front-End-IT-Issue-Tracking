import React from 'react'
import Modal from "react-bootstrap/Modal";

function ImgPreview(props) {
  return (
    <div>
        <Modal
        {...props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Body className="bg-secondary p-1">
                      <img src={props.img} className="img-fluid w-100" />
                    </Modal.Body>
                    
                  </Modal>
    </div>
  )
}

export default ImgPreview
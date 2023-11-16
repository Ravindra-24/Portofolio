import React, { useState } from 'react'
import './Modal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

export default function Modal({ modal, setModal, pdfUrl, setSelectedPDF }) {

  const toggleModal = () => {
    setModal(!modal)
    setSelectedPDF(null)
  }

  if (modal === true) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2 className="pdf-title">{pdfUrl.title}</h2>
            <img src={pdfUrl.image} alt={pdfUrl.title} />

            <button className="close-modal" onClick={toggleModal}>
              <FontAwesomeIcon icon={faClose} style={{ color: '#4FEFFF' }} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

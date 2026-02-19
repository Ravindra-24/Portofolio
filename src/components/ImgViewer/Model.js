import React, { useEffect } from 'react'
import './Modal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'

export default function Modal({ modal, setModal, pdfUrl, setSelectedPDF }) {
  const toggleModal = () => {
    setModal(!modal)
    setSelectedPDF(null)
  }

  useEffect(() => {
    document.body.classList.toggle('active-modal', modal)

    return () => {
      document.body.classList.remove('active-modal')
    }
  }, [modal])

  return (
    <>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="pdf-title">{pdfUrl.name}</h2>
              <button className="close-modal" onClick={toggleModal}>
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
            <div className="modal-body">
              <img src={pdfUrl.image} alt={pdfUrl.name} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

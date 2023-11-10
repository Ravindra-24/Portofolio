import React, { useState } from "react";
import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import PdfViewer from "../pdfModal/pdf";

export default function Modal({modal, setModal, pdfUrl}) {
  // const [modal, setModal] = useState(false);


  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal === true) {
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
            <h2>{pdfUrl.title}</h2>
            <PdfViewer pdfUrl={pdfUrl}/>
            <button className="close-modal" onClick={toggleModal}>
              <FontAwesomeIcon icon={faClose} style={{color:"#4FEFFF"}}/>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
import React, { useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './pdf.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBackward,
  faForward,
} from '@fortawesome/free-solid-svg-icons'

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [error, setError] = useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function onError(error) {
    setError(error)
  }

  return (
    <div className="pdf-viewer">
      {error && <div>Error: {error.message}</div>}
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onError={onError}
      >
        <Page pageNumber={pageNumber} width={580} height={600} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button
        className="backword-btn"
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        <span>
          <FontAwesomeIcon icon={faBackward} /> Previous
        </span>
      </button>
      <button
        className="forword-btn"
        disabled={pageNumber >= numPages}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        <span>
          Next <FontAwesomeIcon icon={faForward} />
        </span>
      </button>
    </div>
  )
}

export default PdfViewer

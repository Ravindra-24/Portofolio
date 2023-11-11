import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Modal from '../PdfViewer/Modal/Model'
import { devtown, google, other } from './Data'

import '../PdfViewer/Modal/Modal.css'

const Certificates = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [modal, setModal] = useState(false)
  const [selectedPDF, setSelectedPDF] = useState(null)

  const toggleModal = (pdf) => {
    setSelectedPDF(pdf)
    setModal(!modal)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const renderPortfolio = (devtown, google, other) => {
    return (
      <>
        <div className="images-container">
          <h2 className="heading">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Full Stack Web Development'.split('')}
              idx={10}
            />
          </h2>
          {devtown.map((pdf) => (
            <div key={pdf.id} className="image-box">
              <img
                src={pdf.image}
                alt={pdf.title}
                className="portfolio-image"
              />
              <div className="content">
                <h3 className="title">{pdf.title}</h3>
                <button className="btn" onClick={() => toggleModal(pdf)}>
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="images-container">
          <h2 className="heading">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Google Project Management'.split('')}
              idx={10}
            />
          </h2>
          {google.map((pdf) => (
            <div key={pdf.id} className="image-box">
              <img
                src={pdf.image}
                alt={pdf.title}
                className="portfolio-image"
              />
              <div className="content">
                <h3 className="title">{pdf.title}</h3>
                <button className="btn" onClick={() => toggleModal(pdf)}>
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="images-container">
          <h2 className="heading">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Other Certifications'.split('')}
              idx={10}
            />
          </h2>
          {other.map((pdf) => (
            <div key={pdf.id} className="image-box">
              <img
                src={pdf.image}
                alt={pdf.title}
                className="portfolio-image"
              />
              <div className="content">
                <h3 className="title">{pdf.title}</h3>
                <button className="btn" onClick={() => toggleModal(pdf)}>
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container certificate-page">
        <h1 className="page-title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Certificates'.split('')}
            idx={15}
          />
        </h1>
        <div className="portfolio-container">
          {renderPortfolio(devtown, google, other)}
        </div>
      </div>
      {modal && (
        <Modal
          modal={modal}
          setModal={setModal}
          pdfUrl={selectedPDF}
          setSelectedPDF={setSelectedPDF}
        />
      )}
      <Loader type="pacman" />
    </>
  )
}

export default Certificates

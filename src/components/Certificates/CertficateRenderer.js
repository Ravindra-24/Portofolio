import React, { useEffect, useState } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const CertficateRenderer = (
  webCertificates,
  googleCertificates,
  otherCertificates,
  modal,
  setModal,
  setSelectedPDF
) => {

  const [letterClass, setLetterClass] = useState('text-animate')

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

  return (
    <>
      <div className="images-container">
        <h2 className="heading">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Full Stack Development'.split('')}
            idx={10}
          />
        </h2>
        {webCertificates.map((pdf) => (
          <div key={pdf.id} className="image-box">
            <img src={pdf.image} alt={pdf.name} className="portfolio-image" />
            <div className="content">
              <p className="title">{pdf.name}</p>
              <h4 className="description">{pdf.description}</h4>
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
        {googleCertificates.map((pdf) => (
          <div key={pdf.id} className="image-box">
            <img src={pdf.image} alt={pdf.name} className="portfolio-image" />
            <div className="content">
            <p className="title">{pdf.name}</p>
              <h4 className="description">{pdf.description}</h4>
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
        {otherCertificates.map((pdf) => (
          <div key={pdf.id} className="image-box">
            <img src={pdf.image} alt={pdf.name} className="portfolio-image" />
            <div className="content">
            <p className="title">{pdf.name}</p>
              <h4 className="description">{pdf.description}</h4>
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

export default CertficateRenderer

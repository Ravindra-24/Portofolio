import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import Modal from '../PdfViewer/Modal/Model'
import devtown from '../../data/Certificates_Devtown.pdf'
import googleCertificate1 from '../../data/Foundations of Project Management_1_certficate.pdf'
import googleCertificate2 from '../../data/Project Initiation Starting a Successful Project_2_certificate.pdf'
import googleCertificate3 from '../../data/Putting_it_all_together_Chapter_3.pdf'
import googleCertificate4 from '../../data/Project Execution Running the Project_Chapter_4.pdf'
import googleCertificate5 from '../../data/Agile Project Management_Chapter_5.pdf'
import sap from '../../data/SAP.pdf'
import nullClass from '../../data/certificate_NullClass.pdf'

import devtownImg from '../../assets/images/pdf/Course_Completion_certificate_page-0001.jpg'
import googleCertificate1Img from '../../assets/images/pdf/Foundations of Project Management_1_certficate_page-0001.jpg'
import googleCertificate2Img from '../../assets/images/pdf/Project Initiation Starting a Successful Project_2_certificate_page-0001.jpg'
import googleCertificate3Img from '../../assets/images/pdf/Putting_it_all_together_Chapter_3_page-0001.jpg'
import googleCertificate4Img from '../../assets/images/pdf/Project Execution Running the Project_Chapter_4_page-0001.jpg'
import googleCertificate5Img from '../../assets/images/pdf/Agile Project Management_Chapter_5_page-0001.jpg'
import nullClassImg from '../../assets/images/pdf/nullClassImg.jpg'
import SAPImg from '../../assets/images/pdf/SAP.jpg'

import '../PdfViewer/Modal/Modal.css'

const Certificates = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [portfolio, setPortfolio] = useState([
    {
      id: 1,
      title: 'Devtown Internship',
      image: devtownImg,
      url: devtown,
      github: '',
    },
    {
      id: 2,
      title: 'Foundations of Project Management',
      image: googleCertificate1Img,
      url: googleCertificate1,
      github: '',
    },
    {
      id: 3,
      title: 'Project Initiation Starting a Successful Project',
      image: googleCertificate2Img,
      url: googleCertificate2,
      github: '',
    },
    {
      id: 4,
      title: 'Putting_it_all_together',
      image: googleCertificate3Img,
      url: googleCertificate3,
      github: '',
    },
    {
      id: 5,
      title: 'Project Execution Running the Project',
      image: googleCertificate4Img,
      url: googleCertificate4,
      github: '',
    },
    {
      id: 6,
      title: 'Agile Project Management',
      image: googleCertificate5Img,
      url: googleCertificate5,
      github: '',
    },
    {
      id: 7,
      title: 'Foundations of Project Management',
      image: nullClassImg,
      url: nullClass,
      github: '',
    },
    {
      id: 8,
      title: 'SAP Training',
      image: SAPImg,
      url: sap,
      github: '',
    },
  ])
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

  const renderPortfolio = (portfolio) => {
    return (
      <>
        <div className="images-container">
          {portfolio.map((pdf) => (
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
      <div className="container portfolio-page">
        <h1 className="page-title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Certificates'.split('')}
            idx={15}
          />
        </h1>
        <div className="portfolio-container">{renderPortfolio(portfolio)}</div>
      </div>
      {modal && (
        <Modal modal={modal} setModal={setModal} pdfUrl={selectedPDF} />
      )}
      <Loader type="pacman" />
    </>
  )
}

export default Certificates

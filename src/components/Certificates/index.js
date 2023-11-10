import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Modal from '../PdfViewer/Modal/Model'

import devtownCourese from '../../assets/images/pdf/Course_Completion_certificate_page-0001.jpg'
import devtownTaining from '../../assets/images/pdf/Training_Completion_Certificate_page-0001.jpg'
import devtownLor from '../../assets/images/pdf/LOR_page-0001.jpg'
import devtownInternship from '../../assets/images/pdf/Internship_Completion_certificate_page-0001.jpg'
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
      title: 'Devtown Course',
      image: devtownCourese,
      url:"" ,
      github: '',
    },
    {
      id: 2,
      title: 'Devtown Taining',
      image: devtownTaining,
      url:"" ,
      github: '',
    },
    {
      id: 3,
      title: 'Devtown Internship',
      image: devtownInternship,
      url:"" ,
      github: '',
    },
    {
      id: 4,
      title: 'Devtown LOR',
      image: devtownLor,
      url:"" ,
      github: '',
    },
    {
      id: 5,
      title: 'Foundations of Project Management',
      image: googleCertificate1Img,
      url:"" ,
      github: '',
    },
    {
      id: 6,
      title: 'Project Initiation',
      image: googleCertificate2Img,
      url: "",
      github: '',
    },
    {
      id: 7,
      title: 'Putting it all together',
      image: googleCertificate3Img,
      url: "",
      github: '',
    },
    {
      id: 8,
      title: 'Project Execution',
      image: googleCertificate4Img,
      url: "",
      github: '',
    },
    {
      id: 9,
      title: 'Agile Project Management',
      image: googleCertificate5Img,
      url: "",
      github: '',
    },
    {
      id: 10,
      title: 'MERN Stack Course',
      image: nullClassImg,
      url: "",
      github: '',
    },
    {
      id: 10,
      title: 'SAP Training',
      image: SAPImg,
      url: "",
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
      <div className="container certificate-page">
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
        <Modal modal={modal} setModal={setModal} pdfUrl={selectedPDF} setSelectedPDF={setSelectedPDF}/>
      )}
      <Loader type="pacman" />
    </>
  )
}

export default Certificates

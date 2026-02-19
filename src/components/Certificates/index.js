import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'
import Modal from '../ImgViewer/Model'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import CertficateRenderer from './CertficateRenderer'

const Certificates = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [modal, setModal] = useState(false)
  const [selectedPDF, setSelectedPDF] = useState(null)
  const [webCertificates, setWebCertificates] = useState([])
  const [googleCertificates, setGoogleCertificates] = useState([])
  const [otherCertificates, setOtherCertificates] = useState([])
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    getCertficate()
  }, [])

  const getCertficate = async () => {
    try {
      const webCert = await getDocs(
        collection(db, 'Web Development Certificates')
      )
      setWebCertificates(webCert.docs.map((doc) => ({ id: doc.id, ...doc.data() })))

      const googleCert = await getDocs(collection(db, 'Google Certificates'))
      setGoogleCertificates(
        googleCert.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )

      const otherCert = await getDocs(collection(db, 'Other Certificates'))
      setOtherCertificates(
        otherCert.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )

      setFetchError('')
    } catch (error) {
      setWebCertificates([])
      setGoogleCertificates([])
      setOtherCertificates([])
      setFetchError('Certificates are currently unavailable.')
    }
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
          <CertficateRenderer
            webCertificates={webCertificates}
            googleCertificates={googleCertificates}
            otherCertificates={otherCertificates}
            setModal={setModal}
            setSelectedPDF={setSelectedPDF}
          />
        </div>
        {fetchError && <p>{fetchError}</p>}
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

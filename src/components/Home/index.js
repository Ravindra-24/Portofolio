import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import LogoTitle from '../../assets/images/logo-r.png'
import Logo from './Logo'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import './index.scss'
import { useSiteContent } from '../../hooks/usePortfolioData'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [selectedPDF, setSelectedPDF] = useState('')
  const [cvError, setCvError] = useState('')
  const { content, migrated, loading, error } = useSiteContent()

  const displayName = content.home?.name || 'Ravindra'
  const usesLogoInitial = displayName.toLowerCase().startsWith('r')
  const nameArray = (usesLogoInitial ? displayName.slice(1) : displayName).split('')
  const jobArray = (content.home?.role || 'web developer.').split('')
  const finalLetterIndex = Math.max(
    14,
    15 + nameArray.length - 1,
    22 + jobArray.length - 1
  )

  useEffect(() => {
    setLetterClass('text-animate')
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, (finalLetterIndex / 10 + 1) * 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [finalLetterIndex])

  useEffect(() => {
    if (loading) return
    if (migrated) {
      setSelectedPDF(content.cv?.fileUrl || '')
      setCvError(error)
    } else {
      getCV()
    }
  }, [content.cv?.fileUrl, error, loading, migrated])

  const getCV = async () => {
    try {
      const CV = await getDocs(collection(db, 'CV'))
      const firstResume = CV.docs[0]?.data()
      setSelectedPDF(firstResume?.image || '')
    } catch (error) {
      setSelectedPDF('')
      setCvError('CV is currently unavailable.')
    }
  }

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>
            <span className={letterClass}>H</span>
            <span className={`${letterClass} _12`}>i,</span>
            <br />
            <span className={`${letterClass} _13`}>I</span>
            <span className={`${letterClass} _14`}>'m</span>
            {usesLogoInitial && (
              <img
                src={LogoTitle}
                alt=""
              />
            )}
            <AnimatedLetters
              letterClass={letterClass}
              strArray={nameArray}
              idx={15}
            />
            <br />
            <AnimatedLetters
              letterClass={letterClass}
              strArray={jobArray}
              idx={22}
            />
          </h1>
          <h2>{content.home?.tagline}</h2>
          <div className="btns">
            <Link to="/contact" className="flat-button">
              CONTACT ME
            </Link>

            {selectedPDF ? (
              <a
                className="cv-button"
                href={selectedPDF}
                target="_blank"
                rel="noreferrer"
              >
                DOWNLOAD CV
              </a>
            ) : (
              <button type="button" className="cv-button" disabled>
                DOWNLOAD CV
              </button>
            )}
          </div>
          {cvError && <p>{cvError}</p>}
        </div>
        <Logo />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home

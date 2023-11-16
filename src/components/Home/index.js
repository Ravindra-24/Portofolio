import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import LogoTitle from '../../assets/images/logo-r.png'
import Logo from './Logo'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../../firebase'
import './index.scss'

const Home = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [selectedPDF, setSelectedPDF] = useState([])

  const nameArray = ['a', 'v', 'i', 'n', 'd', 'r', 'a']
  const jobArray = [
    'w',
    'e',
    'b',
    ' ',
    'd',
    'e',
    'v',
    'e',
    'l',
    'o',
    'p',
    'e',
    'r',
    '.',
  ]

  useEffect(() => {
    return setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 4000)
  }, [])

  useEffect(() => {
    getCV()
  }, [])

  const getCV = async () => {
    const CV = await getDocs(collection(db, 'CV'))
    const resume = CV.docs.map((doc) => doc.data())
    setSelectedPDF(resume[0].image)
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
            <img
              src={LogoTitle}
              alt="JavaScript Developer Name, Web Developer Name"
            />
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
          <h2>Full Stack Web Development / React.JS / MERN-Stack</h2>
          <div className="btns">
            <Link to="/contact" className="flat-button">
              CONTACT ME
            </Link>

            <a
              className="cv-button"
              href={selectedPDF}
              target="_blank"
              rel="noreferrer"
              // download={selectedPDF.image}
            >
              DOWNLOAD CV
            </a>
          </div>
        </div>
        <Logo />
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Home

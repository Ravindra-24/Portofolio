import { useEffect, useState } from 'react'
import {
  faCss3,
  faGithub,
  faHtml5,
  faJsSquare,
  faNode,
  faReact,
} from '@fortawesome/free-brands-svg-icons'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.scss'

const About = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

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
      <div className="container about-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['A', 'b', 'o', 'u', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <p>
            I'm a <span className="font-bold">Software Developer</span> at{' '}
            <span className="font-bold">PRIC Technology Private Limited</span>{' '}
            with expertise in <span className="font-bold">Next.js, React, Firebase, and Google Cloud Functions</span>. I implement features for the core product including Sessions, Events, Courses, Telegram group subscriptions, and user-facing modules like Booking pages, Account management with purchase history, form editing, and Ticket transfer functionality. I also built an advanced{' '}
            <span className="font-bold">Event QR Scanning System</span> with real-time analytics, activity-based ticket validation, and Bluetooth printing capabilities.
          </p>
          <p align="LEFT">
            Previously, I contributed to <span className="font-bold">Xpatris</span>, a sponsored college project, working on authentication and admin modules. With a{' '}
            <span className="font-bold">B.Tech from MIT Aurangabad (2023)</span> and a Diploma from Government Polytechnic Jalna, I'm driven by building robust, user-centric solutions that solve real-world problems and create lasting impact.
          </p>
        </div>

        <div className="stage-cube-cont">
          <div className="cubespinner">
            <div className="face1">
              <FontAwesomeIcon icon={faNode} color="#DD0031" />
            </div>
            <div className="face2">
              <FontAwesomeIcon icon={faHtml5} color="#F06529" />
            </div>
            <div className="face3">
              <FontAwesomeIcon icon={faCss3} color="#28A4D9" />
            </div>
            <div className="face4">
              <FontAwesomeIcon icon={faReact} color="#5ED4F4" />
            </div>
            <div className="face5">
              <FontAwesomeIcon icon={faJsSquare} color="#EFD81D" />
            </div>
            <div className="face6">
              <FontAwesomeIcon icon={faGithub} color="#EC4D28" />
            </div>
          </div>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default About

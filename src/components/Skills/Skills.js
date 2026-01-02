import React, { useEffect, useState } from 'react'
import './Skills.scss'
import AnimatedLetters from '../AnimatedLetters'
import Loader from 'react-loaders'
import TagCloud from 'TagCloud'

const container = '.content'
const texts = [
  'ReactJS',
  'NextJS',
  'JavaScript',
  'CSS3',
  'Html',
  'NodeJS',
  'ExpressJS',
  'MongoDB',
  'Redux',
  'Firebase',
  'jwt',
  'Babel',
  'Webpack',
  'aws ec2',
  'CI/CD pipeline',
  'aws s3',
]
const options = {
  radius: 300,
  // animation speed
  // slow, normal, fast
  maxSpeed: 'fast',
  initSpeed: 'fast',
  // 0 = top
  // 90 = left
  // 135 = right-bottom
  direction: 135,
  // interact with cursor move on mouse out
  keep: true,
}

const Skills = () => {
  const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    TagCloud(container, texts, options)
  },[])

  return (
    <>
      <div className="container skills-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Skills'.split('')}
              idx={15}
            />
          </h1>
          <p>
            I have strong front-end skills with <span className="font-bold">HTML, CSS</span>, and <span className="font-bold">JavaScript</span>, and extensive experience building interfaces with <span className="font-bold">React</span> and <span className="font-bold">Redux</span>. I build full-stack applications using the <span className="font-bold">MERN stack</span> and <span className="font-bold">Next.js</span>, and work with <span className="font-bold">Firebase</span> (Auth, Firestore, Storage) and <span className="font-bold">Google Cloud Functions</span> on the backend. I also use <span className="font-bold">Tailwind CSS</span> and <span className="font-bold">React-Bootstrap</span> for UI, and follow CI/CD and testing practices to ensure reliability.
          </p>
          <p align="LEFT">
            At PRIC Technology I implemented many product features including booking pages, account management, Sessions, Events, Courses, ticket transfers and editable responses, Telegram group subscriptions, and real-time analytics dashboards. I also developed an Event QR Scanning System with instant analytics and activity-based ticket validation. I focused on performance, security, and usability.
          </p>
          <p align="LEFT">
            Visit my <span><a className="font-bold" style={{textDecoration: "underline"}} href="https://www.linkedin.com/in/ravindra-shrimant-pawar/" target="_blank" rel="noreferrer">LinkedIn</a></span> profile, or check my <span><a className="font-bold" style={{textDecoration: "underline"}} href="https://github.com/Ravindra-24" target="_blank" rel="noreferrer">GitHub</a></span> for projects and code samples.
          </p>
        </div>
        <div className="skills-container">
          <span className="content content-skills"></span>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Skills

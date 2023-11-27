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
            I honed my proficiency in front-end development technologies such as
            <span className="font-bold">HTML, CSS</span> and <span className="font-bold">JavaScript</span>. Library likes <span className="font-bold">ReactJS</span> and <span className="font-bold">Redux</span>, etc.
            Developed most of the projects using <span className="font-bold">MERN-Stack</span> and <span className="font-bold">Redux</span> for state management.
            During my final year Sponsored Project, I Worked on <span className="font-bold">NextJS</span>.
          </p>
          <p align="LEFT">
            Visit my <span ><a className="font-bold" style={{textDecoration:"underline"}} href='https://www.linkedin.com/in/ravindra-shrimant-pawar/' target='_blank' rel='noreferrer'>LinkedIn</a></span> profile and
            Also you can check out my{' '}
            <span >
              <a className="font-bold" style={{textDecoration:"underline"}} href='https://github.com/Ravindra-24' target='_blank' rel='noreferrer'>GitHub</a>
            </span>{' '}
            Profile.
          </p>
        </div>
        <div className="skills-container">
          <span className="content"></span>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Skills

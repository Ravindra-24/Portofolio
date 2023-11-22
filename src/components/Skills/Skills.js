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
  })

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
            I'm a highly motivated{' '}
            <span className="font-bold">Computer Science Graduate</span> with a
            CGPA of
            <span className="font-bold"> 8.65</span>, solid foundation in
            building software product with intuitive problem-solving skills.
            Proficient in Web development. Passionate about implementing and
            launching new projects. Ability to translate business requirements
            into technical solutions.
          </p>
          <p align="LEFT">
            I'm a very ambitious{' '}
            <span className="font-bold">Full Stack Web Developer,</span> looking
            for a role in an established IT company with the opportunity to
            start the career as an entry-level software engineer with a reputed
            firm driven by technology.
          </p>
        </div>
        <div className="skills-container">
        <span className='content'></span>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Skills

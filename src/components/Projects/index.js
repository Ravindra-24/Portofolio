import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

import projects from './data'

const Projects = () => {
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
      <div className="container projects-page">
        <h1 className="page-title">
          <AnimatedLetters
            letterClass={letterClass}
            strArray={'Projects'.split('')}
            idx={15}
          />
        </h1>
        <div className="projects-container">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              <img src={project.image} alt={project.name} />
              <h2>{project.name}</h2>
              <p className="skill-tag">{project.skills}</p>
              <p>{project.description}</p>
              <a
                className="card-btn"
                target="_blank"
                rel="noreferrer"
                href={project.github}
              >
                Open Repository
              </a>
              <a target="_blank" rel="noreferrer" href={project.url}>
                View Project
              </a>
            </div>
          ))}
        </div>
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Projects

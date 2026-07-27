import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

import { DEFAULT_PROJECTS } from '../../data/portfolioDefaults'
import { usePortfolioCollection } from '../../hooks/usePortfolioData'

const Projects = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const { data: projects, error } = usePortfolioCollection(
    'projects',
    DEFAULT_PROJECTS
  )

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
              <img src={project.imageUrl || project.image} alt={project.name} />
              <h2>{project.name}</h2>
              <p className="skill-tag">
                {Array.isArray(project.skills)
                  ? project.skills.join(', ')
                  : project.skills}
              </p>
              <p>{project.description}</p>
              {(project.githubUrl || project.github) && (
                <a
                  className="card-btn"
                  target="_blank"
                  rel="noreferrer"
                  href={project.githubUrl || project.github}
                >
                  Open Repository
                </a>
              )}
              {(project.websiteUrl || project.url) && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={project.websiteUrl || project.url}
                >
                  Open Website
                </a>
              )}
            </div>
          ))}
        </div>
        {error && <p>{error}</p>}
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Projects

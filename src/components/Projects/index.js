import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

import pinterest from '../../assets/images/projects/pinterest.jpeg'
import stackoverflow from '../../assets/images/projects/stackoverflow.jpeg'
import taskList from '../../assets/images/projects/task-list.jpeg'

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

  const projects = [
    {
      name: 'PinterestLike',
      description: 'This is the first project',
      image: pinterest,
      url: 'https://pinterest-clone-tau.vercel.app/',
    },
    {
      name: 'Stackoverflow Clone',
      description: 'This is the second project',
      image: stackoverflow,
      url: 'https://stackoverflow-clone-ravindra.vercel.app/',
    },
    {
      name: 'Task List',
      description: 'This is the third project',
      image: taskList,
      url: 'https://task-list-blue.vercel.app/',
    },
  ]

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
          {projects.map((project, index) => (
            <div className="project-card" key={index}>
              <img src={project.image} alt={project.name} />
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <a target='_blank' rel='noreferrer' href={project.url}>View Project</a>
            </div>
          ))}
        </div>
      </div>

      <Loader type="pacman" />
    </>
  )
}

export default Projects

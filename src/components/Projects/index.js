import React, { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

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
            name: 'Project 1',
            description: 'This is the first project',
            image: 'https://via.placeholder.com/150',
            url: 'https://www.example.com/project1'
        },
        {
            name: 'Project 2',
            description: 'This is the second project',
            image: 'https://via.placeholder.com/150',
            url: 'https://www.example.com/project2'
        },
        {
            name: 'Project 3',
            description: 'This is the third project',
            image: 'https://via.placeholder.com/150',
            url: 'https://www.example.com/project3'
        }
    ]

    return (
        <>
            <div className="container portfolio-page">
                <h1 className="text-zone">
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
                            <a href={project.url}>View Project</a>
                        </div>
                    ))}
                </div>
            </div>

            <Loader type="pacman" />
        </>
    )
}

export default Projects





import React, { useEffect, useState } from 'react';
import './Skills.scss';
import AnimatedLetters from '../AnimatedLetters';
import Loader from 'react-loaders';

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

    const skillsData = [
        {
            id: 1,
            skill: 'JavaScript',
            level: 'Intermediate',
        },
        {
            id: 2,
            skill: 'React',
            level: 'Intermediate',
        },
        {
            id: 3,
            skill: 'HTML',
            level: 'Advanced',
        },
        {
            id: 4,
            skill: 'CSS',
            level: 'Advanced',
        },
        {
            id: 5,
            skill: 'Node.js',
            level: 'Beginner',
        },
    ];

    return (
        <>
            <div className="container skills-page">
                <h1 className="page-title">
                    <AnimatedLetters
                        letterClass={letterClass}
                        strArray={'Skills'.split('')}
                        idx={15}
                    />
                </h1>
                <div className="skills-container">
                    <div className="skills-list">
                        {skillsData.map((skill) => (
                            <div className="skill-item" key={skill.id}>
                                <h2>{skill.skill}</h2>
                                <p>{skill.level}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Loader type="pacman" />
        </>
    );
};

export default Skills;

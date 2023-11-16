import React, { useEffect, useState } from 'react';
import './Education.scss';
import AnimatedLetters from '../AnimatedLetters';
import Loader from 'react-loaders';

const Education = () => {

    const [letterClass, setLetterClass] = useState('text-animate')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])


    const educationData = [
        {
            id: 1,
            institution: 'G. S. Mandal Maharashtra Institute of Technology, Chh. Sambhajinagar',
            degree: 'Bachelor of Technology in Computer Science and Engineering',
            dates: '2020 - 2023',
        },
        {
            id: 2,
            institution: 'Government Polytechnic, Jalna',
            degree: 'Diploma in Computer Engineering',
            dates: '2017 - 2020',
        },
    ];

    return (
        <>
        <div className="container education-page">
        <h1 className="page-title">
        <AnimatedLetters
          letterClass={letterClass}
          strArray={'Education'.split('')}
          idx={15}
        />
      </h1>
        <div className="education-container">
            <div className="education-list">
                {educationData.map((education) => (
                    <div className="education-item" key={education.id}>
                        <h2>{education.institution}</h2>
                        <p>{education.degree}</p>
                        <p>{education.dates}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
        <Loader type="pacman" />
        </>
    );
};

export default Education;

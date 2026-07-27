import React, { useEffect, useState } from 'react';
import './Education.scss';
import AnimatedLetters from '../AnimatedLetters';
import Loader from 'react-loaders';
import { DEFAULT_EDUCATION } from '../../data/portfolioDefaults';
import { usePortfolioCollection } from '../../hooks/usePortfolioData';

const Education = () => {

    const [letterClass, setLetterClass] = useState('text-animate')
    const { data: educationData, error } = usePortfolioCollection(
      'education',
      DEFAULT_EDUCATION
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
        {error && <p>{error}</p>}
        </div>
        <Loader type="pacman" />
        </>
    );
};

export default Education;

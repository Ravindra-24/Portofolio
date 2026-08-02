import React, { useEffect, useState } from 'react'
import './Education.scss'
import AnimatedLetters from '../AnimatedLetters'
import Loader from 'react-loaders'
import { DEFAULT_EDUCATION } from '../../data/portfolioDefaults'
import { usePortfolioCollection } from '../../hooks/usePortfolioData'

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
      <main className="container education-page">
        <header className="education-header">
          <span className="education-eyebrow">Academic background</span>
          <h1 className="page-title">
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Education'.split('')}
              idx={15}
            />
          </h1>
          <p className="education-intro">
            A foundation in computer science, software engineering, and
            practical problem-solving.
          </p>
        </header>

        <div className="education-container">
          <div className="education-list">
            {educationData.map((education, index) => (
              <article className="education-item" key={education.id}>
                <div className="education-marker" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="education-card">
                  <div className="education-card-topline">
                    <span className="education-label">Qualification</span>
                    <time>{education.dates}</time>
                  </div>
                  <h2>{education.degree}</h2>
                  <p className="institution">{education.institution}</p>
                  {education.grade && (
                    <p className="grade">{education.grade}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        {error && <p>{error}</p>}
      </main>
      <Loader type="pacman" />
    </>
  )
}

export default Education

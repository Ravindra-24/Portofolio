import './index.scss'
import { useState, useEffect } from 'react'
import AnimatedLetters from '../AnimatedLetters'
import Loader from 'react-loaders'
import { DEFAULT_EXPERIENCE } from '../../data/portfolioDefaults'
import { usePortfolioCollection } from '../../hooks/usePortfolioData'

// const CV_URL =
//   'https://firebasestorage.googleapis.com/v0/b/assignment-6e254.appspot.com/o/CV%2FRavindra_Pawar_7887975721.pdf?alt=media&token=3a752885-9754-45eb-9fe1-8aaaf07c5e57'

const Experience = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const { data: experienceData, error } = usePortfolioCollection(
    'experience',
    DEFAULT_EXPERIENCE
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
      <div className="container experience-page">
        <div className="experience-header">
          <h1 className='page-title'>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={'Experience'.split('')}
              idx={15}
            />
          </h1>
          {/* <a className="cv-download" href={CV_URL} target="_blank" rel="noreferrer">
            Download CV
          </a> */}
        </div>

      <div className="timeline">
        {experienceData.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-marker" />
            <div className="timeline-content">
              <div className="timeline-head">
                <h3 className="role">{item.title}</h3>
                <span className="company">@ {item.company}</span>
              </div>
              <div className="meta">
                {item.period || item.startEnd}
                {item.location ? ` • ${item.location}` : ''}
              </div>
              <ul className="bullets">
                {item.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
              {item.leavingReason && (
                <p className="leaving-reason">
                  <strong>Reason for leaving:</strong> {item.leavingReason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && <p>{error}</p>}
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Experience

import React, { useEffect, useMemo, useState } from 'react'
import './Skills.scss'
import AnimatedLetters from '../AnimatedLetters'
import Loader from 'react-loaders'
import TagCloud from 'TagCloud'
import {
  DEFAULT_SKILLS,
} from '../../data/portfolioDefaults'
import {
  usePortfolioCollection,
  useSiteContent,
} from '../../hooks/usePortfolioData'

const container = '.content'
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
  const { data: skillEntries } = usePortfolioCollection(
    'skills',
    DEFAULT_SKILLS
  )
  const { content, error } = useSiteContent()
  const texts = useMemo(
    () => skillEntries.map((skill) => skill.name),
    [skillEntries]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!texts.length) return undefined
    const tagCloud = TagCloud(container, texts, options)
    return () => {
      if (Array.isArray(tagCloud)) {
        tagCloud.forEach((instance) => instance?.destroy?.())
      } else {
        tagCloud?.destroy?.()
      }
    }
  }, [texts])

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
          {(content.skills?.paragraphs || []).map((paragraph, index) => (
            <p key={index} align={index ? 'LEFT' : undefined}>
              {paragraph}
            </p>
          ))}
          <p align="LEFT">
            Visit my <span><a className="font-bold" style={{textDecoration: "underline"}} href={content.social?.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a></span> profile, or check my <span><a className="font-bold" style={{textDecoration: "underline"}} href={content.social?.githubUrl} target="_blank" rel="noreferrer">GitHub</a></span> for projects and code samples.
          </p>
          {error && <p>{error}</p>}
        </div>
        <div className="skills-container">
          <span className="content content-skills"></span>
        </div>
      </div>
      <Loader type="pacman" />
    </>
  )
}

export default Skills

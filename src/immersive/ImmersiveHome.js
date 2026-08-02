import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SKILL_CATEGORY_OPTIONS } from '../data/portfolioDefaults'
import { useImmersiveData } from './data/ImmersiveDataContext'
import { useImmersiveMotion } from './motion/ImmersiveMotionContext'
import useRevealAnimations from './motion/useRevealAnimations'
import CertificateDialog from './components/CertificateDialog'
import ImmersiveContactForm from './components/ImmersiveContactForm'

const PATH_TO_SECTION = {
  '/': 'home',
  '/about': 'about',
  '/experience': 'experience',
  '/education': 'education',
  '/skills': 'skills',
  '/project': 'project',
  '/certificate': 'certificate',
  '/contact': 'contact',
}

const NAV_ITEMS = [
  ['/project', 'Work'],
  ['/about', 'About'],
  ['/experience', 'Experience'],
  ['/contact', 'Contact'],
]

const getProjectImage = (project) => project.imageUrl || project.image

const isPlainClick = (event) =>
  (event.button === undefined || event.button === 0) &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

const ProjectVisual = ({ project }) => {
  const image = getProjectImage(project)
  return image ? (
    <img src={image} alt={`${project.name} project`} loading="lazy" decoding="async" />
  ) : (
    <div className="im-project-placeholder" role="img" aria-label={`${project.name} preview`}>
      <span>RP</span>
    </div>
  )
}

const ImmersiveHome = () => {
  const rootRef = useRef(null)
  const handledLocationKeyRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { lenis, reducedMotion, coarsePointer, transitionTo } = useImmersiveMotion()
  const {
    content,
    projects,
    experience,
    education,
    skills,
    certificates,
    loading,
    error,
  } = useImmersiveData()
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  const skillGroups = useMemo(
    () =>
      SKILL_CATEGORY_OPTIONS.map((category) => ({
        ...category,
        skills: skills.filter(
          (skill) => (skill.category || 'other') === category.value
        ),
      })).filter((group) => group.skills.length),
    [skills]
  )

  useRevealAnimations(rootRef, loading)

  const scrollToSection = useCallback(
    (sectionId, immediate = false) => {
      const target = document.getElementById(`im-${sectionId}`)
      if (!target) return
      if (lenis) lenis.scrollTo(target, { offset: -32, immediate })
      else {
        target.scrollIntoView({
          behavior: immediate || reducedMotion ? 'auto' : 'smooth',
        })
      }
    },
    [lenis, reducedMotion]
  )

  useEffect(() => {
    if (!lenis && !reducedMotion && !coarsePointer) return
    if (handledLocationKeyRef.current === location.key) return

    const hasHandledLocation = handledLocationKeyRef.current !== null
    handledLocationKeyRef.current = location.key
    const savedPosition = window.sessionStorage.getItem('immersive:return-scroll')
    if (savedPosition && location.pathname === '/project') {
      window.sessionStorage.removeItem('immersive:return-scroll')
      const position = Number(savedPosition)
      const restoreFrame = requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(position, { immediate: true })
        else window.scrollTo(0, position)
      })
      return () => cancelAnimationFrame(restoreFrame)
    }

    const section = PATH_TO_SECTION[location.pathname] || 'home'
    let positionFrame
    const layoutFrame = requestAnimationFrame(() => {
      positionFrame = requestAnimationFrame(() =>
        scrollToSection(section, !hasHandledLocation)
      )
    })
    return () => {
      cancelAnimationFrame(layoutFrame)
      if (positionFrame) cancelAnimationFrame(positionFrame)
    }
  }, [coarsePointer, lenis, location.key, location.pathname, reducedMotion, scrollToSection])

  useEffect(() => {
    document.title = `${content.home?.name || 'Ravindra'} — Immersive Portfolio`
  }, [content.home?.name])

  const navigateToSection = (event, path) => {
    if (!isPlainClick(event)) return
    event.preventDefault()
    if (location.pathname === path) {
      scrollToSection(PATH_TO_SECTION[path])
      return
    }
    navigate(path)
  }

  const openProject = (event, project) => {
    if (!isPlainClick(event)) return
    event.preventDefault()
    window.sessionStorage.setItem('immersive:return-scroll', String(window.scrollY))
    transitionTo(() => navigate(`/project/${encodeURIComponent(project.id)}`))
  }

  const home = content.home || {}
  const contact = content.contact || {}

  return (
    <main className="im-main" ref={rootRef}>
      <header className="im-header">
        <Link to="/" className="im-wordmark" onClick={(event) => navigateToSection(event, '/')}>
          RP<span>®</span>
        </Link>
        <nav aria-label="Immersive portfolio">
          {NAV_ITEMS.map(([path, label]) => (
            <Link key={path} to={path} onClick={(event) => navigateToSection(event, path)}>
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="im-hero" id="im-home" aria-labelledby="im-hero-title">
        <div className="im-hero__meta im-reveal">
          <span>Software developer</span>
          <span>{contact.location || 'Pune, India'}</span>
        </div>
        <div className="im-hero__copy">
          <p className="im-kicker im-reveal">Portfolio / 2026</p>
          <h1 id="im-hero-title" className="im-reveal">
            I build digital
            <span>experiences with intent.</span>
          </h1>
          <div className="im-hero__bottom im-reveal">
            <p>{home.tagline}</p>
            <div className="im-hero__actions">
              <Link to="/project" onClick={(event) => navigateToSection(event, '/project')}>
                Explore selected work <span aria-hidden="true">↘</span>
              </Link>
              {content.cv?.fileUrl ? (
                <a
                  href={content.cv.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={content.cv.fileName || 'Ravindra-Pawar-CV.pdf'}
                >
                  Download CV <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <button type="button" disabled title="Upload a CV from the dashboard to enable this action">
                  Download CV <span aria-hidden="true">↓</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="im-scroll-cue" aria-hidden="true">
          <span /> Scroll to discover
        </div>
      </section>

      <section className="im-projects" id="im-project" aria-labelledby="im-project-title">
        <div className="im-section-heading im-reveal">
          <p className="im-kicker">01 / Selected work</p>
          <h2 id="im-project-title">Projects that turn complexity into clarity.</h2>
        </div>
        <p className="im-project-swipe-cue" aria-hidden="true">Swipe to explore ↔</p>
        <div className="im-project-track">
          {projects.map((project, index) => (
            <article className="im-project-card im-reveal" key={project.id}>
              <Link
                to={`/project/${encodeURIComponent(project.id)}`}
                onClick={(event) => openProject(event, project)}
                aria-label={`View ${project.name} case study`}
              >
                <div className="im-project-card__visual">
                  <ProjectVisual project={project} />
                  <span className="im-project-card__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="im-project-card__copy">
                  <div className="im-project-card__title">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                  <p className="im-project-card__stack">
                    {Array.isArray(project.skills)
                      ? project.skills.slice(0, 4).join(' · ')
                      : project.skills}
                  </p>
                  <span aria-hidden="true">View case study ↗</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="im-about im-pad" id="im-about" aria-labelledby="im-about-title">
        <div className="im-section-index im-reveal">02 / Profile</div>
        <div className="im-about__content">
          <h2 id="im-about-title" className="im-reveal">
            Engineering with a designer’s eye and a product mindset.
          </h2>
          <div className="im-about__body im-reveal">
            {(content.about?.paragraphs || []).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="im-skills im-pad" id="im-skills" aria-labelledby="im-skills-title">
        <div className="im-section-heading im-reveal">
          <p className="im-kicker">03 / Capabilities</p>
          <h2 id="im-skills-title">Tools are temporary. Craft is cumulative.</h2>
        </div>
        <div className="im-skill-grid">
          {skillGroups.map((group) => (
            <article className="im-skill-group im-reveal" key={group.value}>
              <h3>{group.label}</h3>
              <ul>
                {group.skills.map((skill) => <li key={skill.id}>{skill.name}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="im-history im-pad" id="im-experience" aria-labelledby="im-experience-title">
        <div className="im-section-heading im-reveal">
          <p className="im-kicker">04 / Experience</p>
          <h2 id="im-experience-title">Building products that work in the real world.</h2>
        </div>
        <div className="im-history-list">
          {experience.map((item, index) => (
            <article className="im-history-item im-reveal" key={item.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.company}</p>
              </div>
              <div>
                <p>{item.period || item.startEnd}</p>
                <p>{item.location}</p>
              </div>
              <ul>
                {(item.bullets || []).map((bullet, bulletIndex) => (
                  <li key={bulletIndex}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="im-education im-pad" id="im-education" aria-labelledby="im-education-title">
        <div className="im-section-heading im-reveal">
          <p className="im-kicker">05 / Education</p>
          <h2 id="im-education-title">Foundations.</h2>
        </div>
        <div className="im-education-grid">
          {education.map((item) => (
            <article className="im-reveal" key={item.id}>
              <p>{item.dates}</p>
              <h3>{item.degree}</h3>
              <span>{item.institution}</span>
              {item.grade && <strong>{item.grade}</strong>}
            </article>
          ))}
        </div>
      </section>

      <section className="im-certificates im-pad" id="im-certificate" aria-labelledby="im-certificate-title">
        <div className="im-section-heading im-reveal">
          <p className="im-kicker">06 / Credentials</p>
          <h2 id="im-certificate-title">Always learning.</h2>
        </div>
        {certificates.length ? (
          <div className="im-certificate-grid">
            {certificates.map((certificate) => (
              <button
                type="button"
                className="im-certificate im-reveal"
                key={certificate.id}
                onClick={() => setSelectedCertificate(certificate)}
              >
                {(certificate.imageUrl || certificate.image) && (
                  <img
                    src={certificate.imageUrl || certificate.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span>{certificate.name}</span>
                <small>Open ↗</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="im-empty im-reveal">Certificate archive is being curated.</p>
        )}
      </section>

      <section className="im-contact im-pad" id="im-contact" aria-labelledby="im-contact-title">
        <div className="im-contact__heading im-reveal">
          <p className="im-kicker">07 / Start a conversation</p>
          <h2 id="im-contact-title">Have an ambitious idea? Let’s make it tangible.</h2>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div className="im-reveal">
          <ImmersiveContactForm />
        </div>
      </section>

      <footer className="im-footer">
        <p>© {new Date().getFullYear()} {contact.displayName || home.name}</p>
        <div>
          <a href={content.social?.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={content.social?.githubUrl} target="_blank" rel="noreferrer">GitHub</a>
          {content.cv?.fileUrl && (
            <a href={content.cv.fileUrl} target="_blank" rel="noreferrer">Résumé</a>
          )}
        </div>
      </footer>

      {error && <p className="im-data-notice" role="status">{error}</p>}
      <CertificateDialog
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </main>
  )
}

export default ImmersiveHome

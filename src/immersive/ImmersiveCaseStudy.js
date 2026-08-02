import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useImmersiveData } from './data/ImmersiveDataContext'
import { useImmersiveMotion } from './motion/ImmersiveMotionContext'
import useRevealAnimations from './motion/useRevealAnimations'

const isPlainClick = (event) =>
  (event.button === undefined || event.button === 0) &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey

const ImmersiveCaseStudy = () => {
  const rootRef = useRef(null)
  const mainRef = useRef(null)
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, loading } = useImmersiveData()
  const { lenis, transitionTo } = useImmersiveMotion()
  const projectIndex = projects.findIndex((item) => String(item.id) === projectId)
  const project = projects[projectIndex]

  useRevealAnimations(rootRef, `${loading}-${projectId}`)

  useEffect(() => {
    if (loading) return
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    mainRef.current?.focus()
  }, [lenis, loading, projectId])

  useEffect(() => {
    if (!project) return undefined
    document.title = `${project.name} — Case Study`
    return () => {
      document.title = 'Ravindra Pawar'
    }
  }, [project])

  const navigateWithTransition = (event, path) => {
    if (!isPlainClick(event)) return
    event.preventDefault()
    transitionTo(() => navigate(path))
  }

  if (loading) {
    return <main className="im-case im-case--state">Loading project…</main>
  }

  if (!project) {
    return (
      <main className="im-case im-case--state" ref={mainRef} tabIndex="-1">
        <p className="im-kicker">Project not found</p>
        <h1>This case study is no longer available.</h1>
        <Link to="/project">Return to selected work</Link>
      </main>
    )
  }

  const projectImage = project.imageUrl || project.image
  const caseStudy = project.caseStudy || {}
  const gallery = Array.isArray(project.gallery) ? project.gallery : []
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length]
  const next = projects[(projectIndex + 1) % projects.length]

  const returnToWork = (event) => {
    if (!isPlainClick(event)) return
    event.preventDefault()
    transitionTo(() => navigate('/project'))
  }

  return (
    <main className="im-case" ref={rootRef}>
      <div className="im-case__topbar">
        <Link to="/" className="im-wordmark">RP<span>®</span></Link>
        <Link to="/project" onClick={returnToWork}>← Back to work</Link>
      </div>

      <article ref={mainRef} tabIndex="-1">
        <header className="im-case__hero">
          <p className="im-kicker im-reveal">Case study / {String(projectIndex + 1).padStart(2, '0')}</p>
          <h1 className="im-reveal">{project.name}</h1>
          <div className="im-case__meta im-reveal">
            <div><span>Role</span><p>{project.role || 'Full-stack development'}</p></div>
            <div><span>Period</span><p>{project.period || 'Selected work'}</p></div>
            <div>
              <span>Stack</span>
              <p>{Array.isArray(project.skills) ? project.skills.join(', ') : project.skills}</p>
            </div>
          </div>
        </header>

        <div className="im-case__visual im-reveal">
          {projectImage ? (
            <img src={projectImage} alt={`${project.name} project interface`} />
          ) : (
            <div className="im-project-placeholder"><span>RP</span></div>
          )}
        </div>

        <section className="im-case__overview im-pad">
          <p className="im-kicker im-reveal">Overview</p>
          <p className="im-case__lead im-reveal">{project.description}</p>
          <div className="im-case__links im-reveal">
            {(project.websiteUrl || project.url) && (
              <a href={project.websiteUrl || project.url} target="_blank" rel="noreferrer">
                Visit live project ↗
              </a>
            )}
            {(project.githubUrl || project.github) && (
              <a href={project.githubUrl || project.github} target="_blank" rel="noreferrer">
                View source ↗
              </a>
            )}
          </div>
        </section>

        {(caseStudy.challenge || caseStudy.approach || caseStudy.outcome) && (
          <section className="im-case__narrative im-pad">
            {caseStudy.challenge && (
              <article className="im-reveal"><span>01 / Challenge</span><p>{caseStudy.challenge}</p></article>
            )}
            {caseStudy.approach && (
              <article className="im-reveal"><span>02 / Approach</span><p>{caseStudy.approach}</p></article>
            )}
            {caseStudy.outcome && (
              <article className="im-reveal"><span>03 / Outcome</span><p>{caseStudy.outcome}</p></article>
            )}
          </section>
        )}

        {gallery.length > 0 && (
          <section className="im-case__gallery im-pad" aria-label={`${project.name} gallery`}>
            {gallery.map((image, index) => (
              <figure className="im-reveal" key={image.storagePath || image.imageUrl || index}>
                <img src={image.imageUrl} alt={image.alt || `${project.name} detail ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </section>
        )}
      </article>

      {projects.length > 1 && (
        <nav className="im-case__pagination" aria-label="Other case studies">
          <Link
            to={`/project/${encodeURIComponent(previous.id)}`}
            onClick={(event) => navigateWithTransition(event, `/project/${encodeURIComponent(previous.id)}`)}
          >
            <span>Previous</span>{previous.name}
          </Link>
          <Link
            to={`/project/${encodeURIComponent(next.id)}`}
            onClick={(event) => navigateWithTransition(event, `/project/${encodeURIComponent(next.id)}`)}
          >
            <span>Next</span>{next.name}
          </Link>
        </nav>
      )}
    </main>
  )
}

export default ImmersiveCaseStudy

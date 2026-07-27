import './index.scss'
import { useState } from 'react'
import LogoS from '../../assets/images/logopreload.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedin,
  faGithub,
} from '@fortawesome/free-brands-svg-icons'
import {
  faHome,
  faUser,
  faEnvelope,
  faBars,
  faClose,
  faCertificate,
  faFile,
  faGear,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons'
import { Link, NavLink } from 'react-router-dom'
import { useSiteContent } from '../../hooks/usePortfolioData'

const Sidebar = () => {
  const [showNav, setShowNav] = useState(false)
  const { content } = useSiteContent()
  const navLinkClass = ({ isActive }) => (isActive ? 'active' : '')
  const navLinkWithBaseClass = (baseClass) => ({ isActive }) =>
    `${baseClass}${isActive ? ' active' : ''}`

  return (
    <div className="nav-bar">
      <Link className="logo" to="/" onClick={() => setShowNav(false)}>
        <img src={LogoS} alt="Logo" className="side-logo" />
        {/* <img className="sub-logo" src={LogoSubtitle} alt="slobodan" /> */}
      </Link>
      <nav className={showNav ? ' mobile-show' : ''}>
        <div className="nav-title">
        <NavLink
          end
          className={navLinkClass}
          to="/"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faHome} className='anchor-icon' />
        </NavLink>
        <NavLink
          className={navLinkWithBaseClass('about-link')}
          to="/about"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faUser} className='anchor-icon' />
        </NavLink>
        <NavLink
          className={navLinkWithBaseClass('experience-link')}
          to="/experience"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faBriefcase} className='anchor-icon' />
        </NavLink>
        <NavLink
          className={navLinkWithBaseClass('skills-link')}
          to="/skills"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faGear} className='anchor-icon' />
        </NavLink>
        <NavLink
          className={navLinkWithBaseClass('project-link')}
          to="/project"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faFile} className='anchor-icon' />
        </NavLink>
        <NavLink
          className={navLinkWithBaseClass('certificate-link')}
          to="/certificate"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faCertificate} className='anchor-icon' />
        </NavLink>
        <NavLink
          className={navLinkWithBaseClass('contact-link')}
          to="/contact"
          onClick={() => setShowNav(false)}
        >
          <FontAwesomeIcon icon={faEnvelope} className='anchor-icon' />
        </NavLink>
        <FontAwesomeIcon
          onClick={() => setShowNav(false)}
          icon={faClose}
          color="#4FEFFF"
          size="2x"
          className="close-icon"
        />
        </div>
      </nav>
      <ul>
        <li>
          <a
            href={content.social?.linkedinUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              color="#4d4d4e"
              className="anchor-icon"
            />
          </a>
        </li>
        <li>
          <a
            href={content.social?.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <FontAwesomeIcon
              icon={faGithub}
              color="#4d4d4e"
              className="anchor-icon"
            />
          </a>
        </li>
      </ul>
      <FontAwesomeIcon
        onClick={() => setShowNav(true)}
        icon={faBars}
        color="#4FEFFF"
        size="3x"
        className="hamburger-icon"
      />
    </div>
  )
}

export default Sidebar

import { useEffect, useState } from 'react'
import Loader from 'react-loaders'
import { Circle, MapContainer, TileLayer, Tooltip } from 'react-leaflet'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import AnimatedLetters from '../AnimatedLetters'
import SubmitModal from './SubmitModal'
import './index.scss'

const HADAPSAR_AREA_CENTER = [18.5089, 73.9365]

const Contact = () => {
  const [letterClass, setLetterClass] = useState('text-animate')
  const [isLoading, setIsLoading] = useState(false)
  const [modalState, setModalState] = useState({ isOpen: false, isSuccess: false })
  const form = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLetterClass('text-animate-hover')
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const sendEmail = (e) => {
    e.preventDefault()
    setIsLoading(true)

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setIsLoading(false)
          setModalState({ isOpen: true, isSuccess: true })
          form.current.reset()
        },
        () => {
          setIsLoading(false)
          setModalState({ isOpen: true, isSuccess: false })
        }
      )
  }

  const closeModal = () => {
    setModalState({ isOpen: false, isSuccess: false })
  }

  return (
    <>
      <div className="container contact-page">
        <div className="text-zone">
          <h1>
            <AnimatedLetters
              letterClass={letterClass}
              strArray={['C', 'o', 'n', 't', 'a', 'c', 't', ' ', 'm', 'e']}
              idx={15}
            />
          </h1>
          <div className="contact-form">
            <form ref={form} onSubmit={sendEmail}>
              <ul>
                <li className="half">
                  <input placeholder="Name" type="text" name="name" required />
                </li>
                <li className="half">
                  <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                  />
                </li>
                <li>
                  <input
                    placeholder="Subject"
                    type="text"
                    name="subject"
                    required
                  />
                </li>
                <li>
                  <textarea
                    placeholder="Message"
                    name="message"
                    required
                  ></textarea>
                </li>
                <li>
                  <input
                    type="submit"
                    className="flat-button"
                    value={isLoading ? 'SENDING...' : 'SEND'}
                    disabled={isLoading}
                  />
                </li>
              </ul>
            </form>
          </div>
        </div>
        <div className="info-map">
          Ravindra Pawar,
          <br />
          Hadapsar, Pune,
          <br />
          Maharashtra, India.
           <br />
           
          <br />
          <span style={{color:"#4FEFFF", fontSize:"16px"}}>ravindra.pawar.mit@gmail.com</span>
        </div>
        <div className="map-wrap">
          <MapContainer center={HADAPSAR_AREA_CENTER} zoom={12}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle
              center={HADAPSAR_AREA_CENTER}
              radius={3000}
              pathOptions={{
                color: '#4FEFFF',
                fillColor: '#4FEFFF',
                fillOpacity: 0.16,
                weight: 2,
              }}
            >
              <Tooltip permanent direction="center" className="map-area-label">
                Hadapsar area
              </Tooltip>
            </Circle>
          </MapContainer>
        </div>
      </div>
      <Loader type="pacman" />
      <SubmitModal
        isOpen={modalState.isOpen}
        isSuccess={modalState.isSuccess}
        onClose={closeModal}
      />
    </>
  )
}

export default Contact

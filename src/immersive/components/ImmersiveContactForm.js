import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

const ImmersiveContactForm = () => {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      await emailjs.sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      formRef.current?.reset()
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <form className="im-contact-form" ref={formRef} onSubmit={submit}>
      <div className="im-field-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label>
        <span>Subject</span>
        <input name="subject" required />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows="4" required />
      </label>
      <div className="im-contact-form__footer">
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" aria-live="polite">
          {status === 'success' && 'Message sent. I’ll get back to you soon.'}
          {status === 'error' && 'Message could not be sent. Please use the email link.'}
        </p>
      </div>
    </form>
  )
}

export default ImmersiveContactForm

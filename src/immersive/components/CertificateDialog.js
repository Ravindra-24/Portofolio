import { useEffect, useRef } from 'react'
import { useImmersiveMotion } from '../motion/ImmersiveMotionContext'

const CertificateDialog = ({ certificate, onClose }) => {
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const { lenis } = useImmersiveMotion()

  useEffect(() => {
    if (!certificate) return undefined
    previousFocusRef.current = document.activeElement
    closeRef.current?.focus()
    lenis?.stop()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeydown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = previousOverflow
      lenis?.start()
      previousFocusRef.current?.focus?.()
    }
  }, [certificate, lenis, onClose])

  if (!certificate) return null
  const image = certificate.imageUrl || certificate.image

  return (
    <div
      className="im-dialog-backdrop"
      role="presentation"
      data-lenis-prevent
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="im-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-dialog-title"
      >
        <button
          type="button"
          className="im-dialog__close"
          ref={closeRef}
          onClick={onClose}
          aria-label="Close certificate"
        >
          Close
        </button>
        {image && <img src={image} alt={certificate.name || 'Certificate'} />}
        <div>
          <p className="im-kicker">Certificate</p>
          <h2 id="certificate-dialog-title">{certificate.name}</h2>
          {certificate.description && <p>{certificate.description}</p>}
        </div>
      </section>
    </div>
  )
}

export default CertificateDialog

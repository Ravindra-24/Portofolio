import React from 'react'
import './SubmitModal.scss'

const SubmitModal = ({ isOpen, isSuccess, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-icon ${isSuccess ? 'success' : 'error'}`}>
          {isSuccess ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </div>
        <h2>{isSuccess ? 'Message Sent!' : 'Failed to Send'}</h2>
        <p>
          {isSuccess
            ? "Thank you for reaching out! I'll get back to you as soon as possible."
            : 'Please try again or reach out via email directly.'}
        </p>
        <button className="modal-button" onClick={onClose}>
          {isSuccess ? 'Close' : 'Try Again'}
        </button>
      </div>
    </div>
  )
}

export default SubmitModal

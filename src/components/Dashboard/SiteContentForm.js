import { useEffect, useState } from 'react'
import {
  isCoordinateInRange,
  isEmail,
  isHttpUrl,
  validatePdf,
} from './validation'

const SiteContentForm = ({
  section,
  content,
  busy,
  uploadProgress,
  onSave,
  onDirtyChange,
}) => {
  const [draft, setDraft] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (section === 'home') {
      setDraft({
        ...content.home,
        ...content.social,
      })
    } else if (section === 'about') {
      setDraft({ paragraphs: content.about?.paragraphs?.join('\n\n') || '' })
    } else if (section === 'skills') {
      setDraft({ paragraphs: content.skills?.paragraphs?.join('\n\n') || '' })
    } else if (section === 'contact') {
      setDraft({ ...content.contact })
    } else {
      setDraft({ file: null })
    }
    setErrors({})
    onDirtyChange(false)
  }, [content, onDirtyChange, section])

  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    onDirtyChange(true)
  }

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (section === 'home') {
      if (!draft.name?.trim()) nextErrors.name = 'Name is required.'
      if (!draft.role?.trim()) nextErrors.role = 'Role is required.'
      if (!draft.tagline?.trim()) nextErrors.tagline = 'Tagline is required.'
      if (!isHttpUrl(draft.linkedinUrl)) {
        nextErrors.linkedinUrl = 'Enter a valid HTTP or HTTPS URL.'
      }
      if (!isHttpUrl(draft.githubUrl)) {
        nextErrors.githubUrl = 'Enter a valid HTTP or HTTPS URL.'
      }
    }

    if (section === 'about' || section === 'skills') {
      const paragraphs = draft.paragraphs
        .split(/\n\s*\n/)
        .map((value) => value.trim())
        .filter(Boolean)
      if (!paragraphs.length) nextErrors.paragraphs = 'Add at least one paragraph.'
      if (paragraphs.some((value) => value.length > 4000)) {
        nextErrors.paragraphs = 'Each paragraph must be 4,000 characters or fewer.'
      }
    }

    if (section === 'contact') {
      if (!draft.displayName?.trim()) {
        nextErrors.displayName = 'Display name is required.'
      }
      if (!isEmail(draft.email)) nextErrors.email = 'Enter a valid email address.'
      if (!draft.location?.trim()) nextErrors.location = 'Location is required.'
      if (!draft.portfolioUrl?.trim() || !isHttpUrl(draft.portfolioUrl)) {
        nextErrors.portfolioUrl = 'Enter a valid HTTP or HTTPS URL.'
      }
      if (!isCoordinateInRange(draft.mapLatitude, -90, 90)) {
        nextErrors.mapLatitude = 'Latitude must be between -90 and 90.'
      }
      if (!isCoordinateInRange(draft.mapLongitude, -180, 180)) {
        nextErrors.mapLongitude = 'Longitude must be between -180 and 180.'
      }
      if ((draft.phone || '').trim().length > 40) {
        nextErrors.phone = 'Phone number must be 40 characters or fewer.'
      }
    }

    if (section === 'cv') {
      const fileError = validatePdf(draft.file)
      if (fileError) nextErrors.file = fileError
      if (!draft.file && !content.cv?.fileUrl) nextErrors.file = 'Select a PDF CV.'
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    onSave(draft)
  }

  const currentCv = content.cv

  return (
    <form className="cms-form site-content-form" onSubmit={submit}>
      <div className="cms-form-heading">
        <div>
          <p className="eyebrow">Site content</p>
          <h3>Edit {section}</h3>
        </div>
      </div>

      {section === 'home' && (
        <>
          <div className="cms-field-grid">
            <label>
              Name
              <input
                maxLength="120"
                value={draft.name || ''}
                onChange={(event) => update('name', event.target.value)}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>
              Role
              <input
                maxLength="120"
                value={draft.role || ''}
                onChange={(event) => update('role', event.target.value)}
              />
              {errors.role && <span className="field-error">{errors.role}</span>}
            </label>
          </div>
          <label>
            Tagline
            <input
              maxLength="200"
              value={draft.tagline || ''}
              onChange={(event) => update('tagline', event.target.value)}
            />
            {errors.tagline && <span className="field-error">{errors.tagline}</span>}
          </label>
          <div className="cms-field-grid">
            <label>
              LinkedIn URL
              <input
                type="url"
                value={draft.linkedinUrl || ''}
                onChange={(event) => update('linkedinUrl', event.target.value)}
              />
              {errors.linkedinUrl && (
                <span className="field-error">{errors.linkedinUrl}</span>
              )}
            </label>
            <label>
              GitHub URL
              <input
                type="url"
                value={draft.githubUrl || ''}
                onChange={(event) => update('githubUrl', event.target.value)}
              />
              {errors.githubUrl && (
                <span className="field-error">{errors.githubUrl}</span>
              )}
            </label>
          </div>
        </>
      )}

      {(section === 'about' || section === 'skills') && (
        <label>
          Paragraphs (leave a blank line between paragraphs)
          <textarea
            rows="12"
            value={draft.paragraphs || ''}
            onChange={(event) => update('paragraphs', event.target.value)}
          />
          {errors.paragraphs && (
            <span className="field-error">{errors.paragraphs}</span>
          )}
        </label>
      )}

      {section === 'contact' && (
        <>
          <div className="cms-field-grid">
            <label>
              Display name
              <input
                maxLength="120"
                value={draft.displayName || ''}
                onChange={(event) => update('displayName', event.target.value)}
              />
              {errors.displayName && (
                <span className="field-error">{errors.displayName}</span>
              )}
            </label>
            <label>
              Email
              <input
                type="email"
                maxLength="254"
                value={draft.email || ''}
                onChange={(event) => update('email', event.target.value)}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
            <label>
              Phone (optional)
              <input
                type="tel"
                maxLength="40"
                value={draft.phone || ''}
                onChange={(event) => update('phone', event.target.value)}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>
            <label>
              Portfolio URL
              <input
                type="url"
                value={draft.portfolioUrl || ''}
                onChange={(event) => update('portfolioUrl', event.target.value)}
              />
              {errors.portfolioUrl && (
                <span className="field-error">{errors.portfolioUrl}</span>
              )}
            </label>
          </div>
          <label>
            Location
            <input
              maxLength="240"
              value={draft.location || ''}
              onChange={(event) => update('location', event.target.value)}
            />
            {errors.location && (
              <span className="field-error">{errors.location}</span>
            )}
          </label>
          <div className="cms-field-grid">
            <label>
              Map latitude
              <input
                type="number"
                min="-90"
                max="90"
                step="any"
                value={draft.mapLatitude ?? ''}
                onChange={(event) => update('mapLatitude', event.target.value)}
              />
              {errors.mapLatitude && (
                <span className="field-error">{errors.mapLatitude}</span>
              )}
            </label>
            <label>
              Map longitude
              <input
                type="number"
                min="-180"
                max="180"
                step="any"
                value={draft.mapLongitude ?? ''}
                onChange={(event) => update('mapLongitude', event.target.value)}
              />
              {errors.mapLongitude && (
                <span className="field-error">{errors.mapLongitude}</span>
              )}
            </label>
          </div>
        </>
      )}

      {section === 'cv' && (
        <>
          {currentCv?.fileUrl && (
            <a
              className="current-file"
              href={currentCv.fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              Current CV: {currentCv.fileName || 'Open PDF'}
            </a>
          )}
          <label>
            {currentCv?.fileUrl ? 'Replace CV' : 'CV file'}
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => update('file', event.target.files[0] || null)}
            />
            {errors.file && <span className="field-error">{errors.file}</span>}
          </label>
        </>
      )}

      {busy && uploadProgress > 0 && (
        <div className="upload-progress" aria-live="polite">
          <span style={{ width: `${uploadProgress}%` }} />
          <p>Uploading: {uploadProgress}%</p>
        </div>
      )}

      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? 'Saving…' : 'Save content'}
      </button>
    </form>
  )
}

export default SiteContentForm

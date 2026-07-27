import { useEffect, useState } from 'react'
import { isHttpUrl, validatePdf } from './validation'

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

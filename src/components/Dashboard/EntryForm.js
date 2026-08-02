import { useEffect, useMemo, useState } from 'react'
import { validateEntry } from './validation'
import { SKILL_CATEGORY_OPTIONS } from '../../data/portfolioDefaults'

const emptyDraft = (section) => {
  const common = { published: true, file: null }
  if (section === 'skills') return { ...common, name: '', category: 'other' }
  if (section === 'projects') {
    return {
      ...common,
      name: '',
      description: '',
      role: '',
      period: '',
      skillsText: '',
      websiteUrl: '',
      githubUrl: '',
    }
  }
  if (section === 'experience') {
    return {
      ...common,
      title: '',
      company: '',
      period: '',
      location: '',
      leavingReason: '',
      bulletsText: '',
    }
  }
  if (section === 'education') {
    return { ...common, institution: '', degree: '', dates: '', grade: '' }
  }
  return {
    ...common,
    name: '',
    description: '',
    category: 'other',
  }
}

const draftFromItem = (section, item) => {
  if (!item) return emptyDraft(section)
  const draft = { ...emptyDraft(section), ...item, file: null }
  if (section === 'projects') {
    const skills = Array.isArray(item.skills)
      ? item.skills
      : String(item.skills || '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
    draft.skillsText = skills.join(', ')
  }
  if (section === 'experience') {
    draft.bulletsText = (item.bullets || []).join('\n')
  }
  return draft
}

const FieldError = ({ children }) =>
  children ? <span className="field-error">{children}</span> : null

const EntryForm = ({
  section,
  item,
  busy,
  uploadProgress,
  onSave,
  onCancel,
  onDirtyChange,
}) => {
  const [values, setValues] = useState(() => draftFromItem(section, item))
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues(draftFromItem(section, item))
    setErrors({})
    onDirtyChange(false)
  }, [item, onDirtyChange, section])

  const previewUrl = useMemo(() => {
    if (values.file && URL.createObjectURL) {
      return URL.createObjectURL(values.file)
    }
    return item?.imageUrl || ''
  }, [item, values.file])

  useEffect(
    () => () => {
      if (values.file && previewUrl && URL.revokeObjectURL) {
        URL.revokeObjectURL(previewUrl)
      }
    },
    [previewUrl, values.file]
  )

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    onDirtyChange(true)
  }

  const submit = (event) => {
    event.preventDefault()
    const normalized = { ...values }
    if (section === 'projects') {
      normalized.skills = values.skillsText
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
      delete normalized.skillsText
    }
    if (section === 'experience') {
      normalized.bullets = values.bulletsText
        .split('\n')
        .map((value) => value.trim())
        .filter(Boolean)
      delete normalized.bulletsText
    }

    const nextErrors = validateEntry(
      section,
      normalized,
      Boolean(item?.imageUrl)
    )
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSave(normalized)
  }

  return (
    <form className="cms-form" onSubmit={submit}>
      <div className="cms-form-heading">
        <div>
          <p className="eyebrow">{item ? 'Editing entry' : 'New entry'}</p>
          <h3>{item ? item.name || item.title || item.institution : `Add ${section}`}</h3>
        </div>
        <label className="publish-toggle">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(event) => update('published', event.target.checked)}
          />
          Published
        </label>
      </div>

      {section === 'skills' && (
        <>
          <label>
            Skill name
            <input
              maxLength="60"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
            />
            <FieldError>{errors.name}</FieldError>
          </label>
          <label>
            Category
            <select
              value={values.category}
              onChange={(event) => update('category', event.target.value)}
            >
              {SKILL_CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <FieldError>{errors.category}</FieldError>
          </label>
        </>
      )}

      {section === 'projects' && (
        <>
          <label>
            Project name
            <input
              maxLength="120"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
            />
            <FieldError>{errors.name}</FieldError>
          </label>
          <label>
            Description
            <textarea
              maxLength="2000"
              rows="5"
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
            />
            <FieldError>{errors.description}</FieldError>
          </label>
          <div className="cms-field-grid">
            <label>
              Project role (optional)
              <input
                maxLength="120"
                placeholder="Solo Full-Stack Developer"
                value={values.role}
                onChange={(event) => update('role', event.target.value)}
              />
              <FieldError>{errors.role}</FieldError>
            </label>
            <label>
              Project period (optional)
              <input
                maxLength="120"
                placeholder="Jun 2026 - Present"
                value={values.period}
                onChange={(event) => update('period', event.target.value)}
              />
              <FieldError>{errors.period}</FieldError>
            </label>
          </div>
          <label>
            Skills (comma separated)
            <input
              value={values.skillsText}
              onChange={(event) => update('skillsText', event.target.value)}
            />
            <FieldError>{errors.skills}</FieldError>
          </label>
          <div className="cms-field-grid">
            <label>
              Website URL
              <input
                type="url"
                value={values.websiteUrl}
                onChange={(event) => update('websiteUrl', event.target.value)}
              />
              <FieldError>{errors.websiteUrl}</FieldError>
            </label>
            <label>
              GitHub URL
              <input
                type="url"
                value={values.githubUrl}
                onChange={(event) => update('githubUrl', event.target.value)}
              />
              <FieldError>{errors.githubUrl}</FieldError>
            </label>
          </div>
        </>
      )}

      {section === 'experience' && (
        <>
          <div className="cms-field-grid">
            <label>
              Role
              <input
                maxLength="120"
                value={values.title}
                onChange={(event) => update('title', event.target.value)}
              />
              <FieldError>{errors.title}</FieldError>
            </label>
            <label>
              Company
              <input
                maxLength="120"
                value={values.company}
                onChange={(event) => update('company', event.target.value)}
              />
              <FieldError>{errors.company}</FieldError>
            </label>
            <label>
              Period
              <input
                maxLength="120"
                placeholder="May 2024 - Present"
                value={values.period}
                onChange={(event) => update('period', event.target.value)}
              />
              <FieldError>{errors.period}</FieldError>
            </label>
            <label>
              Location
              <input
                maxLength="120"
                value={values.location}
                onChange={(event) => update('location', event.target.value)}
              />
            </label>
          </div>
          <label>
            Highlights (one per line)
            <textarea
              rows="7"
              value={values.bulletsText}
              onChange={(event) => update('bulletsText', event.target.value)}
            />
            <FieldError>{errors.bullets}</FieldError>
          </label>
          <label>
            Reason for leaving (optional, shown publicly when filled)
            <textarea
              maxLength="500"
              rows="3"
              value={values.leavingReason}
              onChange={(event) => update('leavingReason', event.target.value)}
            />
            <FieldError>{errors.leavingReason}</FieldError>
          </label>
        </>
      )}

      {section === 'education' && (
        <>
          <label>
            Institution
            <input
              maxLength="120"
              value={values.institution}
              onChange={(event) => update('institution', event.target.value)}
            />
            <FieldError>{errors.institution}</FieldError>
          </label>
          <label>
            Degree
            <input
              maxLength="120"
              value={values.degree}
              onChange={(event) => update('degree', event.target.value)}
            />
            <FieldError>{errors.degree}</FieldError>
          </label>
          <label>
            Dates
            <input
              maxLength="120"
              placeholder="2020 - 2023"
              value={values.dates}
              onChange={(event) => update('dates', event.target.value)}
            />
            <FieldError>{errors.dates}</FieldError>
          </label>
          <label>
            Grade / score (optional)
            <input
              maxLength="80"
              placeholder="CGPA: 8.65/10"
              value={values.grade}
              onChange={(event) => update('grade', event.target.value)}
            />
            <FieldError>{errors.grade}</FieldError>
          </label>
        </>
      )}

      {section === 'certificates' && (
        <>
          <label>
            Certificate name
            <input
              maxLength="120"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
            />
            <FieldError>{errors.name}</FieldError>
          </label>
          <label>
            Description
            <textarea
              maxLength="2000"
              rows="4"
              value={values.description}
              onChange={(event) => update('description', event.target.value)}
            />
            <FieldError>{errors.description}</FieldError>
          </label>
          <label>
            Category
            <select
              value={values.category}
              onChange={(event) => update('category', event.target.value)}
            >
              <option value="full-stack">Full Stack Development</option>
              <option value="google">Google Project Management</option>
              <option value="other">Other Certifications</option>
            </select>
          </label>
        </>
      )}

      {(section === 'projects' || section === 'certificates') && (
        <label>
          {item?.imageUrl
            ? 'Replace image'
            : section === 'projects'
            ? 'Image (optional)'
            : 'Image'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => update('file', event.target.files[0] || null)}
          />
          <FieldError>{errors.file}</FieldError>
          {previewUrl && <img className="cms-media-preview" src={previewUrl} alt="Preview" />}
        </label>
      )}

      {busy && uploadProgress > 0 && (
        <div className="upload-progress" aria-live="polite">
          <span style={{ width: `${uploadProgress}%` }} />
          <p>Uploading: {uploadProgress}%</p>
        </div>
      )}

      <div className="cms-form-actions">
        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? 'Saving…' : item ? 'Save changes' : 'Add entry'}
        </button>
        {item && (
          <button type="button" className="secondary-button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default EntryForm

import { useCallback, useEffect, useState } from 'react'
import { auth } from '../../firebase'
import {
  createEntryId,
  deleteManagedFile,
  getAdminEntries,
  getMigrationStatus,
  getSiteContent,
  importExistingPortfolio,
  removeEntry,
  saveEntry,
  saveSiteContent,
  swapEntryOrder,
  uploadPortfolioFile,
} from '../../services/portfolioRepository'
import EntryForm from './EntryForm'
import SiteContentForm from './SiteContentForm'
import './index.scss'

const SECTIONS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['certificates', 'Certificates'],
  ['cv', 'CV'],
]

const ENTRY_SECTIONS = new Set([
  'skills',
  'projects',
  'experience',
  'education',
  'certificates',
])

const itemTitle = (item) => item.name || item.title || item.institution

const Home = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [migrated, setMigrated] = useState(false)
  const [content, setContent] = useState(null)
  const [entries, setEntries] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [progressText, setProgressText] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const loadContent = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const migrationComplete = await getMigrationStatus()
      setMigrated(migrationComplete)
      if (migrationComplete) {
        const siteContent = await getSiteContent()
        setContent(siteContent)
        if (ENTRY_SECTIONS.has(activeSection)) {
          setEntries(await getAdminEntries(activeSection))
        } else {
          setEntries([])
        }
      }
    } catch (loadError) {
      setError('Could not load dashboard content. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [activeSection])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const canDiscardChanges = () =>
    !dirty || window.confirm('Discard your unsaved changes?')

  const selectSection = (section) => {
    if (!canDiscardChanges()) return
    setDirty(false)
    setEditing(null)
    setMessage('')
    setError('')
    setActiveSection(section)
  }

  const startEditing = (item) => {
    if (!canDiscardChanges()) return
    setDirty(false)
    setEditing(item)
  }

  const cancelEditing = () => {
    if (!canDiscardChanges()) return
    setEditing(null)
    setDirty(false)
  }

  const signOut = () => {
    if (!canDiscardChanges()) return
    auth.signOut()
  }

  const refresh = () => {
    if (!canDiscardChanges()) return
    setDirty(false)
    loadContent()
  }

  const runImport = async () => {
    if (
      !window.confirm(
        'Import the existing portfolio into the new CMS? This can be safely retried if it fails.'
      )
    ) {
      return
    }
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const result = await importExistingPortfolio(setProgressText)
      setMessage(
        result.alreadyImported
          ? 'Portfolio was already imported.'
          : 'Portfolio imported successfully.'
      )
      await loadContent()
    } catch (importError) {
      setError(
        'Import failed before cutover. The current public portfolio is unchanged; retry when ready.'
      )
    } finally {
      setBusy(false)
      setProgressText('')
    }
  }

  const refreshEntries = async () => {
    setEntries(await getAdminEntries(activeSection))
  }

  const handleEntrySave = async (values) => {
    setBusy(true)
    setError('')
    setMessage('')
    setUploadProgress(0)
    const isNew = !editing
    const id = editing?.id || createEntryId(activeSection)
    let uploaded = null

    try {
      if (values.file) {
        uploaded = await uploadPortfolioFile(
          values.file,
          activeSection,
          id,
          setUploadProgress
        )
      }

      const { file, ...entryValues } = values
      const order =
        editing?.order ??
        (entries.length ? Math.max(...entries.map((item) => item.order)) + 1 : 0)
      const media =
        uploaded && activeSection !== 'cv'
          ? {
              imageUrl: uploaded.fileUrl,
              storagePath: uploaded.storagePath,
            }
          : {}

      await saveEntry(
        activeSection,
        id,
        {
          ...entryValues,
          ...media,
          order,
        },
        isNew
      )

      if (uploaded && editing?.storagePath) {
        await deleteManagedFile(editing.storagePath)
      }

      setDirty(false)
      setEditing(null)
      setMessage(isNew ? 'Entry added.' : 'Changes saved.')
      await refreshEntries()
    } catch (saveError) {
      if (uploaded?.storagePath) await deleteManagedFile(uploaded.storagePath)
      setError('Could not save this entry. Your previous content is unchanged.')
    } finally {
      setBusy(false)
      setUploadProgress(0)
    }
  }

  const handleSiteSave = async (draft) => {
    setBusy(true)
    setError('')
    setMessage('')
    setUploadProgress(0)
    let uploaded = null

    try {
      let patch
      if (activeSection === 'home') {
        patch = {
          home: {
            name: draft.name.trim(),
            role: draft.role.trim(),
            tagline: draft.tagline.trim(),
          },
          social: {
            linkedinUrl: draft.linkedinUrl.trim(),
            githubUrl: draft.githubUrl.trim(),
          },
        }
      } else if (activeSection === 'about' || activeSection === 'skills') {
        patch = {
          [activeSection]: {
            paragraphs: draft.paragraphs
              .split(/\n\s*\n/)
              .map((value) => value.trim())
              .filter(Boolean),
          },
        }
      } else {
        if (draft.file) {
          uploaded = await uploadPortfolioFile(
            draft.file,
            'cv',
            'main',
            setUploadProgress
          )
          patch = {
            cv: {
              fileUrl: uploaded.fileUrl,
              storagePath: uploaded.storagePath,
              fileName: uploaded.fileName,
            },
          }
        } else {
          patch = { cv: content.cv }
        }
      }

      await saveSiteContent(patch)
      if (uploaded && content.cv?.storagePath) {
        await deleteManagedFile(content.cv.storagePath)
      }
      setContent((current) => ({ ...current, ...patch }))
      setDirty(false)
      setMessage('Content saved.')
    } catch (saveError) {
      if (uploaded?.storagePath) await deleteManagedFile(uploaded.storagePath)
      setError('Could not save this content. Please try again.')
    } finally {
      setBusy(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete “${itemTitle(item)}”? This cannot be undone.`)) {
      return
    }
    setBusy(true)
    setError('')
    try {
      const result = await removeEntry(activeSection, item)
      setMessage(
        result.cleanupWarning
          ? 'Entry deleted. Its old uploaded file may need manual cleanup.'
          : 'Entry deleted.'
      )
      if (editing?.id === item.id) setEditing(null)
      await refreshEntries()
    } catch (deleteError) {
      setError('Could not delete this entry.')
    } finally {
      setBusy(false)
    }
  }

  const move = async (index, direction) => {
    const otherIndex = index + direction
    if (otherIndex < 0 || otherIndex >= entries.length) return
    setBusy(true)
    setError('')
    try {
      await swapEntryOrder(
        activeSection,
        entries[index],
        entries[otherIndex]
      )
      await refreshEntries()
      setMessage('Display order updated.')
    } catch (moveError) {
      setError('Could not update display order.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main
      className="cms-dashboard"
      data-disable-scroll-route-nav="true"
    >
      <header className="cms-header">
        <div>
          <p className="eyebrow">Portfolio administration</p>
          <h1>Content dashboard</h1>
        </div>
        <button className="secondary-button" onClick={signOut}>
          Sign out
        </button>
      </header>

      {!migrated && !loading ? (
        <section className="migration-card">
          <span className="status-pill">Setup required</span>
          <h2>Import the existing portfolio</h2>
          <p>
            The public site is still using its current content. Import creates
            the new CMS records and switches the site only after every record is
            written successfully.
          </p>
          <button className="primary-button" onClick={runImport} disabled={busy}>
            {busy ? 'Importing…' : 'Import existing portfolio'}
          </button>
          {progressText && <p className="progress-text">{progressText}</p>}
        </section>
      ) : (
        <div className="cms-shell">
          <nav className="cms-section-nav" aria-label="Dashboard sections">
            {SECTIONS.map(([key, label]) => (
              <button
                key={key}
                className={activeSection === key ? 'active' : ''}
                onClick={() => selectSection(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="cms-workspace">
            <div className="cms-workspace-header">
              <div>
                <p className="eyebrow">Editing section</p>
                <h2>{SECTIONS.find(([key]) => key === activeSection)?.[1]}</h2>
              </div>
              <button className="text-button" onClick={refresh} disabled={busy}>
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="cms-state">Loading content…</p>
            ) : (
              <>
                {['home', 'about', 'skills', 'cv'].includes(activeSection) &&
                  content && (
                    <SiteContentForm
                      section={activeSection}
                      content={content}
                      busy={busy}
                      uploadProgress={uploadProgress}
                      onSave={handleSiteSave}
                      onDirtyChange={setDirty}
                    />
                  )}

                {ENTRY_SECTIONS.has(activeSection) && (
                  <div className="entry-manager">
                    <div className="entry-list" aria-label={`${activeSection} entries`}>
                      <div className="entry-list-heading">
                        <h3>Entries</h3>
                        <span>{entries.length}</span>
                      </div>
                      {!entries.length && (
                        <p className="cms-state">No entries yet. Add the first one.</p>
                      )}
                      {entries.map((item, index) => (
                        <article
                          key={item.id}
                          className={`entry-row ${
                            editing?.id === item.id ? 'selected' : ''
                          }`}
                        >
                          {(item.imageUrl || item.image) && (
                            <img src={item.imageUrl || item.image} alt="" />
                          )}
                          <div className="entry-row-copy">
                            <strong>{itemTitle(item)}</strong>
                            <span>{item.published ? 'Published' : 'Draft'}</span>
                          </div>
                          <div className="entry-row-actions">
                            <button
                              aria-label={`Move ${itemTitle(item)} up`}
                              onClick={() => move(index, -1)}
                              disabled={busy || index === 0}
                            >
                              ↑
                            </button>
                            <button
                              aria-label={`Move ${itemTitle(item)} down`}
                              onClick={() => move(index, 1)}
                              disabled={busy || index === entries.length - 1}
                            >
                              ↓
                            </button>
                            <button onClick={() => startEditing(item)} disabled={busy}>
                              Edit
                            </button>
                            <button
                              className="danger"
                              onClick={() => handleDelete(item)}
                              disabled={busy}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>

                    <EntryForm
                      key={`${activeSection}-${editing?.id || 'new'}-${entries.length}`}
                      section={activeSection}
                      item={editing}
                      busy={busy}
                      uploadProgress={uploadProgress}
                      onSave={handleEntrySave}
                      onCancel={cancelEditing}
                      onDirtyChange={setDirty}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {message && (
        <p className="cms-notice success" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="cms-notice error" role="alert">
          {error}
        </p>
      )}
    </main>
  )
}

export default Home

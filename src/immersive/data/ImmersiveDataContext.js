import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  getLegacyCertificates,
  getLegacyCv,
  getMigrationStatus,
  getPublicEntries,
  getSiteContent,
} from '../../services/portfolioRepository'
import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_CONTENT,
  DEFAULT_SKILLS,
} from '../../data/portfolioDefaults'

const fallbackData = {
  content: DEFAULT_SITE_CONTENT,
  projects: DEFAULT_PROJECTS,
  experience: DEFAULT_EXPERIENCE,
  education: DEFAULT_EDUCATION,
  skills: DEFAULT_SKILLS,
  certificates: [],
}

const ImmersiveDataContext = createContext(null)

export const ImmersiveDataProvider = ({ children }) => {
  const [state, setState] = useState({
    ...fallbackData,
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const migrated = await getMigrationStatus()
        if (migrated) {
          const [
            content,
            projects,
            experience,
            education,
            skills,
            certificates,
            legacyCertificates,
            legacyCv,
          ] =
            await Promise.all([
              getSiteContent(),
              getPublicEntries('projects'),
              getPublicEntries('experience'),
              getPublicEntries('education'),
              getPublicEntries('skills'),
              getPublicEntries('certificates'),
              getLegacyCertificates().catch(() => []),
              getLegacyCv().catch(() => ({
                fileUrl: '',
                storagePath: '',
                fileName: '',
              })),
            ])
          if (active) {
            setState({
              content: content.cv?.fileUrl
                ? content
                : { ...content, cv: legacyCv },
              projects,
              experience,
              education,
              skills,
              certificates: certificates.length ? certificates : legacyCertificates,
              loading: false,
              error: '',
            })
          }
          return
        }

        const [certificates, cv] = await Promise.all([
          getLegacyCertificates(),
          getLegacyCv(),
        ])
        if (active) {
          setState({
            ...fallbackData,
            content: {
              ...DEFAULT_SITE_CONTENT,
              cv,
            },
            certificates,
            loading: false,
            error: '',
          })
        }
      } catch (error) {
        if (active) {
          setState({
            ...fallbackData,
            loading: false,
            error: 'Live portfolio content is unavailable. Showing the bundled version.',
          })
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => state, [state])

  return (
    <ImmersiveDataContext.Provider value={value}>
      {children}
    </ImmersiveDataContext.Provider>
  )
}

export const useImmersiveData = () => {
  const value = useContext(ImmersiveDataContext)
  if (!value) {
    throw new Error('useImmersiveData must be used inside ImmersiveDataProvider.')
  }
  return value
}

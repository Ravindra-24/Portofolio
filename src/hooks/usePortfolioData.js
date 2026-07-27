import { useEffect, useState } from 'react'
import {
  getMigrationStatus,
  getPublicEntries,
  getSiteContent,
} from '../services/portfolioRepository'
import { DEFAULT_SITE_CONTENT } from '../data/portfolioDefaults'

export const useMigrationStatus = () => {
  const [state, setState] = useState({
    migrated: false,
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true
    getMigrationStatus()
      .then((migrated) => {
        if (active) setState({ migrated, loading: false, error: '' })
      })
      .catch(() => {
        if (active) {
          setState({
            migrated: false,
            loading: false,
            error: 'Portfolio content is currently unavailable.',
          })
        }
      })
    return () => {
      active = false
    }
  }, [])

  return state
}

export const usePortfolioCollection = (section, fallback = []) => {
  const [state, setState] = useState({
    data: fallback,
    migrated: false,
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const migrated = await getMigrationStatus()
        const data = migrated ? await getPublicEntries(section) : fallback
        if (active) setState({ data, migrated, loading: false, error: '' })
      } catch (error) {
        if (active) {
          setState({
            data: fallback,
            migrated: false,
            loading: false,
            error: 'Portfolio content is currently unavailable.',
          })
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [fallback, section])

  return state
}

export const useSiteContent = () => {
  const [state, setState] = useState({
    content: DEFAULT_SITE_CONTENT,
    migrated: false,
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const migrated = await getMigrationStatus()
        const content = migrated ? await getSiteContent() : DEFAULT_SITE_CONTENT
        if (active) setState({ content, migrated, loading: false, error: '' })
      } catch (error) {
        if (active) {
          setState({
            content: DEFAULT_SITE_CONTENT,
            migrated: false,
            loading: false,
            error: 'Portfolio content is currently unavailable.',
          })
        }
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return state
}

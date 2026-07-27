const STORAGE_KEY = 'portfolio_utm_attribution'

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
]

export const parseUtmParameters = (search = '') => {
  const params = new URLSearchParams(search)

  return UTM_KEYS.reduce((result, key) => {
    const value = params.get(key)?.trim()
    if (value) result[key] = value.slice(0, 200)
    return result
  }, {})
}

export const getStoredUtmParameters = (storage = window.localStorage) => {
  try {
    return JSON.parse(storage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export const captureUtmParameters = (
  search = window.location.search,
  storage = window.localStorage
) => {
  const incoming = parseUtmParameters(search)
  if (!Object.keys(incoming).length) return getStoredUtmParameters(storage)

  const attribution = {
    ...getStoredUtmParameters(storage),
    ...incoming,
    landing_page: `${window.location.pathname}${search}`,
    captured_at: new Date().toISOString(),
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Campaign attribution must never block the portfolio experience.
  }

  return attribution
}

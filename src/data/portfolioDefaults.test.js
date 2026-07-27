import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_SITE_CONTENT,
} from './portfolioDefaults'

describe('portfolio migration defaults', () => {
  test('uses stable, unique seed IDs for retry-safe imports', () => {
    const entries = [
      ...DEFAULT_SKILLS,
      ...DEFAULT_PROJECTS,
      ...DEFAULT_EXPERIENCE,
      ...DEFAULT_EDUCATION,
    ]
    const ids = entries.map((entry) => entry.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.startsWith('seed-'))).toBe(true)
  })

  test('provides complete fallback content before migration', () => {
    expect(DEFAULT_SITE_CONTENT.home.name).toBeTruthy()
    expect(DEFAULT_SITE_CONTENT.about.paragraphs.length).toBeGreaterThan(0)
    expect(DEFAULT_SITE_CONTENT.skills.paragraphs.length).toBeGreaterThan(0)
    expect(DEFAULT_PROJECTS.every((project) => project.imageUrl)).toBe(true)
    expect(DEFAULT_PROJECTS.every((project) => project.published)).toBe(true)
  })
})

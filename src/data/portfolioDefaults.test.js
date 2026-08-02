import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_PROJECTS,
  DEFAULT_SKILLS,
  DEFAULT_SITE_CONTENT,
  mergeSiteContentDefaults,
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
    expect(DEFAULT_SITE_CONTENT.contact.email).toBeTruthy()
    expect(DEFAULT_SITE_CONTENT.contact.mapLatitude).toEqual(expect.any(Number))
    expect(DEFAULT_SKILLS.every((skill) => skill.category)).toBe(true)
    expect(DEFAULT_PROJECTS.every((project) => project.imageUrl)).toBe(true)
    expect(DEFAULT_PROJECTS.every((project) => project.published)).toBe(true)
  })

  test('deep-merges defaults into legacy site content', () => {
    const content = mergeSiteContentDefaults({
      home: { name: 'Updated name' },
      social: { githubUrl: 'https://github.com/updated' },
    })

    expect(content.home.name).toBe('Updated name')
    expect(content.home.role).toBe(DEFAULT_SITE_CONTENT.home.role)
    expect(content.social.linkedinUrl).toBe(DEFAULT_SITE_CONTENT.social.linkedinUrl)
    expect(content.contact).toEqual(DEFAULT_SITE_CONTENT.contact)
  })
})

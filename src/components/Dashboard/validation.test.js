import {
  isCoordinateInRange,
  isEmail,
  isHttpUrl,
  validateEntry,
  validateImage,
  validatePdf,
} from './validation'

describe('dashboard validation', () => {
  test('only accepts HTTP and HTTPS links', () => {
    expect(isHttpUrl('https://example.com')).toBe(true)
    expect(isHttpUrl('http://localhost:3000')).toBe(true)
    expect(isHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isHttpUrl('not a url')).toBe(false)
  })

  test('validates email addresses and map coordinates', () => {
    expect(isEmail('ravindra@example.com')).toBe(true)
    expect(isEmail('not-an-email')).toBe(false)
    expect(isCoordinateInRange('18.5089', -90, 90)).toBe(true)
    expect(isCoordinateInRange('', -90, 90)).toBe(false)
    expect(isCoordinateInRange(181, -180, 180)).toBe(false)
  })

  test('validates image type and size', () => {
    expect(
      validateImage(new File(['image'], 'image.gif', { type: 'image/gif' }))
    ).toMatch(/JPEG/)
    expect(
      validateImage({
        name: 'large.jpg',
        type: 'image/jpeg',
        size: 5 * 1024 * 1024 + 1,
      })
    ).toMatch(/5 MB/)
    expect(
      validateImage(new File(['image'], 'image.webp', { type: 'image/webp' }))
    ).toBe('')
  })

  test('only accepts PDF CV files up to 10 MB', () => {
    expect(
      validatePdf(new File(['text'], 'cv.txt', { type: 'text/plain' }))
    ).toMatch(/PDF/)
    expect(
      validatePdf({
        name: 'large.pdf',
        type: 'application/pdf',
        size: 10 * 1024 * 1024 + 1,
      })
    ).toMatch(/10 MB/)
  })

  test('requires project content, rejects unsafe URLs, and allows no image', () => {
    const errors = validateEntry(
      'projects',
      {
        name: '',
        description: '',
        skills: [],
        websiteUrl: 'javascript:alert(1)',
        githubUrl: '',
        file: null,
      },
      false
    )

    expect(errors).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
      })
    )
    expect(errors.file).toBeUndefined()
  })

  test('limits experience bullet count and length', () => {
    const errors = validateEntry(
      'experience',
      {
        title: 'Developer',
        company: 'Example',
        period: '2024 - Present',
        bullets: Array.from({ length: 11 }, () => 'A highlight'),
      },
      false
    )

    expect(errors.bullets).toMatch(/10/)
  })

  test('validates new optional entry fields when supplied', () => {
    expect(
      validateEntry(
        'experience',
        {
          title: 'Developer',
          company: 'Example',
          period: '2024 - 2026',
          bullets: [],
          leavingReason: 'x'.repeat(501),
        },
        false
      ).leavingReason
    ).toMatch(/500/)

    expect(
      validateEntry(
        'education',
        {
          institution: 'MIT',
          degree: 'B.Tech',
          dates: '2020 - 2023',
          grade: 'x'.repeat(81),
        },
        false
      ).grade
    ).toMatch(/80/)
  })
})

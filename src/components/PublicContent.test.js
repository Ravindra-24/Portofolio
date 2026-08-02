import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Projects from './Projects'
import Experience from './Experience'
import Education from './Education/Education'
import Skills from './Skills/Skills'
import Contact from './Contact'
import Sidebar from './Sidebar'

const mockCollections = {}
const mockSiteContent = {
  skills: { paragraphs: ['Skills introduction'] },
  social: {
    linkedinUrl: 'https://linkedin.com/in/example',
    githubUrl: 'https://github.com/example',
  },
  contact: {
    displayName: 'Portfolio Owner',
    email: 'owner@example.com',
    phone: '+91 12345 67890',
    location: 'Pune, India',
    portfolioUrl: 'https://example.com',
    mapLatitude: 18.5,
    mapLongitude: 73.9,
  },
}

jest.mock('../hooks/usePortfolioData', () => ({
  usePortfolioCollection: (section) => ({
    data: mockCollections[section] || [],
    error: '',
  }),
  useSiteContent: () => ({ content: mockSiteContent, error: '' }),
}))

jest.mock('react-loaders', () => () => null)
jest.mock('./AnimatedLetters', () => ({ strArray }) => strArray.join(''))
jest.mock('TagCloud', () => () => ({ destroy: jest.fn() }))
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Circle: ({ children }) => <div>{children}</div>,
  Tooltip: ({ children }) => <span>{children}</span>,
}))

describe('dashboard-managed public content', () => {
  beforeEach(() => {
    Object.keys(mockCollections).forEach((key) => delete mockCollections[key])
  })

  test('renders project metadata and a placeholder without an image', () => {
    mockCollections.projects = [
      {
        id: 'project-1',
        name: 'Smartly Manage',
        description: 'Sales call tracking SaaS',
        skills: ['React', 'Firebase'],
        role: 'Solo Full-Stack Developer',
        period: 'Jun 2026 - Present',
      },
    ]

    render(<Projects />)
    expect(
      screen.getByRole('img', { name: /Smartly Manage project preview placeholder/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Solo Full-Stack Developer')).toBeInTheDocument()
    expect(screen.getByText('Jun 2026 - Present')).toBeInTheDocument()
  })

  test('renders optional experience and education details', () => {
    mockCollections.experience = [
      {
        id: 'experience-1',
        title: 'Developer',
        company: 'Example Company',
        period: '2024 - 2026',
        bullets: [],
        leavingReason: 'Career growth',
      },
    ]
    const { unmount } = render(<Experience />)
    expect(screen.getByText(/Career growth/i)).toBeInTheDocument()
    unmount()

    mockCollections.education = [
      {
        id: 'education-1',
        institution: 'MIT',
        degree: 'B.Tech',
        dates: '2020 - 2023',
        grade: 'CGPA: 8.65/10',
      },
    ]
    render(<Education />)
    expect(screen.getByText('CGPA: 8.65/10')).toBeInTheDocument()
  })

  test('groups skills and renders dashboard-managed contact details', () => {
    mockCollections.skills = [
      { id: 'skill-1', name: 'React', category: 'frontend' },
      { id: 'skill-2', name: 'Jest', category: 'mobile-testing-tools' },
      { id: 'legacy-skill', name: 'Git', category: undefined },
    ]
    const { unmount } = render(<Skills />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Mobile, Testing & Tools')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
    unmount()

    render(<Contact />)
    expect(screen.getByText('Portfolio Owner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'owner@example.com' })).toHaveAttribute(
      'href',
      'mailto:owner@example.com'
    )
    expect(screen.getByRole('link', { name: '+91 12345 67890' })).toHaveAttribute(
      'href',
      'tel:+91 12345 67890'
    )
    expect(screen.getByTestId('map')).toBeInTheDocument()
  })

  test('includes Education in public navigation', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
    expect(container.querySelector('a[href="/education"]')).toBeInTheDocument()
  })
})

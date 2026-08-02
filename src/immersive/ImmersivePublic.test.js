import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import ImmersiveHome from './ImmersiveHome'
import ImmersiveCaseStudy from './ImmersiveCaseStudy'

const mockScrollTo = jest.fn()
const mockTransitionTo = jest.fn((callback) => callback())
const mockData = {
  content: {
    home: { name: 'Ravindra', tagline: 'React / Firebase' },
    about: { paragraphs: ['About paragraph one.', 'About paragraph two.'] },
    social: { linkedinUrl: 'https://linkedin.com', githubUrl: 'https://github.com' },
    contact: { displayName: 'Ravindra Pawar', email: 'me@example.com', location: 'Pune, India' },
    cv: { fileUrl: 'https://example.com/cv.pdf' },
  },
  projects: [
    {
      id: 'project-1',
      name: 'Product One',
      description: 'A useful product.',
      imageUrl: 'https://example.com/project.jpg',
      skills: ['React', 'Firebase'],
      caseStudy: {
        challenge: 'A difficult workflow.',
        approach: 'A focused product system.',
        outcome: 'A clearer experience.',
      },
      gallery: [
        {
          imageUrl: 'https://example.com/detail.jpg',
          storagePath: 'portfolio/projects/project-1/detail.jpg',
          alt: 'Product dashboard detail',
        },
      ],
    },
  ],
  experience: [
    { id: 'experience-1', title: 'Developer', company: 'Company', period: '2024', bullets: [] },
  ],
  education: [
    { id: 'education-1', degree: 'B.Tech', institution: 'MIT', dates: '2023' },
  ],
  skills: [{ id: 'skill-1', name: 'React', category: 'frontend' }],
  certificates: [],
  loading: false,
  error: '',
}

jest.mock('./data/ImmersiveDataContext', () => ({
  useImmersiveData: () => mockData,
}))
jest.mock('./motion/ImmersiveMotionContext', () => ({
  useImmersiveMotion: () => ({
    lenis: { scrollTo: mockScrollTo, stop: jest.fn(), start: jest.fn() },
    reducedMotion: true,
    transitionTo: mockTransitionTo,
  }),
}))
jest.mock('./motion/useRevealAnimations', () => () => undefined)
jest.mock('@emailjs/browser', () => ({ sendForm: jest.fn() }))

const LocationProbe = () => {
  const location = useLocation()
  return <output data-testid="location">{location.pathname}</output>
}

describe('Immersive public experience', () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
    mockTransitionTo.mockClear()
    mockTransitionTo.mockImplementation((callback) => callback())
    window.sessionStorage.clear()
  })

  test('renders shared content and deep-links through SPA navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/project']}>
        <Routes>
          <Route path="/project/:projectId" element={<LocationProbe />} />
          <Route path="*" element={<ImmersiveHome />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /projects that turn complexity/i })).toBeInTheDocument()
    expect(screen.getByText('About paragraph one.')).toBeInTheDocument()
    expect(screen.getByText('A useful product.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      'https://example.com/cv.pdf'
    )
    fireEvent.click(
      screen.getByRole('link', { name: /view product one case study/i }),
      { button: 0 }
    )
    expect(mockTransitionTo).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/project/project-1')
    })
    expect(window.sessionStorage.getItem('immersive:return-scroll')).not.toBeNull()
  })

  test('smoothly scrolls section navigation after the initial route is positioned', async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="*"
            element={<><ImmersiveHome /><LocationProbe /></>}
          />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => expect(mockScrollTo).toHaveBeenCalled())
    mockScrollTo.mockClear()
    fireEvent.click(screen.getByRole('link', { name: 'About' }))

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/about')
      expect(mockScrollTo).toHaveBeenCalledWith(
        document.getElementById('im-about'),
        expect.objectContaining({ immediate: false })
      )
    })
  })

  test('does not intercept modifier-clicks on project links', () => {
    render(<MemoryRouter><ImmersiveHome /></MemoryRouter>)
    fireEvent.click(screen.getByRole('link', { name: /view product one case study/i }), {
      ctrlKey: true,
    })
    expect(mockTransitionTo).not.toHaveBeenCalled()
  })

  test('renders optional case-study narrative and gallery data', () => {
    render(
      <MemoryRouter initialEntries={['/project/project-1']}>
        <Routes>
          <Route path="/project/:projectId" element={<ImmersiveCaseStudy />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: 'Product One' })).toBeInTheDocument()
    expect(screen.getByText('A difficult workflow.')).toBeInTheDocument()
    expect(screen.getByAltText('Product dashboard detail')).toBeInTheDocument()
  })

  test('handles unknown project IDs without rendering stale content', () => {
    render(
      <MemoryRouter initialEntries={['/project/missing']}>
        <Routes>
          <Route path="/project/:projectId" element={<ImmersiveCaseStudy />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /no longer available/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return to selected work/i })).toBeInTheDocument()
  })
})

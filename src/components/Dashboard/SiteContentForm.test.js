import { fireEvent, render, screen } from '@testing-library/react'
import SiteContentForm from './SiteContentForm'
import { DEFAULT_SITE_CONTENT } from '../../data/portfolioDefaults'

const props = {
  section: 'contact',
  content: DEFAULT_SITE_CONTENT,
  busy: false,
  uploadProgress: 0,
  onSave: jest.fn(),
  onDirtyChange: jest.fn(),
}

describe('SiteContentForm contact content', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('submits valid dashboard-managed contact details', () => {
    render(<SiteContentForm {...props} />)
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '+91 78879 75721' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save content/i }))

    expect(props.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: 'Ravindra Pawar',
        phone: '+91 78879 75721',
        mapLatitude: 18.5089,
      })
    )
  })

  test('rejects invalid email, URL, and coordinates', () => {
    render(<SiteContentForm {...props} />)
    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'invalid' },
    })
    fireEvent.change(screen.getByLabelText(/portfolio url/i), {
      target: { value: 'javascript:alert(1)' },
    })
    fireEvent.change(screen.getByLabelText(/map latitude/i), {
      target: { value: '91' },
    })
    fireEvent.click(screen.getByRole('button', { name: /save content/i }))

    expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    expect(screen.getByText(/valid HTTP or HTTPS/i)).toBeInTheDocument()
    expect(screen.getByText(/between -90 and 90/i)).toBeInTheDocument()
    expect(props.onSave).not.toHaveBeenCalled()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import EntryForm from './EntryForm'

const baseProps = {
  busy: false,
  uploadProgress: 0,
  item: null,
  onSave: jest.fn(),
  onCancel: jest.fn(),
  onDirtyChange: jest.fn(),
}

describe('EntryForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows inline validation and does not submit an empty skill', () => {
    render(<EntryForm {...baseProps} section="skills" />)
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))

    expect(screen.getByText('Skill is required.')).toBeInTheDocument()
    expect(baseProps.onSave).not.toHaveBeenCalled()
  })

  test('submits a valid skill and reports dirty changes', () => {
    render(<EntryForm {...baseProps} section="skills" />)
    fireEvent.change(screen.getByLabelText(/skill name/i), {
      target: { value: 'TypeScript' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))

    expect(baseProps.onDirtyChange).toHaveBeenCalledWith(true)
    expect(baseProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'TypeScript',
        category: 'other',
        published: true,
      })
    )
  })

  test('loads an existing entry for editing', () => {
    render(
      <EntryForm
        {...baseProps}
        section="education"
        item={{
          id: 'education-1',
          institution: 'MIT',
          degree: 'B.Tech',
          dates: '2020 - 2023',
          published: false,
          order: 0,
        }}
      />
    )

    expect(screen.getByDisplayValue('MIT')).toBeInTheDocument()
    expect(screen.getByDisplayValue('B.Tech')).toBeInTheDocument()
    expect(screen.getByLabelText(/published/i)).not.toBeChecked()
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  test('normalizes project skills and allows submission without an image', () => {
    render(<EntryForm {...baseProps} section="projects" />)
    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: 'Portfolio' },
    })
    fireEvent.change(screen.getByLabelText(/^description/i), {
      target: { value: 'A project' },
    })
    fireEvent.change(screen.getByLabelText(/skills.*comma/i), {
      target: { value: 'React, Firebase, ' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))

    expect(baseProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ skills: ['React', 'Firebase'] })
    )
  })

  test('submits optional project, education, and experience metadata', () => {
    const { rerender } = render(
      <EntryForm key="projects" {...baseProps} section="projects" />
    )
    fireEvent.change(screen.getByLabelText(/project name/i), {
      target: { value: 'Smartly Manage' },
    })
    fireEvent.change(screen.getByLabelText(/^description/i), {
      target: { value: 'Sales call tracking SaaS' },
    })
    fireEvent.change(screen.getByLabelText(/project role/i), {
      target: { value: 'Solo Full-Stack Developer' },
    })
    fireEvent.change(screen.getByLabelText(/project period/i), {
      target: { value: 'Jun 2026 - Present' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))
    expect(baseProps.onSave).toHaveBeenLastCalledWith(
      expect.objectContaining({
        role: 'Solo Full-Stack Developer',
        period: 'Jun 2026 - Present',
      })
    )

    rerender(<EntryForm key="education" {...baseProps} section="education" />)
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: 'MIT' },
    })
    fireEvent.change(screen.getByLabelText(/^degree/i), {
      target: { value: 'B.Tech' },
    })
    fireEvent.change(screen.getByLabelText(/^dates/i), {
      target: { value: '2020 - 2023' },
    })
    fireEvent.change(screen.getByLabelText(/grade \/ score/i), {
      target: { value: 'CGPA: 8.65/10' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))
    expect(baseProps.onSave).toHaveBeenLastCalledWith(
      expect.objectContaining({ grade: 'CGPA: 8.65/10' })
    )

    rerender(<EntryForm key="experience" {...baseProps} section="experience" />)
    fireEvent.change(screen.getByLabelText(/^role/i), {
      target: { value: 'Developer' },
    })
    fireEvent.change(screen.getByLabelText(/^company/i), {
      target: { value: 'Example' },
    })
    fireEvent.change(screen.getByLabelText(/^period/i), {
      target: { value: '2024 - 2026' },
    })
    fireEvent.change(screen.getByLabelText(/reason for leaving/i), {
      target: { value: 'Career growth' },
    })
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))
    expect(baseProps.onSave).toHaveBeenLastCalledWith(
      expect.objectContaining({ leavingReason: 'Career growth' })
    )
  })
})

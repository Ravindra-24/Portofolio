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
      expect.objectContaining({ name: 'TypeScript', published: true })
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

  test('keeps delimiters while typing and normalizes them on submit', () => {
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
    fireEvent.change(screen.getByLabelText(/^image/i), {
      target: {
        files: [new File(['image'], 'portfolio.png', { type: 'image/png' })],
      },
    })
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }))

    expect(baseProps.onSave).toHaveBeenCalledWith(
      expect.objectContaining({ skills: ['React', 'Firebase'] })
    )
  })
})

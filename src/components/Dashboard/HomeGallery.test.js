import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Home from './home'
import {
  deleteManagedFile,
  getAdminEntries,
  getMigrationStatus,
  getSiteContent,
  saveEntry,
  uploadPortfolioFile,
} from '../../services/portfolioRepository'

jest.mock('../../firebase', () => ({
  auth: { signOut: jest.fn() },
}))

jest.mock('../../services/portfolioRepository', () => ({
  createEntryId: jest.fn(() => 'new-entry'),
  deleteManagedFile: jest.fn(() => Promise.resolve()),
  getAdminEntries: jest.fn(),
  getMigrationStatus: jest.fn(),
  getSiteContent: jest.fn(),
  importExistingPortfolio: jest.fn(),
  removeEntry: jest.fn(),
  saveEntry: jest.fn(),
  saveSiteContent: jest.fn(),
  swapEntryOrder: jest.fn(),
  uploadPortfolioFile: jest.fn(),
}))

jest.mock('./SiteContentForm', () => () => null)

const existingProject = {
  id: 'project-1',
  name: 'Portfolio',
  description: 'Project description',
  skills: ['React'],
  published: true,
  order: 0,
  gallery: [
    {
      imageUrl: 'https://example.com/old.jpg',
      storagePath: 'portfolio/projects/project-1/old.jpg',
      alt: 'Old project detail',
    },
  ],
}

describe('project gallery persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getMigrationStatus.mockResolvedValue(true)
    getSiteContent.mockResolvedValue({})
    getAdminEntries.mockImplementation((section) =>
      Promise.resolve(section === 'projects' ? [existingProject] : [])
    )
    uploadPortfolioFile.mockResolvedValue({
      fileUrl: 'https://example.com/new.jpg',
      storagePath: 'portfolio/projects/project-1/new.jpg',
      fileName: 'new.jpg',
    })
    saveEntry.mockResolvedValue('project-1')
  })

  test('commits new gallery media before cleaning removed managed files', async () => {
    render(<Home />)
    fireEvent.click(await screen.findByRole('button', { name: 'Projects' }))
    expect(await screen.findByText(/0\/3 case-study sections · 1\/4 gallery images/i)).toBeInTheDocument()
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

    const newFile = new File(['image'], 'new.jpg', { type: 'image/jpeg' })
    fireEvent.change(screen.getByLabelText(/add gallery images/i), {
      target: { files: [newFile] },
    })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    await waitFor(() => expect(saveEntry).toHaveBeenCalled())
    expect(saveEntry).toHaveBeenCalledWith(
      'projects',
      'project-1',
      expect.objectContaining({
        gallery: [
          {
            imageUrl: 'https://example.com/new.jpg',
            storagePath: 'portfolio/projects/project-1/new.jpg',
            alt: 'Portfolio detail 1',
          },
        ],
      }),
      false
    )
    expect(deleteManagedFile).toHaveBeenCalledWith(
      'portfolio/projects/project-1/old.jpg'
    )
  })

  test('rolls back newly uploaded gallery media when the database save fails', async () => {
    saveEntry.mockRejectedValueOnce(new Error('write failed'))
    render(<Home />)
    fireEvent.click(await screen.findByRole('button', { name: 'Projects' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Edit' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
    fireEvent.change(screen.getByLabelText(/add gallery images/i), {
      target: { files: [new File(['image'], 'new.jpg', { type: 'image/jpeg' })] },
    })
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(await screen.findByText(/previous content is unchanged/i)).toBeInTheDocument()
    expect(deleteManagedFile).toHaveBeenCalledWith(
      'portfolio/projects/project-1/new.jpg'
    )
    expect(deleteManagedFile).not.toHaveBeenCalledWith(
      'portfolio/projects/project-1/old.jpg'
    )
  })
})

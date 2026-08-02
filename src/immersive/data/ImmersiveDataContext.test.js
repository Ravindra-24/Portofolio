import { render, screen } from '@testing-library/react'
import {
  getLegacyCertificates,
  getLegacyCv,
  getMigrationStatus,
  getPublicEntries,
  getSiteContent,
} from '../../services/portfolioRepository'
import { ImmersiveDataProvider, useImmersiveData } from './ImmersiveDataContext'

jest.mock('../../services/portfolioRepository', () => ({
  getLegacyCertificates: jest.fn(),
  getLegacyCv: jest.fn(),
  getMigrationStatus: jest.fn(),
  getPublicEntries: jest.fn(),
  getSiteContent: jest.fn(),
}))

const DataProbe = () => {
  const { content, certificates, loading } = useImmersiveData()
  if (loading) return <p>Loading</p>
  return (
    <>
      <p>{content.cv?.fileUrl}</p>
      <p>{certificates.map((certificate) => certificate.name).join(', ')}</p>
    </>
  )
}

describe('Immersive data fallbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getMigrationStatus.mockResolvedValue(true)
    getSiteContent.mockResolvedValue({ cv: { fileUrl: '' } })
    getPublicEntries.mockImplementation((section) =>
      Promise.resolve(section === 'certificates' ? [] : [])
    )
    getLegacyCv.mockResolvedValue({
      fileUrl: 'https://example.com/legacy-cv.pdf',
      fileName: 'Ravindra CV.pdf',
      storagePath: '',
    })
    getLegacyCertificates.mockResolvedValue([
      { id: 'legacy-certificate', name: 'Legacy certificate' },
    ])
  })

  test('keeps legacy CV and certificate media available after CMS migration', async () => {
    render(
      <ImmersiveDataProvider>
        <DataProbe />
      </ImmersiveDataProvider>
    )

    expect(await screen.findByText('https://example.com/legacy-cv.pdf')).toBeInTheDocument()
    expect(screen.getByText('Legacy certificate')).toBeInTheDocument()
    expect(getPublicEntries).toHaveBeenCalledTimes(5)
    expect(getLegacyCv).toHaveBeenCalledTimes(1)
  })
})

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage'
import { db, storage } from '../firebase'
import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_PROJECTS,
  DEFAULT_SITE_CONTENT,
  DEFAULT_SKILLS,
  mergeSiteContentDefaults,
} from '../data/portfolioDefaults'

export const ENTRY_SECTIONS = [
  'skills',
  'projects',
  'experience',
  'education',
  'certificates',
]

const MIGRATION_REF = doc(db, 'portfolioMeta', 'migration-v1')
const SITE_CONTENT_REF = doc(db, 'siteContent', 'main')

const cleanFileName = (name = 'file') =>
  name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')

export const getMigrationStatus = async () => {
  const snapshot = await getDoc(MIGRATION_REF)
  return snapshot.exists()
}

export const getSiteContent = async () => {
  const snapshot = await getDoc(SITE_CONTENT_REF)
  const stored = snapshot.exists() ? snapshot.data() : {}
  return mergeSiteContentDefaults(stored)
}

export const getPublicEntries = async (section) => {
  const snapshot = await getDocs(
    query(
      collection(db, section),
      where('published', '==', true),
      orderBy('order', 'asc')
    )
  )
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export const getAdminEntries = async (section) => {
  const snapshot = await getDocs(
    query(collection(db, section), orderBy('order', 'asc'))
  )
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export const isAdminUser = async (uid) => {
  if (!uid) return false
  const snapshot = await getDoc(doc(db, 'admins', uid))
  return snapshot.exists()
}

export const createEntryId = (section) => doc(collection(db, section)).id

export const saveEntry = async (section, id, values, isNew = false) => {
  const payload = {
    ...values,
    updatedAt: serverTimestamp(),
  }

  if (isNew) payload.createdAt = serverTimestamp()

  await setDoc(doc(db, section, id), payload, { merge: true })
  return id
}

export const saveSiteContent = async (patch) => {
  await setDoc(
    SITE_CONTENT_REF,
    { ...patch, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

export const removeEntry = async (section, item) => {
  await deleteDoc(doc(db, section, item.id))

  const managedPaths = [
    item.storagePath,
    ...(Array.isArray(item.gallery)
      ? item.gallery.map((galleryItem) => galleryItem.storagePath)
      : []),
  ].filter((path) => path?.startsWith('portfolio/'))
  const cleanupResults = await Promise.allSettled(
    managedPaths.map((path) => deleteObject(ref(storage, path)))
  )

  return {
    cleanupWarning: cleanupResults.some((result) => result.status === 'rejected'),
  }
}

export const swapEntryOrder = async (section, first, second) => {
  const batch = writeBatch(db)
  batch.update(doc(db, section, first.id), {
    order: second.order,
    updatedAt: serverTimestamp(),
  })
  batch.update(doc(db, section, second.id), {
    order: first.order,
    updatedAt: serverTimestamp(),
  })
  await batch.commit()
}

export const uploadPortfolioFile = (
  file,
  section,
  documentId,
  onProgress
) =>
  new Promise((resolve, reject) => {
    const path = `portfolio/${section}/${documentId}/${Date.now()}-${cleanFileName(
      file.name
    )}`
    const storageRef = ref(storage, path)
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
    })

    task.on(
      'state_changed',
      (snapshot) => {
        const progress =
          snapshot.totalBytes > 0
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            : 0
        onProgress?.(progress)
      },
      reject,
      async () => {
        try {
          const fileUrl = await getDownloadURL(task.snapshot.ref)
          resolve({ fileUrl, storagePath: path, fileName: file.name })
        } catch (error) {
          reject(error)
        }
      }
    )
  })

export const deleteManagedFile = async (storagePath) => {
  if (!storagePath?.startsWith('portfolio/')) return
  try {
    await deleteObject(ref(storage, storagePath))
  } catch (error) {
    // Replaced content is already saved; stale file cleanup is best-effort.
  }
}

const copyBundledImage = async (sourceUrl, path) => {
  const response = await fetch(sourceUrl)
  if (!response.ok) throw new Error('Could not read a bundled project image.')
  const blob = await response.blob()
  const snapshot = await uploadBytes(ref(storage, path), blob, {
    contentType: blob.type || 'image/jpeg',
  })
  return getDownloadURL(snapshot.ref)
}

export const getLegacyCertificates = async () => {
  const categories = [
    ['Web Development Certificates', 'full-stack'],
    ['Google Certificates', 'google'],
    ['Other Certificates', 'other'],
  ]
  const results = []

  for (const [collectionName, category] of categories) {
    const snapshot = await getDocs(collection(db, collectionName))
    snapshot.docs.forEach((item) => {
      results.push({
        id: `legacy-${category}-${item.id}`,
        ...item.data(),
        category,
      })
    })
  }

  return results
}

export const getLegacyCv = async () => {
  const snapshot = await getDocs(collection(db, 'CV'))
  const item = snapshot.docs[0]?.data()
  return item
    ? { fileUrl: item.image || '', storagePath: '', fileName: item.name || 'CV' }
    : { fileUrl: '', storagePath: '', fileName: '' }
}

export const importExistingPortfolio = async (onProgress) => {
  if (await getMigrationStatus()) {
    return { alreadyImported: true }
  }

  onProgress?.('Reading existing Firebase content…')
  const [certificates, cvSnapshot] = await Promise.all([
    getLegacyCertificates(),
    getDocs(collection(db, 'CV')),
  ])

  onProgress?.('Copying project images to Firebase Storage…')
  const migratedProjects = []
  for (let index = 0; index < DEFAULT_PROJECTS.length; index += 1) {
    const project = DEFAULT_PROJECTS[index]
    const storagePath = `portfolio/projects/${project.id}/seed-${cleanFileName(
      project.name
    )}.jpg`
    const imageUrl = await copyBundledImage(project.imageUrl, storagePath)
    migratedProjects.push({ ...project, imageUrl, storagePath })
    onProgress?.(
      `Copied project image ${index + 1} of ${DEFAULT_PROJECTS.length}…`
    )
  }

  const legacyCv = cvSnapshot.docs[0]?.data()
  const siteContent = {
    ...DEFAULT_SITE_CONTENT,
    cv: {
      fileUrl: legacyCv?.image || '',
      storagePath: '',
      fileName: legacyCv?.name || 'CV',
    },
  }

  onProgress?.('Writing portfolio records…')
  const batch = writeBatch(db)
  batch.set(SITE_CONTENT_REF, {
    ...siteContent,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  const addSeedEntries = (section, entries) => {
    entries.forEach((entry) => {
      const { id, ...values } = entry
      batch.set(doc(db, section, id), {
        ...values,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    })
  }

  addSeedEntries('skills', DEFAULT_SKILLS)
  addSeedEntries('projects', migratedProjects)
  addSeedEntries('experience', DEFAULT_EXPERIENCE)
  addSeedEntries('education', DEFAULT_EDUCATION)
  addSeedEntries(
    'certificates',
    certificates.map((certificate, order) => ({
      ...certificate,
      description: certificate.description || '',
      imageUrl: certificate.image || '',
      storagePath: '',
      order,
      published: true,
    }))
  )

  batch.set(MIGRATION_REF, {
    version: 1,
    completedAt: serverTimestamp(),
  })
  await batch.commit()
  onProgress?.('Import complete.')
  return { alreadyImported: false }
}

export const updateEntry = (section, id, values) =>
  updateDoc(doc(db, section, id), {
    ...values,
    updatedAt: serverTimestamp(),
  })

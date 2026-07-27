/** @jest-environment node */

import fs from 'fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'

const runRulesTests = process.env.FIRESTORE_EMULATOR_HOST ? describe : describe.skip

runRulesTests('Firebase portfolio security rules', () => {
  let testEnv

  jest.setTimeout(20000)

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-portfolio-cms',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
      },
      storage: {
        rules: fs.readFileSync('storage.rules', 'utf8'),
      },
    })
  })

  beforeEach(async () => {
    await testEnv.clearFirestore()
    await testEnv.clearStorage()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const adminDb = context.firestore()
      await setDoc(doc(adminDb, 'admins', 'admin-user'), {})
      await setDoc(doc(adminDb, 'projects', 'published-project'), {
        name: 'Published',
        description: 'Visible project',
        skills: [],
        published: true,
        order: 0,
      })
      await setDoc(doc(adminDb, 'projects', 'draft-project'), {
        name: 'Draft',
        description: 'Hidden project',
        skills: [],
        published: false,
        order: 1,
      })
    })
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  test('public users can read published entries but not drafts', async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertSucceeds(getDoc(doc(db, 'projects', 'published-project')))
    await assertFails(getDoc(doc(db, 'projects', 'draft-project')))
    const publicQuery = query(
      collection(db, 'projects'),
      where('published', '==', true),
      orderBy('order', 'asc')
    )
    const result = await assertSucceeds(getDocs(publicQuery))
    expect(result.docs.map((item) => item.id)).toEqual(['published-project'])
  })

  test('authenticated non-admin users cannot write', async () => {
    const db = testEnv.authenticatedContext('regular-user').firestore()
    await assertFails(
      setDoc(doc(db, 'skills', 'skill-1'), {
        name: 'React',
        published: true,
        order: 0,
      })
    )
  })

  test('administrators can create valid portfolio entries', async () => {
    const db = testEnv.authenticatedContext('admin-user').firestore()
    await assertSucceeds(
      setDoc(doc(db, 'skills', 'skill-1'), {
        name: 'React',
        published: true,
        order: 0,
      })
    )
  })

  test('storage accepts admin images and rejects non-admin uploads', async () => {
    const image = new Uint8Array([137, 80, 78, 71])
    const adminStorage = testEnv.authenticatedContext('admin-user').storage()
    const userStorage = testEnv.authenticatedContext('regular-user').storage()

    await assertSucceeds(
      uploadBytes(
        ref(adminStorage, 'portfolio/projects/project-1/image.png'),
        image,
        { contentType: 'image/png' }
      )
    )
    await assertFails(
      uploadBytes(
        ref(userStorage, 'portfolio/projects/project-2/image.png'),
        image,
        { contentType: 'image/png' }
      )
    )
  })

  test('storage rejects invalid media types', async () => {
    const adminStorage = testEnv.authenticatedContext('admin-user').storage()
    await assertFails(
      uploadBytes(
        ref(adminStorage, 'portfolio/projects/project-1/file.txt'),
        new Uint8Array([1, 2, 3]),
        { contentType: 'text/plain' }
      )
    )
  })
})

import { useRef, useState } from 'react'
import { auth, storage, db } from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc } from 'firebase/firestore'
import { collection } from 'firebase/firestore/lite'

const Home = () => {
  const form = useRef()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const savePortfolio = async (portfolio) => {
    await addDoc(collection(db, 'Other Certificates'), portfolio)
  }

  const submitPortfolio = async (e) => {
    e.preventDefault()

    if (isSubmitting || !form.current) return

    const name = form.current[0]?.value?.trim()
    const description = form.current[1]?.value?.trim()
    const url = form.current[2]?.value?.trim()
    const image = form.current[3]?.files?.[0]

    if (!name || !description || !url) {
      alert('Please fill all required fields.')
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = null

      if (image) {
        const fileName = `${Date.now()}-${image.name}`
        const storageRef = ref(storage, `portfolio/${fileName}`)
        const snapshot = await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      await savePortfolio({
        name,
        description,
        url,
        image: imageUrl,
      })

      form.current.reset()
      alert('Portfolio item added successfully.')
    } catch (error) {
      alert('Failed to add portfolio.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="dashboard">
      <form ref={form} onSubmit={submitPortfolio}>
        <p><input type="text" placeholder="Name" /></p>
        <p><textarea placeholder="Description" /></p>
        <p><input type="text" placeholder="Url" /></p>
        <p><input type="file" placeholder="Image" /></p>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <button type="button" onClick={() => auth.signOut()} disabled={isSubmitting}>
          Sign out
        </button>
      </form>
    </div>
  )
}

export default Home

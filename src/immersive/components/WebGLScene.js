import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useImmersiveMotion } from '../motion/ImmersiveMotionContext'

const WebGLScene = ({ lightMode = false }) => {
  const mountRef = useRef(null)
  const { reducedMotion, coarsePointer } = useImmersiveMotion()

  useEffect(() => {
    const mount = mountRef.current
    const saveData = Boolean(navigator.connection?.saveData)
    if (!mount || reducedMotion || coarsePointer || saveData) return undefined

    let renderer
    let frame
    let visible = !document.hidden
    const pointer = { x: 0, y: 0 }

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    } catch (error) {
      mount.dataset.webglFailed = 'true'
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
    camera.position.z = 6.2
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mount.appendChild(renderer.domElement)

    const particleCount = window.innerWidth < 700 ? 260 : 720
    const positions = new Float32Array(particleCount * 3)
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 11
      positions[index * 3 + 1] = (Math.random() - 0.5) * 8
      positions[index * 3 + 2] = (Math.random() - 0.5) * 5
    }
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: lightMode ? 0x087f8c : 0x4fefff,
      size: 0.018,
      transparent: true,
      opacity: 0.48,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    const orbGeometry = new THREE.IcosahedronGeometry(1.55, 2)
    const orbMaterial = new THREE.MeshBasicMaterial({
      color: lightMode ? 0x087f8c : 0x4fefff,
      wireframe: true,
      transparent: true,
      opacity: 0.11,
    })
    const orb = new THREE.Mesh(orbGeometry, orbMaterial)
    orb.position.set(1.8, 0.15, -0.5)
    scene.add(orb)

    const resize = () => {
      const { clientWidth, clientHeight } = mount
      camera.aspect = clientWidth / Math.max(clientHeight, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight, false)
    }
    const onPointer = (event) => {
      pointer.x = event.clientX / window.innerWidth - 0.5
      pointer.y = event.clientY / window.innerHeight - 0.5
    }
    const onVisibility = () => {
      visible = !document.hidden
      if (visible && !frame) frame = requestAnimationFrame(render)
    }
    const render = () => {
      frame = null
      if (!visible) return
      const time = performance.now() * 0.00012
      particles.rotation.y = time + pointer.x * 0.24
      particles.rotation.x += (pointer.y * 0.12 - particles.rotation.x) * 0.025
      orb.rotation.x = time * 1.7 + window.scrollY * 0.00016
      orb.rotation.y = time * 2.2 + pointer.x * 0.32
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    frame = requestAnimationFrame(render)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVisibility)
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      orbGeometry.dispose()
      orbMaterial.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [coarsePointer, lightMode, reducedMotion])

  return <div className="im-webgl" ref={mountRef} aria-hidden="true" />
}

export default WebGLScene

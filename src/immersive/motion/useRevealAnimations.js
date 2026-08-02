import { useEffect } from 'react'
import { gsap, ScrollTrigger, useImmersiveMotion } from './ImmersiveMotionContext'

const useRevealAnimations = (scopeRef, dependency) => {
  const { reducedMotion } = useImmersiveMotion()

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope || reducedMotion) return undefined

    const context = gsap.context(() => {
      gsap.utils.toArray('.im-reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          }
        )
      })

      const projectTrack = scope.querySelector('.im-project-track')
      const projectSection = scope.querySelector('.im-projects')
      if (
        projectTrack &&
        projectSection &&
        window.matchMedia('(min-width: 901px)').matches
      ) {
        const distance = () =>
          Math.max(0, projectTrack.scrollWidth - document.documentElement.clientWidth + 96)
        gsap.to(projectTrack, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: projectSection,
            start: 'top top',
            end: () => `+=${Math.max(window.innerHeight, distance())}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      }
    }, scope)

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(refreshFrame)
      context.revert()
    }
  }, [dependency, reducedMotion, scopeRef])
}

export default useRevealAnimations

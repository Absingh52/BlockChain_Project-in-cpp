import gsap from 'gsap'

export const animations = {
  cardHoverGlow: (element: HTMLElement, color = '#13a4ec') => {
    if (!element) return

    gsap.to(element, {
      boxShadow: `0 0 25px ${color}66`,
      borderColor: color,
      duration: 0.3,
      ease: 'power2.out',
    })
  },

  cardHoverGlowOut: (element: HTMLElement) => {
    if (!element) return

    gsap.to(element, {
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      borderColor: '#283339',
      duration: 0.3,
      ease: 'power2.out',
    })
  },

  cardLift: (element: HTMLElement) => {
    if (!element) return

    gsap.to(element, {
      y: -6,
      scale: 1.01,
      duration: 0.25,
      ease: 'power2.out',
    })
  },

  cardDrop: (element: HTMLElement) => {
    if (!element) return

    gsap.to(element, {
      y: 0,
      scale: 1,
      duration: 0.25,
      ease: 'power2.out',
    })
  },
}

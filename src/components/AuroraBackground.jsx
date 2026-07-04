import { useEffect, useRef } from 'react'

// Signature visual: a living double helix rotating in fake-3D, drawn on
// canvas with a simple perspective projection. Base pairs pulse with light
// as they swing to the front, like data being read off a strand.
export default function AuroraBackground() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // ---- ambient dust field ----
    const DUST_COUNT = Math.min(120, Math.floor((width * height) / 12000))
    const dust = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.006,
      depth: Math.random() * 0.6 + 0.2,
    }))

    // ---- helix geometry ----
    const STRANDS = 34 // rungs along the helix
    const HELIX_RADIUS_BASE = Math.min(width, 900) * 0.15
    const HELIX_HEIGHT = height * 1.35
    const FOCAL = 620

    let t = 0
    function resize() {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    function onMove(e) {
      const px = (e.clientX ?? width / 2) / width - 0.5
      const py = (e.clientY ?? height / 2) / height - 0.5
      mouse.current.x += (px - mouse.current.x) * 0.05
      mouse.current.y += (py - mouse.current.y) * 0.05
    }
    window.addEventListener('mousemove', onMove)

    function project(x, y, z, cx, cy) {
      const scale = FOCAL / (FOCAL + z)
      return {
        x: cx + x * scale,
        y: cy + y * scale,
        scale,
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      // base gradient — deep bio-lab void
      const base = ctx.createLinearGradient(0, 0, 0, height)
      base.addColorStop(0, '#04060a')
      base.addColorStop(0.55, '#060911')
      base.addColorStop(1, '#03040a')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2 + mouse.current.x * -40
      const cy = height / 2

      const rotation = t * 0.00035
      const tilt = mouse.current.y * 0.35

      // helix radius responds subtly to cursor x
      const radius = HELIX_RADIUS_BASE * (1 + mouse.current.x * 0.15)

      const nodesA = []
      const nodesB = []

      for (let i = 0; i <= STRANDS; i++) {
        const yFrac = i / STRANDS
        const y3 = (yFrac - 0.5) * HELIX_HEIGHT
        const angle = rotation + yFrac * Math.PI * 6

        const xA = Math.cos(angle) * radius
        const zA = Math.sin(angle) * radius
        const xB = Math.cos(angle + Math.PI) * radius
        const zB = Math.sin(angle + Math.PI) * radius

        const yA = y3 + zA * tilt * 0.3
        const yB = y3 + zB * tilt * 0.3

        nodesA.push({ ...project(xA, yA, zA, cx, cy), z: zA, yFrac })
        nodesB.push({ ...project(xB, yB, zB, cx, cy), z: zB, yFrac })
      }

      const order = nodesA
        .map((_, i) => i)
        .sort((i, j) => Math.max(nodesA[i].z, nodesB[i].z) - Math.max(nodesA[j].z, nodesB[j].z))

      function drawStrand(nodes, colorNear, colorFar) {
        ctx.beginPath()
        nodes.forEach((n, i) => {
          if (i === 0) ctx.moveTo(n.x, n.y)
          else ctx.lineTo(n.x, n.y)
        })
        const grad = ctx.createLinearGradient(0, cy - HELIX_HEIGHT / 2, 0, cy + HELIX_HEIGHT / 2)
        grad.addColorStop(0, colorFar)
        grad.addColorStop(0.5, colorNear)
        grad.addColorStop(1, colorFar)
        ctx.strokeStyle = grad
        ctx.lineWidth = 2.2
        ctx.shadowColor = colorNear
        ctx.shadowBlur = 14
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      drawStrand(nodesA, 'rgba(34,211,238,0.85)', 'rgba(34,211,238,0.08)')
      drawStrand(nodesB, 'rgba(240,89,156,0.85)', 'rgba(240,89,156,0.08)')

      order.forEach((i) => {
        const a = nodesA[i]
        const b = nodesB[i]
        const depthFactor = (a.scale + b.scale) / 2
        const facing = Math.abs(Math.cos(rotation + a.yFrac * Math.PI * 6))
        const pulse = 0.4 + 0.6 * Math.pow(facing, 2)
        const alpha = 0.15 + pulse * 0.55 * depthFactor

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(124, 77, 255, ${alpha})`
        ctx.lineWidth = 1.4 * depthFactor
        ctx.stroke()

        ;[a, b].forEach((n, idx) => {
          ctx.beginPath()
          const r = (1.6 + pulse * 2.2) * depthFactor
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
          ctx.fillStyle = idx === 0 ? `rgba(34,211,238,${0.5 + pulse * 0.5})` : `rgba(240,89,156,${0.5 + pulse * 0.5})`
          ctx.fill()
        })
      })

      dust.forEach((s) => {
        const tw = 0.4 + Math.sin(t * s.speed + s.phase) * 0.3
        const px = s.x + mouse.current.x * 24 * s.depth
        const py = s.y + mouse.current.y * 24 * s.depth
        ctx.beginPath()
        ctx.fillStyle = `rgba(200, 210, 240, ${0.35 * tw})`
        ctx.arc(px, py, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      const vg = ctx.createRadialGradient(width / 2, height / 2, height * 0.18, width / 2, height / 2, height * 0.85)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.62)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, width, height)

      t += 16
      if (!prefersReducedMotion) raf = requestAnimationFrame(draw)
    }

    draw()
    if (prefersReducedMotion && raf) cancelAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="aurora-canvas" aria-hidden="true" />
}

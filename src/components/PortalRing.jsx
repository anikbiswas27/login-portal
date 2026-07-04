import { motion } from 'framer-motion'

// A small vertical double-helix glyph that idles with a gentle twist,
// speeds into a "sequencing" spin while checking, and unravels into a
// vertical burst of light on success.
export default function PortalRing({ status }) {
  const spinUp = status === 'checking'
  const granted = status === 'granted'
  const denied = status === 'denied'

  // 7 rungs, alternating left/right curve to fake a twisting strand
  const rungs = Array.from({ length: 7 }, (_, i) => i)

  return (
    <div className={`portal-ring-wrap ${granted ? 'is-granted' : ''} ${denied ? 'is-denied' : ''}`}>
      <motion.svg
        viewBox="0 0 120 160"
        className="portal-ring"
        animate={
          granted
            ? { scaleY: 1.5, opacity: 0 }
            : denied
            ? { x: [0, -6, 6, -4, 0] }
            : { scaleY: 1, opacity: 1 }
        }
        transition={
          granted
            ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            : denied
            ? { duration: 0.4 }
            : { duration: 0.4 }
        }
      >
        <defs>
          <linearGradient id="strandA" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="strandB" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0599C" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#F0599C" />
            <stop offset="100%" stopColor="#F0599C" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* two sinusoidal backbones */}
        <motion.path
          d="M 30 4 C 60 24, 60 44, 30 64 C 0 84, 0 104, 30 124 C 60 144, 60 152, 30 156"
          fill="none"
          stroke="url(#strandA)"
          strokeWidth="2.4"
          strokeLinecap="round"
          animate={{ pathLength: [1, 1] }}
        />
        <motion.path
          d="M 90 4 C 60 24, 60 44, 90 64 C 120 84, 120 104, 90 124 C 60 144, 60 152, 90 156"
          fill="none"
          stroke="url(#strandB)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* base-pair rungs, each pulsing on its own beat */}
        {rungs.map((i) => {
          const yy = 12 + i * 21
          const bulge = i % 2 === 0
          const xA = bulge ? 46 : 14
          const xB = bulge ? 74 : 106
          return (
            <motion.g
              key={i}
              animate={{
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                duration: spinUp ? 0.5 : 2.4,
                repeat: Infinity,
                delay: i * (spinUp ? 0.06 : 0.18),
                ease: 'easeInOut',
              }}
            >
              <line x1={xA} y1={yy} x2={xB} y2={yy} stroke="#7C4DFF" strokeWidth="1.6" />
              <circle cx={xA} cy={yy} r="3" fill="#22D3EE" />
              <circle cx={xB} cy={yy} r="3" fill="#F0599C" />
            </motion.g>
          )
        })}
      </motion.svg>
    </div>
  )
}

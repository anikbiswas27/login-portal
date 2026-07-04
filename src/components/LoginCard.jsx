import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import PortalRing from './PortalRing.jsx'

const VALID_USER = 'Anik Biswas'
const VALID_PASS = 'helloworld'

export default function LoginCard() {
  const cardRef = useRef(null)

  // ---- 3D tilt driven by pointer position over the card ----
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 18,
  })
  const glowX = useTransform(rawX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(rawY, [-0.5, 0.5], ['0%', '100%'])

  function handlePointerMove(e) {
    const rect = cardRef.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handlePointerLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  // ---- form state ----
  const [username, setUsername] = useState(VALID_USER)
  const [password, setPassword] = useState(VALID_PASS)
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState('idle') // idle | checking | granted | denied
  const [message, setMessage] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (status === 'checking' || status === 'granted') return
    setStatus('checking')
    setMessage('')

    setTimeout(() => {
      const ok = username.trim() === VALID_USER && password === VALID_PASS
      if (ok) {
        setStatus('granted')
        setMessage('ACCESS GRANTED')
      } else {
        setStatus('denied')
        setMessage('Credentials not recognized. Try the demo values below.')
        setTimeout(() => setStatus('idle'), 900)
      }
    }, 1000)
  }

  const shakeVariants = {
    idle: { x: 0 },
    denied: {
      x: [0, -14, 12, -10, 8, -4, 0],
      transition: { duration: 0.55, ease: 'easeInOut' },
    },
  }

  return (
    <div className="scene">
      <motion.div
        ref={cardRef}
        className="card-perspective"
        style={{ rotateX, rotateY }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        animate={
          status === 'granted'
            ? { scale: 1.02, opacity: 0 }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: status === 'granted' ? 0.8 : 0.4, delay: status === 'granted' ? 0.5 : 0 }}
      >
        <motion.div
          className="card-glow"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) =>
                `radial-gradient(420px circle at ${gx} ${gy}, rgba(124,77,255,0.35), transparent 60%)`
            ),
          }}
        />

        <motion.form
          className="glass-card"
          onSubmit={handleSubmit}
          variants={shakeVariants}
          animate={status === 'denied' ? 'denied' : 'idle'}
        >
          <div className="ring-slot">
            <PortalRing status={status} />
          </div>

          <p className="eyebrow">GENE-AUTH &middot; SEQUENCE 01</p>
          <h1 className="title">Decode your access.</h1>
          <p className="subtitle">Your credentials are the sequence. Let the strand read you in.</p>
          <div className={`scan-line ${status === 'checking' ? 'is-active' : ''}`} aria-hidden="true" />

          <label className="field">
            <span className="field-label">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Anik Biswas"
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="password-row">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="helloworld"
              />
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button type="submit" className="submit-btn" disabled={status === 'checking'}>
            <span className="submit-btn-sheen" />
            {status === 'checking' ? (
              <span className="btn-spinner" aria-hidden="true" />
            ) : status === 'granted' ? (
              'Sequence matched'
            ) : (
              'Decode & Enter'
            )}
          </button>

          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                key={message}
                className={`status-line ${status === 'granted' ? 'is-good' : 'is-bad'}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="hint">
            Demo access &middot; username <strong>Anik Biswas</strong> &middot; password{' '}
            <strong>helloworld</strong>
          </p>

          <div className="signature">
            Made by <span>Anik Biswas (AK27)</span>
          </div>
        </motion.form>
      </motion.div>

      <AnimatePresence>
        {status === 'granted' && (
          <motion.div
            className="flash-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.8, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              SEQUENCE MATCHED
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              Identity confirmed. Welcome back, Anik Biswas.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

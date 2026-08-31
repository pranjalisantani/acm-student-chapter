import { useEffect, useRef, useState } from 'react'

import {
  ArrowUpRight,
  Check,
  Menu,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

import { accessFor, createPaymentOrder } from './payment'

const links = [
  'Home',
  'About',
  'Events',
  'Members',
  'Projects',
  'Achievements',
  'Resources',
  'Contact',
]

export function Button({ children, href, onClick, quiet = false }) {
  const C = href ? 'a' : 'button'

  return (
    <C
      href={href}
      onClick={onClick}
      className={`button ${quiet ? 'quiet' : ''}`}
    >
      {children}
      <ArrowUpRight size={15} />
    </C>
  )
}

export function Boot({ enter }) {
  const [p, setP] = useState(0)
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    let v = 0

    const t = setInterval(() => {
      v = Math.min(89, v + Math.max(1, Math.ceil((89 - v) / 10)))
      setP(v)

      if (v === 89) {
        clearInterval(t)
        setReady(true)
      }
    }, 72)

    return () => clearInterval(t)
  }, [])

  function start() {
    if (!ready || exiting) return

    setP(100)
    setExiting(true)

    setTimeout(enter, 1050)
  }

  useEffect(() => {
    const key = (e) => {
      if (ready && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        start()
      }
    }

    addEventListener('keydown', key)

    return () => removeEventListener('keydown', key)
  }, [ready, exiting])

  return (
    <div className={`boot ${exiting ? 'boot--exit' : ''}`}>
      <div className="bootgrain" />

      <p className="bootmeta top">
        ACM // STUDENT CHAPTER <span>BUILD 2026.08</span>
      </p>

      <p className="bootmeta bottom">
        VISUAL ENGINE ONLINE <span>NETWORK: CONNECTED</span>
      </p>

      <div className="bootbox">
        <b className="mark">ACM</b>

        <p>INITIALIZING ACM SYSTEM</p>

        <h1>
          ACM
          <br />
          <i>INTERFACE</i>
        </h1>

        {[
          'INITIALIZING ACM NODE',
          'LOADING EVENT ARCHIVE',
          'CALIBRATING VISUAL FIELD',
          'SYNCING MEMBER DATA',
          'ESTABLISHING CHAPTER LINK',
          'ATMOSPHERIC FIELD READY',
        ].map((x, i) => (
          <div className={p > (i + 1) * 13 ? 'ok' : ''} key={x}>
            {x}{' '}
            <b>{p > (i + 1) * 13 ? 'ONLINE' : 'WAIT'}</b>
          </div>
        ))}

        <span className="meter">
          <i style={{ width: `${p}%` }} />
        </span>

        <small>BOOT {String(p).padStart(2, '0')}%</small>

        {ready && (
          <button className="enter" onClick={start}>
            [ ENTER EXPERIENCE ]
          </button>
        )}
      </div>
    </div>
  )
}

export function Atmosphere() {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current
    const x = c.getContext('2d')

    let w
    let h

    let m = { x: 0, y: 0 }
    let id
    let run = 1
    let scroll = 0
    let tick = 0

    const reduce = matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let ps = []

    function resize() {
      w = c.width = innerWidth * devicePixelRatio
      h = c.height = innerHeight * devicePixelRatio

      const count = innerWidth < 600 ? 38 : 175

      ps = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.94 + 0.08,
        v: (Math.random() - 0.5) * 0.16,
        phase: Math.random() * 100,
      }))
    }

    function draw() {
      if (!run) return

      tick++

      x.clearRect(0, 0, w, h)

      const mx = m.x * devicePixelRatio
      const my = m.y * devicePixelRatio

      const g = x.createRadialGradient(
        mx,
        my,
        0,
        mx,
        my,
        w * 0.5
      )

      g.addColorStop(0, 'rgba(190,225,255,.14)')
      g.addColorStop(0.35, 'rgba(75,119,160,.035)')
      g.addColorStop(1, 'transparent')

      x.fillStyle = g
      x.fillRect(0, 0, w, h)

      ps.forEach((p) => {
        p.y += reduce ? 0 : p.v * p.z

        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const pull =
          Math.max(
            0,
            1 -
              Math.hypot(
                p.x - mx,
                p.y - my
              ) /
                (w * 0.25)
          ) * p.z

        p.sx =
          p.x +
          (mx - w / 2) * 0.032 * p.z +
          (p.x - mx) * pull * 0.016

        p.sy =
          p.y +
          (my - h / 2 + scroll * 0.028) *
            0.032 *
            p.z +
          (p.y - my) * pull * 0.016
      })

      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i]
          const b = ps[j]

          const dx = a.sx - b.sx
          const dy = a.sy - b.sy
          const d = dx * dx + dy * dy

          const limit = 17500 * a.z * b.z

          if (d < limit) {
            const energy =
              (Math.sin(
                (tick + a.phase + b.phase) / 155
              ) +
                1) *
              0.5

            x.strokeStyle = `rgba(188,223,255,${
              0.075 *
                (1 - d / limit) *
                Math.min(a.z, b.z) +
              energy * 0.018
            })`

            x.lineWidth = 0.55

            x.beginPath()
            x.moveTo(a.sx, a.sy)
            x.lineTo(b.sx, b.sy)
            x.stroke()

            if (
              !reduce &&
              energy > 0.985 &&
              i % 31 === 0
            ) {
              const f = (tick % 120) / 120

              x.fillStyle = 'rgba(225,244,255,.65)'

              x.beginPath()

              x.arc(
                a.sx + (b.sx - a.sx) * f,
                a.sy + (b.sy - a.sy) * f,
                1.5,
                0,
                7
              )

              x.fill()
            }
          }
        }
      }

      ps.forEach((p) => {
        const pulse =
          (Math.sin((tick + p.phase) / 100) + 1) *
          0.5

        x.fillStyle = `rgba(224,241,255,${
          0.13 + p.z * 0.42 + pulse * 0.09
        })`

        x.beginPath()

        x.arc(
          p.sx,
          p.sy,
          p.z * (2.2 + pulse * 1.5),
          0,
          7
        )

        x.fill()
      })

      id = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const move = (e) => {
      m = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const onScroll = () => {
      scroll = scrollY
    }

    const visibility = () => {
      run = !document.hidden

      if (run) draw()
    }

    addEventListener('resize', resize)
    addEventListener('pointermove', move, {
      passive: true,
    })
    addEventListener('scroll', onScroll, {
      passive: true,
    })

    document.addEventListener(
      'visibilitychange',
      visibility
    )

    return () => {
      run = 0

      cancelAnimationFrame(id)

      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
      removeEventListener('scroll', onScroll)

      document.removeEventListener(
        'visibilitychange',
        visibility
      )
    }
  }, [])

  return <canvas ref={ref} className="atmosphere" />
}

export function Nav() {
  const [o, setO] = useState(false)

  return (
    <header>
      <nav className="nav glass">
        <a href="#home">
          <b>ACM</b>
          <span>STUDENT CHAPTER</span>
        </a>

        <div>
          {links.map((x) => (
            <a
              href={`#${x.toLowerCase()}`}
              key={x}
            >
              {x}
            </a>
          ))}

          <Button href="#contact">
            JOIN ACM
          </Button>
        </div>

        <button
          onClick={() => setO(!o)}
          aria-label="Open navigation"
        >
          {o ? <X /> : <Menu />}
        </button>
      </nav>

      {o && (
        <aside className="mobile">
          {links.map((x, i) => (
            <a
              href={`#${x.toLowerCase()}`}
              onClick={() => setO(false)}
              key={x}
            >
              <small>
                0{i + 1}
              </small>
              {x}
            </a>
          ))}

          <Button
            href="#contact"
            onClick={() => setO(false)}
          >
            JOIN ACM
          </Button>
        </aside>
      )}
    </header>
  )
}

export function Sound({ on, toggle }) {
  return (
    <button
      className={`sound glass ${
        on ? 'soundon' : ''
      }`}
      onClick={toggle}
      aria-label="Toggle sound"
    >
      {on ? (
        <>
          <b className="wave">|||</b>
          <Volume2 />
        </>
      ) : (
        <VolumeX />
      )}

      <span>
        {on ? 'SOUND ON' : 'SOUND OFF'}
      </span>
    </button>
  )
}

export function Heading({ tag, title, text }) {
  return (
    <div className="heading">
      <p>{tag}</p>
      <h2>{title}</h2>
      <span>{text}</span>
    </div>
  )
}

/*
  IMPORTANT FIX:
  GitHub Pages serves this project under:

  /acm-student-chapter/

  Therefore the profile image must use BASE_URL.
*/
export function ProfileArchive() {
  const card = useRef()

  function move(e) {
    if (!matchMedia('(pointer: fine)').matches) return

    const r = card.current.getBoundingClientRect()

    const x =
      (e.clientX - r.left) / r.width - 0.5

    const y =
      (e.clientY - r.top) / r.height - 0.5

    card.current.style.setProperty(
      '--rx',
      `${-y * 5}deg`
    )

    card.current.style.setProperty(
      '--ry',
      `${x * 5}deg`
    )

    card.current.style.setProperty(
      '--px',
      `${(x + 0.5) * 100}%`
    )
  }

  function leave() {
    card.current.style.setProperty(
      '--rx',
      '0deg'
    )

    card.current.style.setProperty(
      '--ry',
      '0deg'
    )

    card.current.style.setProperty(
      '--px',
      '50%'
    )
  }

  /*
    THIS IS THE FIX.

    Instead of:
    /assets/images/pranjali-profile.jpeg

    we use:
    /acm-student-chapter/assets/images/pranjali-profile.jpeg
  */
  const profileImage = `${import.meta.env.BASE_URL}assets/images/pranjali-profile.jpeg`

  return (
    <article
      ref={card}
      onPointerMove={move}
      onPointerLeave={leave}
      className="profile-archive glass"
    >
      <div className="profile-portrait">
        <img
          src={profileImage}
          alt="Pranjali, ACM Student Chapter Member"
        />

        <span>ARCHIVE // 001</span>
      </div>

      <div className="profile-copy">
        <p>MEMBER // STUDENT</p>

        <h3>PRANJALI</h3>

        <div>
          <span>
            DISCIPLINE
            <br />
            <b>
              COMPUTER SCIENCE
              <br />
              ENGINEERING
            </b>
          </span>

          <span>
            YEAR
            <br />
            <b>3RD YEAR</b>
          </span>

          <span>
            STATUS
            <br />
            <b>ACTIVE</b>
          </span>
        </div>

        <small>
          ACM STUDENT CHAPTER
        </small>
      </div>
    </article>
  )
}

export function Cursor() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches)
      return

    const root = document.documentElement

    const move = (e) => {
      root.style.setProperty(
        '--cx',
        `${e.clientX}px`
      )

      root.style.setProperty(
        '--cy',
        `${e.clientY}px`
      )
    }

    const over = (e) => {
      root.classList.toggle(
        'cursor-active',
        Boolean(
          e.target.closest(
            'a,button,.event,.profile-archive'
          )
        )
      )
    }

    addEventListener('pointermove', move, {
      passive: true,
    })

    addEventListener('pointerover', over, {
      passive: true,
    })

    return () => {
      removeEventListener(
        'pointermove',
        move
      )

      removeEventListener(
        'pointerover',
        over
      )
    }
  }, [])

  return (
    <>
      <i className="cursor-dot" />
      <i className="cursor-ring" />
    </>
  )
}

export function Register({ event, close }) {
  const [step, setStep] = useState('detail')
  const [participant, setParticipant] =
    useState()

  const access = accessFor(event)

  async function submit(e) {
    e.preventDefault()

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    )

    setParticipant(data)

    await createPaymentOrder({
      event,
      participant: data,
    })

    setStep('access')
  }

  return (
    <div className="modal">
      <div className="modalbox glass">
        <button
          className="close"
          onClick={close}
          aria-label="Close registration"
        >
          <X />
        </button>

        {step === 'success' ? (
          <div className="success">
            <Check />

            <h2>
              You’re on the list.
            </h2>

            <p>
              Free event access is confirmed.
              Connect the registration adapter
              to a backend to collect
              submissions.
            </p>

            <Button onClick={close}>
              CLOSE
            </Button>
          </div>
        ) : step === 'access' ? (
          <div className="access-step">
            <p>EVENT ACCESS</p>

            <h2>{access.label}</h2>

            <span>{event.title}</span>

            <small>
              Open ACM event participation ·
              No payment is required.
            </small>

            <Button
              onClick={() =>
                setStep('success')
              }
            >
              CONFIRM ACCESS
            </Button>

            <button
              className="back"
              onClick={() =>
                setStep('form')
              }
            >
              BACK TO DETAILS
            </button>
          </div>
        ) : step === 'form' ? (
          <>
            <p>REGISTRATION DETAILS</p>

            <h2>{event.title}</h2>

            <small>
              {event.date} · {event.type}
            </small>

            <form onSubmit={submit}>
              <label>
                Name
                <input
                  required
                  name="name"
                  placeholder="Your name"
                />
              </label>

              <label>
                College email
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@college.edu"
                />
              </label>

              <label>
                Year / branch
                <input
                  required
                  name="year"
                  placeholder="e.g. Third year, CSE"
                />
              </label>

              <Button>
                CONTINUE TO ACCESS
              </Button>
            </form>
          </>
        ) : (
          <div className="event-detail">
            <p>
              EVENT {event.type.toUpperCase()}
            </p>

            <h2>{event.title}</h2>

            <small>
              {event.date} · {event.status}
            </small>

            <p>{event.text}</p>

            <div>
              <span>EVENT ACCESS</span>
              <b>{access.label}</b>
            </div>

            <Button
              onClick={() =>
                setStep('form')
              }
            >
              GET ACCESS
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function Assistant() {
  const [o, setO] = useState(false)

  const [msg, setMsg] = useState([
    {
      a: 1,
      t: 'ACM interface online. Ask about events, joining, or projects.',
    },
  ])

  const [q, setQ] = useState('')

  function ask(e) {
    e.preventDefault()

    if (!q) return

    const v = q

    setMsg((m) => [
      ...m,
      {
        t: v,
      },
    ])

    setQ('')

    setTimeout(() => {
      setMsg((m) => [
        ...m,
        {
          a: 1,
          t: /event/i.test(v)
            ? 'The Events archive has the latest schedule. Select an event to register.'
            : /join|member/i.test(v)
            ? 'Use JOIN ACM or send the committee a message from Contact.'
            : 'We are a hands-on community for learning, building, and sharing.',
        },
      ])
    }, 350)
  }

  return (
    <>
      <button
        className="assistantbtn glass"
        onClick={() => setO(true)}
      >
        <Sparkles />

        <span>ACM ASSISTANT</span>
      </button>

      {o && (
        <div className="assistant glass">
          <div>
            <span>
              <i /> ACM // ASSISTANT
            </span>

            <button
              onClick={() => setO(false)}
              aria-label="Close assistant"
            >
              <X />
            </button>
          </div>

          <main>
            {msg.map((m, i) => (
              <p
                className={
                  m.a ? 'ai' : 'you'
                }
                key={i}
              >
                {m.t}
              </p>
            ))}
          </main>

          <form onSubmit={ask}>
            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Ask ACM anything…"
            />

            <button aria-label="Send assistant message">
              <Send />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
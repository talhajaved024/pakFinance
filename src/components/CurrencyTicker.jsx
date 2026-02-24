import { useState, useEffect, useRef, useMemo } from 'react'
import { fmtDec } from '../utils/format'
import { CURRENCY_NAMES } from '../hooks/useExchangeRates'

const TICKER_CURRENCIES = ['USD', 'SAR', 'AED', 'GBP', 'EUR', 'AUD', 'CAD']

const FLAG_EMOJI = {
  USD: '🇺🇸',
  SAR: '🇸🇦',
  AED: '🇦🇪',
  GBP: '🇬🇧',
  EUR: '🇪🇺',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
}

/**
 * Live vertical carousel showing PKR rate against major currencies.
 * Auto-scrolls with pause-on-hover.
 */
export default function CurrencyTicker({ pkrRates, loading }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState(false)
  const intervalRef = useRef(null)

  const items = useMemo(() => {
    if (!pkrRates) return []
    return TICKER_CURRENCIES.map((code) => ({
      code,
      flag: FLAG_EMOJI[code] || '',
      name: CURRENCY_NAMES[code] || code,
      rate: pkrRates[code] || 0,
    }))
  }, [pkrRates])

  // Auto-advance
  useEffect(() => {
    if (paused || loading || items.length === 0) return

    intervalRef.current = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % items.length)
        setAnimating(false)
      }, 400) // match CSS transition
    }, 3000)

    return () => clearInterval(intervalRef.current)
  }, [paused, loading, items.length])

  if (loading || items.length === 0) {
    return (
      <div className="ticker-wrap">
        <div className="ticker-loading">
          <span className="ticker-dot-pulse" />
          Loading live rates…
        </div>
      </div>
    )
  }

  const current = items[activeIndex]
  const next = items[(activeIndex + 1) % items.length]

  return (
    <>
      <div
        className="ticker-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left: LIVE badge */}
        <div className="ticker-badge">
          <span className="ticker-live-dot" />
          LIVE
        </div>

        {/* Center: Vertical carousel */}
        <div className="ticker-carousel">
          <div className={`ticker-slide ${animating ? 'slide-out' : 'slide-in'}`}>
            <span className="ticker-flag">{current.flag}</span>
            <span className="ticker-code">{current.code}</span>
            <span className="ticker-separator">·</span>
            <span className="ticker-rate">
              1 {current.code} = <strong>PKR {fmtDec(current.rate, 2)}</strong>
            </span>
          </div>
        </div>

        {/* Right: Dot indicators */}
        <div className="ticker-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`ticker-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(i)
                setAnimating(false)
              }}
              aria-label={`Show ${items[i].code} rate`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .ticker-wrap {
          background: var(--accent);
          border-radius: var(--radius);
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          min-height: 52px;
          overflow: hidden;
          cursor: default;
          user-select: none;
          box-shadow: 0 2px 12px rgba(13, 59, 46, 0.18);
        }

        .ticker-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: var(--gold);
          text-transform: uppercase;
          flex-shrink: 0;
          background: rgba(196, 151, 59, 0.12);
          padding: 4px 10px;
          border-radius: 6px;
        }

        .ticker-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          animation: livePulse 1.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }

        .ticker-carousel {
          flex: 1;
          height: 24px;
          overflow: hidden;
          position: relative;
        }

        .ticker-slide {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 24px;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          white-space: nowrap;
        }

        .ticker-slide.slide-in {
          animation: tickerSlideIn 0.4s ease forwards;
        }

        .ticker-slide.slide-out {
          animation: tickerSlideOut 0.4s ease forwards;
        }

        @keyframes tickerSlideIn {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        @keyframes tickerSlideOut {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(-100%); opacity: 0; }
        }

        .ticker-flag {
          font-size: 18px;
          line-height: 1;
        }

        .ticker-code {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
        }

        .ticker-separator {
          color: rgba(255, 255, 255, 0.25);
          font-size: 14px;
        }

        .ticker-rate {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
        }

        .ticker-rate strong {
          color: #fff;
          font-weight: 700;
          font-family: var(--font-display);
          font-size: 14.5px;
          letter-spacing: -0.3px;
        }

        .ticker-dots {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .ticker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
        }

        .ticker-dot.active {
          background: var(--gold);
          transform: scale(1.3);
        }

        .ticker-dot:hover:not(.active) {
          background: rgba(255, 255, 255, 0.4);
        }

        .ticker-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12.5px;
          width: 100%;
          justify-content: center;
        }

        .ticker-dot-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gold);
          animation: livePulse 1s ease-in-out infinite;
        }

        /* Mobile: tighter */
        @media (max-width: 640px) {
          .ticker-wrap { padding: 12px 14px; gap: 10px; }
          .ticker-badge { font-size: 9px; padding: 3px 8px; }
          .ticker-rate { font-size: 12px; }
          .ticker-rate strong { font-size: 13px; }
          .ticker-flag { font-size: 16px; }
          .ticker-dots { gap: 3px; }
          .ticker-dot { width: 5px; height: 5px; }
        }
      `}</style>
    </>
  )
}

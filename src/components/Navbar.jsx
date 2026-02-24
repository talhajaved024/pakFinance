import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/income-tax-calculator-pakistan', label: 'Tax' },
  { to: '/salary-breakup-estimator', label: 'Salary' },
  { to: '/loan-emi-calculator', label: 'Loan EMI' },
  { to: '/currency-comparison', label: 'Currency' },
  { to: '/inflation-calculator', label: 'Inflation' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <span className="logo-icon">₨</span>
          PakFinance
        </Link>

        <ul className="navbar-links">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={pathname === l.to ? 'active' : ''}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        {NAV_LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={pathname === l.to ? 'active' : ''}
            onClick={() => setMobileOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

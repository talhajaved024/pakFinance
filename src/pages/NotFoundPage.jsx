import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function NotFoundPage() {
  return (
    <>
      <SEOHead title="Page Not Found — PakFinance" description="" />

      <div className="page-container fade-in" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '72px',
            color: 'var(--accent)',
            marginBottom: '12px',
          }}
        >
          404
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
          This page doesn't exist. Let's get you back on track.
        </p>
        <Link to="/" className="btn btn-primary">
          ← Back to Home
        </Link>
      </div>
    </>
  )
}

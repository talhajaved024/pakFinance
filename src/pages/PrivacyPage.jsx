import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy — PakFinance"
        description="PakFinance privacy policy. Learn how we handle your data."
      />

      <div className="page-container fade-in">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>›</span> Privacy Policy
        </div>

        <div className="page-header">
          <h1>Privacy Policy</h1>
        </div>

        <div className="card">
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
            }}
          >
            PakFinance is a client-side financial calculator tool. All
            calculations are performed entirely in your browser. We do not
            collect, store, or transmit any personal or financial data you
            enter into the calculators. No data is sent to any server.
            <br />
            <br />
            We may use analytics cookies to understand traffic patterns. No
            personally identifiable information is collected through these
            cookies. Ad units (if enabled) are served by third-party providers
            who have their own privacy policies.
            <br />
            <br />
            If you have questions about this policy, please contact us through
            the site.
          </p>
        </div>
      </div>
    </>
  )
}

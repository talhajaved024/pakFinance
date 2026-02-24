import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'
import CurrencyTicker from '../components/CurrencyTicker'
import { useExchangeRates } from '../hooks/useExchangeRates'

const CALCULATORS = [
  {
    icon: '🏛️',
    title: 'Income Tax Calculator',
    desc: 'Calculate your Pakistan income tax based on FBR slabs with slab breakdown and effective rate.',
    path: '/income-tax-calculator-pakistan',
  },
  {
    icon: '💰',
    title: 'Salary Breakup Estimator',
    desc: 'Break down your CTC into basic, allowances, deductions, and take-home pay.',
    path: '/salary-breakup-estimator',
  },
  {
    icon: '🏦',
    title: 'Loan / EMI Calculator',
    desc: 'Estimate monthly EMI, total interest, and view full amortization schedule.',
    path: '/loan-emi-calculator',
  },
  {
    icon: '💱',
    title: 'Currency Comparison',
    desc: 'Convert between PKR and major world currencies with live-ready rates.',
    path: '/currency-comparison',
  },
  {
    icon: '📈',
    title: 'Inflation Calculator',
    desc: 'See how inflation erodes your purchasing power over time.',
    path: '/inflation-calculator',
  },
]

export default function HomePage() {
  const { pkrRates, loading } = useExchangeRates()

  return (
    <>
      <SEOHead
        title="PakFinance — Pakistan Salary & Finance Calculators"
        description="Free Pakistan financial calculators: income tax, salary breakup, loan EMI, currency conversion, and inflation calculator. Fast, accurate, and mobile-friendly."
      />

      <div className="page-container fade-in">
        <div className="hero">
          <span className="hero-badge">🇵🇰 Pakistan Finance Tools</span>
          <h1>
            Your money, <em>calculated.</em>
          </h1>
          <p>
            Free, fast, and accurate financial calculators built for Pakistan.
            Tax slabs, salary breakup, loan EMI, and more.
          </p>
        </div>

        {/* ── Live Rate Ticker ── */}
        <CurrencyTicker pkrRates={pkrRates} loading={loading} />

        <div className="calc-grid">
          {CALCULATORS.map((c) => (
            <Link key={c.path} to={c.path} className="calc-card">
              <div className="card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="card-arrow">Open calculator →</span>
            </Link>
          ))}
        </div>

        <AdPlaceholder label="Google AdSense — Home Banner" />

        <div className="disclaimer">
          <strong>Disclaimer:</strong> All calculations are estimates for
          informational purposes only. Consult a qualified tax advisor or
          financial professional for personalized advice. Rates and slabs may
          change with government notifications.
        </div>
      </div>
    </>
  )
}

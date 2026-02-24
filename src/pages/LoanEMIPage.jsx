import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import InputField from '../components/InputField'
import Toggle from '../components/Toggle'
import ResultPanel from '../components/ResultPanel'
import ExplanationSection from '../components/ExplanationSection'
import { fmt, pct, parseNum } from '../utils/format'

export default function LoanEMIPage() {
  const [principal, setPrincipal] = useState('')
  const [rate, setRate] = useState('')
  const [tenure, setTenure] = useState('')
  const [tenureType, setTenureType] = useState('months')
  const [showAmort, setShowAmort] = useState(false)

  const results = useMemo(() => {
    const P = parseNum(principal)
    const annualRate = parseNum(rate)
    const t = parseNum(tenure)
    if (P <= 0 || annualRate <= 0 || t <= 0) return null

    const n = tenureType === 'years' ? t * 12 : t
    const r = annualRate / 12 / 100
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const totalPayment = emi * n
    const totalInterest = totalPayment - P

    // Amortization schedule
    let balance = P
    const schedule = []
    for (let i = 1; i <= n; i++) {
      const interest = balance * r
      const principalPart = emi - interest
      balance -= principalPart
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalPart),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      })
    }

    return { emi, totalPayment, totalInterest, n, schedule }
  }, [principal, rate, tenure, tenureType])

  const reset = () => {
    setPrincipal('')
    setRate('')
    setTenure('')
    setShowAmort(false)
  }

  return (
    <>
      <SEOHead
        title="Loan EMI Calculator — PakFinance"
        description="Calculate your monthly EMI, total interest, and view amortization schedule for home loans, car loans, and personal loans in Pakistan."
      />

      <div className="page-container fade-in">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>›</span> Loan EMI Calculator
        </div>

        <div className="page-header">
          <h1>Loan / EMI Calculator</h1>
          <p>
            Calculate monthly installments for home, car, or personal loans
            with full amortization schedule.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Loan Details</h2>
          </div>

          <div className="form-grid">
            <InputField
              label="Loan Amount"
              value={principal}
              onChange={setPrincipal}
              prefix="PKR"
              placeholder="e.g. 5,000,000"
            />
            <InputField
              label="Interest Rate (Annual)"
              value={rate}
              onChange={setRate}
              suffix="%"
              placeholder="e.g. 18"
            />
            <InputField
              label="Loan Tenure"
              value={tenure}
              onChange={setTenure}
              placeholder="e.g. 60"
            />
            <InputField label="Tenure Type">
              <Toggle
                options={[
                  { label: 'Months', value: 'months' },
                  { label: 'Years', value: 'years' },
                ]}
                value={tenureType}
                onChange={setTenureType}
              />
            </InputField>
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" onClick={reset}>
              ↺ Reset
            </button>
          </div>
        </div>

        {results && (
          <ResultPanel
            title="EMI Summary"
            items={[
              {
                label: 'Monthly EMI',
                value: `PKR ${fmt(results.emi)}`,
                highlight: true,
              },
              {
                label: 'Total Payment',
                value: `PKR ${fmt(results.totalPayment)}`,
                sub: `Over ${results.n} months`,
              },
              {
                label: 'Total Interest',
                value: `PKR ${fmt(results.totalInterest)}`,
                sub: `${pct((results.totalInterest / parseNum(principal)) * 100)}% of principal`,
              },
              {
                label: 'Principal',
                value: `PKR ${fmt(parseNum(principal))}`,
              },
            ]}
          />
        )}

        {results && (
          <div className="card section-gap">
            <button
              className="amort-toggle"
              onClick={() => setShowAmort((p) => !p)}
            >
              {showAmort ? '▾' : '▸'}{' '}
              {showAmort ? 'Hide' : 'Show'} Amortization Schedule (
              {results.n} months)
            </button>

            {showAmort && (
              <div className="amort-table-wrap">
                <table className="slab-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>EMI</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>PKR {fmt(row.emi)}</td>
                        <td>PKR {fmt(row.principal)}</td>
                        <td>PKR {fmt(row.interest)}</td>
                        <td>PKR {fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <ExplanationSection title="How EMI is Calculated">
          <p>
            EMI (Equated Monthly Installment) is calculated using the standard
            formula:
          </p>
          <p
            style={{
              fontFamily: 'monospace',
              margin: '10px 0',
              fontSize: '14px',
              color: 'var(--accent)',
            }}
          >
            EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)
          </p>
          <p>
            Where P = principal, r = monthly interest rate, n = number of
            months.
          </p>
        </ExplanationSection>

        <div className="disclaimer mt-24">
          <strong>Disclaimer:</strong> EMI calculations are approximate.
          Actual EMI may vary based on bank policies, processing fees, and
          other charges.
        </div>
      </div>
    </>
  )
}

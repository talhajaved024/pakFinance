import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import InputField from '../components/InputField'
import Toggle from '../components/Toggle'
import ResultPanel from '../components/ResultPanel'
import ExplanationSection from '../components/ExplanationSection'
import AdPlaceholder from '../components/AdPlaceholder'
import { TAX_SLABS, calcTax } from '../data/taxData'
import { fmt, pct, parseNum } from '../utils/format'

export default function IncomeTaxPage() {
  const [salary, setSalary] = useState('')
  const [mode, setMode] = useState('annual')
  const [bonus, setBonus] = useState('')
  const [deductions, setDeductions] = useState('')
  const [year, setYear] = useState('2024-2025')

  const validate = (v) => (parseNum(v) < 0 ? 'Value cannot be negative' : '')

  const results = useMemo(() => {
    const s = parseNum(salary)
    const annual = mode === 'monthly' ? s * 12 : s
    const b = parseNum(bonus)
    const d = parseNum(deductions)
    const gross = annual + b
    const taxable = Math.max(0, gross - d)
    const { tax, effectiveRate } = calcTax(taxable, year)
    return {
      gross,
      taxable,
      tax,
      net: gross - tax,
      monthlyTax: tax / 12,
      monthlyNet: (gross - tax) / 12,
      effectiveRate,
    }
  }, [salary, mode, bonus, deductions, year])

  const reset = () => {
    setSalary('')
    setBonus('')
    setDeductions('')
  }

  const slabs = TAX_SLABS[year] || TAX_SLABS['2024-2025']

  return (
    <>
      <SEOHead
        title="Pakistan Income Tax Calculator 2024-2025 — PakFinance"
        description="Calculate your Pakistan income tax based on FBR progressive slab rates for tax year 2024-2025. Free, instant, with full slab breakdown."
      />

      <div className="page-container fade-in">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>›</span> Income Tax Calculator
        </div>

        <div className="page-header">
          <h1>Pakistan Income Tax Calculator</h1>
          <p>
            Calculate your tax based on FBR progressive slab rates. Updated for
            tax year 2024–2025.
          </p>
        </div>

        {/* ── Input Card ── */}
        <div className="card">
          <div className="card-header">
            <h2>Enter Your Income</h2>
            <p>Fill in your salary details to see your tax breakdown</p>
          </div>

          <div className="form-grid">
            <InputField
              label="Salary"
              value={salary}
              onChange={setSalary}
              prefix="PKR"
              placeholder="e.g. 2,400,000"
              error={validate(salary)}
            />

            <InputField label="Period">
              <Toggle
                options={[
                  { label: 'Annual', value: 'annual' },
                  { label: 'Monthly', value: 'monthly' },
                ]}
                value={mode}
                onChange={setMode}
              />
            </InputField>

            <InputField
              label="Bonuses / Additional Income"
              value={bonus}
              onChange={setBonus}
              prefix="PKR"
              placeholder="0"
              error={validate(bonus)}
            />

            <InputField label="Tax Year">
              <select
                className="form-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="2024-2025">2024–2025</option>
                <option value="2023-2024">2023–2024</option>
              </select>
            </InputField>

            <InputField
              label="Deductions (Section 62)"
              value={deductions}
              onChange={setDeductions}
              prefix="PKR"
              placeholder="0"
              fullWidth
              error={validate(deductions)}
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" onClick={reset}>
              ↺ Reset
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        {results.gross > 0 && (
          <ResultPanel
            title="Tax Summary"
            items={[
              { label: 'Gross Income', value: `PKR ${fmt(results.gross)}` },
              {
                label: 'Tax Payable',
                value: `PKR ${fmt(results.tax)}`,
                highlight: true,
                sub: `${pct(results.effectiveRate)}% effective rate`,
              },
              { label: 'Net Income', value: `PKR ${fmt(results.net)}` },
              {
                label: 'Monthly Take-Home',
                value: `PKR ${fmt(results.monthlyNet)}`,
                sub: `Tax: PKR ${fmt(results.monthlyTax)}/mo`,
              },
            ]}
          />
        )}

        {/* ── Slab Breakdown ── */}
        {results.gross > 0 && (
          <div className="card section-gap">
            <div className="card-header">
              <h2>Slab Breakdown</h2>
              <p>
                See how your income falls across Pakistan's progressive tax
                slabs
              </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="slab-table">
                <thead>
                  <tr>
                    <th>Income Range</th>
                    <th>Rate</th>
                    <th>Fixed Tax</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {slabs.map((s, i) => {
                    const active =
                      results.taxable >= s.min &&
                      results.taxable <=
                        (s.max === Infinity ? Infinity : s.max)
                    return (
                      <tr key={i} className={active ? 'active-slab' : ''}>
                        <td>
                          PKR {fmt(s.min)} –{' '}
                          {s.max === Infinity
                            ? 'Above'
                            : `PKR ${fmt(s.max)}`}
                        </td>
                        <td>{s.rate}%</td>
                        <td>PKR {fmt(s.fixed)}</td>
                        <td>
                          {active ? (
                            <span className="tax-amount">● Your slab</span>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Explanation ── */}
        <ExplanationSection title="How Pakistan Income Tax is Calculated">
          <p>
            Pakistan uses a progressive tax slab system under the Income Tax
            Ordinance, 2001. Your taxable income is the gross income minus
            allowable deductions. The tax is computed based on the slab your
            income falls in, with a fixed amount plus a percentage on the
            excess above the slab's lower limit.
          </p>
          <ul>
            <li>Income up to PKR 600,000 is exempt from tax.</li>
            <li>
              Higher slabs attract progressively higher rates up to 35%.
            </li>
            <li>
              The effective tax rate is usually lower than the marginal slab
              rate.
            </li>
          </ul>
        </ExplanationSection>

        <AdPlaceholder label="AdSense — Below Calculator" />

        <div className="disclaimer">
          <strong>Disclaimer:</strong> These calculations are estimates based
          on publicly available FBR slab rates. Actual tax liability may vary.
          Consult a tax professional for accurate filing.
        </div>
      </div>
    </>
  )
}

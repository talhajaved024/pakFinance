import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import InputField from '../components/InputField'
import ResultPanel from '../components/ResultPanel'
import { fmt, parseNum } from '../utils/format'
import AdPlaceholder from '../components/AdPlaceholder'

export default function SalaryBreakupPage() {
  const [basic, setBasic] = useState('')
  const [hra, setHra] = useState('')
  const [transport, setTransport] = useState('')
  const [medical, setMedical] = useState('')
  const [other, setOther] = useState('')
  const [taxDeduction, setTaxDeduction] = useState('')
  const [providentPct, setProvidentPct] = useState('')

  const results = useMemo(() => {
    const b = parseNum(basic)
    const allowances =
      parseNum(hra) + parseNum(transport) + parseNum(medical) + parseNum(other)
    const gross = b + allowances
    const pf = b * (parseNum(providentPct) / 100)
    const tax = parseNum(taxDeduction)
    const totalDeductions = pf + tax
    const net = gross - totalDeductions
    return { basic: b, allowances, gross, pf, tax, totalDeductions, net }
  }, [basic, hra, transport, medical, other, taxDeduction, providentPct])

  const reset = () => {
    setBasic('')
    setHra('')
    setTransport('')
    setMedical('')
    setOther('')
    setTaxDeduction('')
    setProvidentPct('')
  }

  return (
    <>
      <SEOHead
        title="Salary Breakup Estimator — PakFinance"
        description="Break down your salary into basic, allowances, deductions, provident fund, and calculate your net take-home pay."
      />

      <div className="page-container fade-in">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>›</span> Salary Breakup
        </div>

        <div className="page-header">
          <h1>Salary Breakup Estimator</h1>
          <p>
            Understand your compensation structure: basic pay, allowances,
            deductions, and take-home.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Compensation Details</h2>
            <p>Enter monthly amounts</p>
          </div>

          <div className="form-grid">
            <InputField
              label="Basic Salary"
              value={basic}
              onChange={setBasic}
              prefix="PKR"
              placeholder="e.g. 80,000"
            />
            <InputField
              label="House Rent Allowance"
              value={hra}
              onChange={setHra}
              prefix="PKR"
              placeholder="0"
            />
            <InputField
              label="Transport Allowance"
              value={transport}
              onChange={setTransport}
              prefix="PKR"
              placeholder="0"
            />
            <InputField
              label="Medical Allowance"
              value={medical}
              onChange={setMedical}
              prefix="PKR"
              placeholder="0"
            />
            <InputField
              label="Other Allowances"
              value={other}
              onChange={setOther}
              prefix="PKR"
              placeholder="0"
            />
            <InputField
              label="Tax Deduction (Monthly)"
              value={taxDeduction}
              onChange={setTaxDeduction}
              prefix="PKR"
              placeholder="0"
            />
            <InputField
              label="Provident Fund"
              value={providentPct}
              onChange={setProvidentPct}
              suffix="%"
              placeholder="e.g. 8"
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" onClick={reset}>
              ↺ Reset
            </button>
          </div>
        </div>

        {results.gross > 0 && (
          <ResultPanel
            title="Salary Breakup"
            items={[
              {
                label: 'Gross Salary',
                value: `PKR ${fmt(results.gross)}`,
                sub: 'Basic + Allowances',
              },
              {
                label: 'Total Deductions',
                value: `PKR ${fmt(results.totalDeductions)}`,
                highlight: true,
                sub: `PF: ${fmt(results.pf)} | Tax: ${fmt(results.tax)}`,
              },
              { label: 'Net Take-Home', value: `PKR ${fmt(results.net)}` },
              {
                label: 'Annual CTC',
                value: `PKR ${fmt(results.gross * 12)}`,
              },
            ]}
          />
        )}

        <AdPlaceholder />

        <div className="disclaimer mt-24">
          <strong>Note:</strong> This is a simplified breakup estimator.
          Actual salary components may vary per employer policy and employment
          contract.
        </div>
      </div>
    </>
  )
}

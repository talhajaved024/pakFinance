import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import InputField from '../components/InputField'
import ResultPanel from '../components/ResultPanel'
import ExplanationSection from '../components/ExplanationSection'
import { fmt, pct, parseNum } from '../utils/format'

export default function InflationPage() {
  const [currentVal, setCurrentVal] = useState('')
  const [inflationRate, setInflationRate] = useState('12')
  const [years, setYears] = useState('5')

  const results = useMemo(() => {
    const pv = parseNum(currentVal)
    const r = parseNum(inflationRate) / 100
    const n = parseNum(years)
    if (pv <= 0 || r <= 0 || n <= 0) return null

    const futureValue = pv * Math.pow(1 + r, n)
    const purchasingPower = pv / Math.pow(1 + r, n)
    const lossPercent = ((pv - purchasingPower) / pv) * 100

    const yearlyData = []
    for (let i = 1; i <= Math.min(n, 50); i++) {
      yearlyData.push({
        year: i,
        costThen: pv * Math.pow(1 + r, i),
        worthThen: pv / Math.pow(1 + r, i),
      })
    }

    return { futureValue, purchasingPower, lossPercent, yearlyData }
  }, [currentVal, inflationRate, years])

  const reset = () => {
    setCurrentVal('')
    setInflationRate('12')
    setYears('5')
  }

  return (
    <>
      <SEOHead
        title="Inflation Impact Calculator — PakFinance"
        description="Calculate how inflation affects your money's purchasing power over time. See future cost of goods and purchasing power erosion in Pakistan."
      />

      <div className="page-container fade-in">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>›</span> Inflation Calculator
        </div>

        <div className="page-header">
          <h1>Inflation Impact Calculator</h1>
          <p>
            See how inflation erodes your purchasing power and increases costs
            over time.
          </p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Inflation Parameters</h2>
          </div>

          <div className="form-grid">
            <InputField
              label="Current Value / Cost"
              value={currentVal}
              onChange={setCurrentVal}
              prefix="PKR"
              placeholder="e.g. 100,000"
            />
            <InputField
              label="Annual Inflation Rate"
              value={inflationRate}
              onChange={setInflationRate}
              suffix="%"
              placeholder="e.g. 12"
            />
            <InputField
              label="Time Period"
              value={years}
              onChange={setYears}
              suffix="yrs"
              placeholder="e.g. 5"
            />
          </div>

          <div className="btn-row">
            <button className="btn btn-ghost" onClick={reset}>
              ↺ Reset
            </button>
          </div>
        </div>

        {results && (
          <ResultPanel
            title="Inflation Impact"
            items={[
              {
                label: 'Future Cost',
                value: `PKR ${fmt(results.futureValue)}`,
                highlight: true,
                sub: `What it'll cost in ${years} years`,
              },
              {
                label: 'Purchasing Power',
                value: `PKR ${fmt(results.purchasingPower)}`,
                sub: `What PKR ${fmt(parseNum(currentVal))} will be worth`,
              },
              {
                label: 'Power Lost',
                value: `${pct(results.lossPercent)}%`,
                sub: `Erosion over ${years} years`,
              },
            ]}
          />
        )}

        {results && results.yearlyData.length <= 30 && (
          <div className="card section-gap">
            <div className="card-header">
              <h2>Year-by-Year Breakdown</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="slab-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Cost Then</th>
                    <th>Purchasing Power</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyData.map((row) => (
                    <tr key={row.year}>
                      <td>Year {row.year}</td>
                      <td>PKR {fmt(row.costThen)}</td>
                      <td>PKR {fmt(row.worthThen)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ExplanationSection title="Understanding Inflation">
          <p>
            Inflation means prices rise over time, reducing what your money
            can buy. Pakistan has historically experienced double-digit
            inflation rates. If inflation averages 12% per year, something
            costing PKR 100,000 today will cost roughly PKR 176,000 in five
            years, and your PKR 100,000 will only have the purchasing power of
            about PKR 57,000 in today's terms.
          </p>
        </ExplanationSection>

        <div className="disclaimer mt-24">
          <strong>Disclaimer:</strong> Calculations assume a constant
          inflation rate. Actual inflation varies year to year and by category
          of goods and services.
        </div>
      </div>
    </>
  )
}

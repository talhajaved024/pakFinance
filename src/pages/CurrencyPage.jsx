import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import InputField from '../components/InputField'
import ResultPanel from '../components/ResultPanel'
import { fmtDec, fmt, parseNum } from '../utils/format'
import { useExchangeRates, CURRENCY_NAMES } from '../hooks/useExchangeRates'
import CurrencyTicker from '../components/CurrencyTicker'
import AdPlaceholder from '../components/AdPlaceholder'

export default function CurrencyPage() {
  const [amount, setAmount] = useState('1000')
  const [from, setFrom] = useState('PKR')
  const [to, setTo] = useState('USD')

  const {
    pkrRates,
    loading,
    error,
    lastUpdated,
    usingFallback,
    convert,
    getRate,
    refresh,
    currencies,
  } = useExchangeRates()

  const converted = useMemo(() => {
    return convert(parseNum(amount), from, to)
  }, [amount, from, to, pkrRates])

  const rate = useMemo(() => {
    return getRate(from, to)
  }, [from, to, pkrRates])

  const swap = () => {
    setFrom(to)
    setTo(from)
  }

  const currencyLabel = (code) =>
    CURRENCY_NAMES[code] ? `${code} — ${CURRENCY_NAMES[code]}` : code

  return (
    <>
      <SEOHead
        title="Live Currency Converter — PKR Exchange Rates | PakFinance"
        description="Convert between PKR and 18+ world currencies with live exchange rates. Real-time USD, EUR, GBP, SAR, AED to PKR conversion."
      />

      <div className="page-container fade-in">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span>›</span> Currency Comparison
        </div>

        <div className="page-header">
          <h1>Live Currency Converter</h1>
          <p>
            Convert between PKR and major world currencies with real-time
            exchange rates, updated hourly.
          </p>
        </div>

        {/* ── Live Vertical Carousel ── */}
        <CurrencyTicker pkrRates={pkrRates} loading={loading} />

        {/* ── Status Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '12.5px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: loading
                  ? 'var(--gold)'
                  : usingFallback
                  ? 'var(--danger)'
                  : 'var(--success)',
                display: 'inline-block',
              }}
            />
            <span style={{ color: 'var(--text-muted)' }}>
              {loading
                ? 'Fetching live rates…'
                : usingFallback
                ? 'Using offline rates (API unavailable)'
                : 'Live rates active'}
            </span>
            {lastUpdated && !usingFallback && (
              <span style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                · Updated {lastUpdated}
              </span>
            )}
          </div>

          {!loading && (
            <button
              onClick={refresh}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--accent)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              ↻ Refresh Rates
            </button>
          )}
        </div>

        {/* ── Converter Card ── */}
        <div className="card" style={{ opacity: loading ? 0.7 : 1 }}>
          <div className="card-header">
            <h2>Convert Currency</h2>
            <p>{currencies.length} currencies available</p>
          </div>

          <div className="form-grid">
            <InputField
              label="Amount"
              value={amount}
              onChange={setAmount}
              placeholder="Enter amount"
            />

            <InputField label="From">
              <select
                className="form-input"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {currencyLabel(c)}
                  </option>
                ))}
              </select>
            </InputField>

            <div
              className="form-group"
              style={{ display: 'flex', alignItems: 'flex-end' }}
            >
              <button
                className="btn btn-ghost"
                onClick={swap}
                style={{ width: '100%' }}
              >
                ⇄ Swap
              </button>
            </div>

            <InputField label="To">
              <select
                className="form-input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {currencyLabel(c)}
                  </option>
                ))}
              </select>
            </InputField>
          </div>
        </div>

        {/* ── Result ── */}
        {parseNum(amount) > 0 && !loading && (
          <ResultPanel
            title="Conversion Result"
            items={[
              {
                label: `${from} Amount`,
                value: `${fmt(parseNum(amount))} ${from}`,
              },
              {
                label: `Converted (${to})`,
                value: `${fmtDec(converted, 2)} ${to}`,
                highlight: true,
              },
              {
                label: 'Exchange Rate',
                value: `1 ${from} = ${fmtDec(rate, 4)} ${to}`,
              },
            ]}
          />
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div
            className="result-panel"
            style={{
              marginTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '120px',
              opacity: 0.7,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '3px solid rgba(255,255,255,0.2)',
                  borderTopColor: 'var(--gold)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 10px',
                }}
              />
              <span style={{ fontSize: '13px', opacity: 0.6 }}>
                Loading live exchange rates…
              </span>
            </div>
          </div>
        )}

        {/* ── Rates Table ── */}
        {pkrRates && (
          <div className="card section-gap">
            <div className="card-header">
              <h2>PKR Exchange Rates</h2>
              <p>
                {usingFallback
                  ? 'Showing approximate offline rates'
                  : 'Live rates from ExchangeRate-API'}
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="slab-table">
                <thead>
                  <tr>
                    <th>Currency</th>
                    <th>Name</th>
                    <th>1 Unit = PKR</th>
                  </tr>
                </thead>
                <tbody>
                  {currencies
                    .filter((c) => c !== 'PKR')
                    .map((c) => (
                      <tr key={c}>
                        <td style={{ fontWeight: 600 }}>{c}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                          {CURRENCY_NAMES[c] || c}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>
                            PKR {fmtDec(pkrRates[c] || 0, 2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Error notice ── */}
        {error && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'var(--gold-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(196, 151, 59, 0.2)',
            }}
          >
            <strong>Note:</strong> Couldn't reach the exchange rate server ({error}).
            Showing approximate offline rates. Click "Refresh Rates" to retry.
          </div>
        )}

        <AdPlaceholder />

        <div className="disclaimer mt-24">
          <strong>Rates source:</strong> ExchangeRate-API (exchangerate-api.com).
          Rates are refreshed hourly and cached locally for performance. Actual bank
          or remittance rates may differ due to fees, spreads, and processing charges.
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

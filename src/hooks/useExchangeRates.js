import { useState, useEffect, useCallback } from 'react'

const API_KEY = 'b8c8c10ae768de08a1467129'
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`

// Currencies we care about (shown in UI)
export const SUPPORTED_CURRENCIES = [
  'PKR', 'USD', 'EUR', 'GBP', 'SAR', 'AED',
  'CAD', 'AUD', 'CNY', 'INR', 'JPY', 'KWD',
  'QAR', 'BHD', 'OMR', 'TRY', 'MYR', 'SGD',
]

// Currency display names
export const CURRENCY_NAMES = {
  PKR: 'Pakistani Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  JPY: 'Japanese Yen',
  KWD: 'Kuwaiti Dinar',
  QAR: 'Qatari Riyal',
  BHD: 'Bahraini Dinar',
  OMR: 'Omani Rial',
  TRY: 'Turkish Lira',
  MYR: 'Malaysian Ringgit',
  SGD: 'Singapore Dollar',
}

// Fallback rates (PKR per 1 unit) — used if API fails
const FALLBACK_RATES = {
  PKR: 1, USD: 278.50, EUR: 301.20, GBP: 352.80,
  SAR: 74.27, AED: 75.85, CAD: 205.40, AUD: 181.60,
  CNY: 38.45, INR: 3.31, JPY: 1.86, KWD: 906.50,
  QAR: 76.50, BHD: 739.10, OMR: 723.50, TRY: 8.15,
  MYR: 62.80, SGD: 210.30,
}

const CACHE_KEY = 'pakfinance_exchange_rates'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in ms

/** Read cached rates from sessionStorage */
function getCachedRates() {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (!cached) return null
    const { rates, timestamp, base } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_DURATION) {
      return { rates, base }
    }
  } catch {
    // ignore
  }
  return null
}

/** Write rates to sessionStorage cache */
function setCachedRates(rates, base) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ rates, base, timestamp: Date.now() })
    )
  } catch {
    // ignore
  }
}

/**
 * Custom hook: fetches live exchange rates from ExchangeRate-API.
 * Returns rates object keyed by currency code (relative to PKR base),
 * plus loading / error / lastUpdated state.
 */
export function useExchangeRates() {
  const [rates, setRates] = useState(null)        // { USD: 0.00359, EUR: ... } raw from API (base PKR)
  const [pkrRates, setPkrRates] = useState(null)   // { USD: 278.5, ... } PKR per 1 unit
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)

  const fetchRates = useCallback(async () => {
    // 1. Check cache first
    const cached = getCachedRates()
    if (cached) {
      applyRates(cached.rates, cached.base, false)
      return
    }

    // 2. Fetch from API
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BASE_URL}/latest/PKR`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      if (data.result !== 'success') {
        throw new Error(data['error-type'] || 'API error')
      }

      setCachedRates(data.conversion_rates, 'PKR')
      applyRates(data.conversion_rates, 'PKR', false)
      setLastUpdated(data.time_last_update_utc || new Date().toUTCString())
    } catch (err) {
      console.warn('Exchange rate API failed, using fallback:', err.message)
      setError(err.message)
      applyFallback()
    }
  }, [])

  /** Convert raw API rates (base PKR → X) into "PKR per 1 unit of X" */
  function applyRates(rawRates, base, isFallback) {
    const filtered = {}
    const perUnit = {}

    for (const code of SUPPORTED_CURRENCIES) {
      if (rawRates[code] !== undefined) {
        filtered[code] = rawRates[code]
        // rawRates gives: 1 PKR = X units of code
        // We want: 1 unit of code = ? PKR  →  1 / rawRates[code]
        perUnit[code] = code === 'PKR' ? 1 : 1 / rawRates[code]
      }
    }

    setRates(filtered)
    setPkrRates(perUnit)
    setUsingFallback(isFallback)
    setLoading(false)
  }

  function applyFallback() {
    setPkrRates(FALLBACK_RATES)
    setUsingFallback(true)
    setLoading(false)
  }

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  /**
   * Convert amount from one currency to another.
   * @returns {number} converted amount
   */
  function convert(amount, fromCurrency, toCurrency) {
    if (!pkrRates || amount <= 0 || fromCurrency === toCurrency) return amount
    const fromPKR = pkrRates[fromCurrency] || 1
    const toPKR = pkrRates[toCurrency] || 1
    // amount in "from" → PKR → "to"
    const inPKR = amount * fromPKR
    return inPKR / toPKR
  }

  /**
   * Get exchange rate: 1 unit of `from` = ? units of `to`
   */
  function getRate(fromCurrency, toCurrency) {
    if (!pkrRates || fromCurrency === toCurrency) return 1
    const fromPKR = pkrRates[fromCurrency] || 1
    const toPKR = pkrRates[toCurrency] || 1
    return fromPKR / toPKR
  }

  return {
    pkrRates,       // { USD: 278.5, EUR: 301.2, ... } — PKR per 1 unit
    loading,
    error,
    lastUpdated,
    usingFallback,
    convert,
    getRate,
    refresh: fetchRates,
    currencies: SUPPORTED_CURRENCIES,
  }
}

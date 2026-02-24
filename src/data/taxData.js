/** Pakistan FBR Income Tax Slabs */
export const TAX_SLABS = {
  '2024-2025': [
    { min: 0,       max: 600000,   rate: 0,    fixed: 0 },
    { min: 600001,  max: 1200000,  rate: 5,    fixed: 0 },
    { min: 1200001, max: 2200000,  rate: 15,   fixed: 30000 },
    { min: 2200001, max: 3200000,  rate: 25,   fixed: 180000 },
    { min: 3200001, max: 4100000,  rate: 30,   fixed: 430000 },
    { min: 4100001, max: Infinity, rate: 35,   fixed: 700000 },
  ],
  '2023-2024': [
    { min: 0,       max: 600000,   rate: 0,    fixed: 0 },
    { min: 600001,  max: 1200000,  rate: 2.5,  fixed: 0 },
    { min: 1200001, max: 2400000,  rate: 12.5, fixed: 15000 },
    { min: 2400001, max: 3600000,  rate: 22.5, fixed: 165000 },
    { min: 3600001, max: 6000000,  rate: 27.5, fixed: 435000 },
    { min: 6000001, max: Infinity, rate: 35,   fixed: 1095000 },
  ],
}

/**
 * Calculate Pakistan income tax using progressive slab system.
 * @param {number} income – Taxable annual income
 * @param {string} year  – Tax year key, e.g. '2024-2025'
 * @returns {{ tax: number, breakdown: Array, effectiveRate: number }}
 */
export function calcTax(income, year) {
  const slabs = TAX_SLABS[year] || TAX_SLABS['2024-2025']
  if (income <= 0) return { tax: 0, breakdown: [], effectiveRate: 0 }

  let tax = 0

  for (let i = 0; i < slabs.length; i++) {
    const s = slabs[i]
    const isActive =
      income >= s.min && income <= (s.max === Infinity ? Infinity : s.max)

    if (isActive) {
      const excess = income - s.min + 1
      tax = s.fixed + (excess * s.rate) / 100
      break
    }
  }

  return {
    tax: Math.max(0, Math.round(tax)),
    effectiveRate: income > 0 ? (tax / income) * 100 : 0,
  }
}

/** Mock exchange rates (PKR per 1 unit of currency) */
export const EXCHANGE_RATES = {
  PKR: 1,
  USD: 278.50,
  EUR: 301.20,
  GBP: 352.80,
  SAR: 74.27,
  AED: 75.85,
  CAD: 205.40,
  AUD: 181.60,
  CNY: 38.45,
  INR: 3.31,
}

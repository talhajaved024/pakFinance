/** Format number with Pakistani locale commas */
export const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '0'
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

/** Format number with decimals */
export const fmtDec = (n, d = 2) => {
  if (n === undefined || n === null || isNaN(n)) return '0'
  return new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n)
}

/** Format percentage */
export const pct = (n) =>
  isNaN(n) || !isFinite(n) ? '0.00' : fmtDec(n)

/** Parse number from string, strip commas */
export const parseNum = (v) => {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return isNaN(n) ? 0 : n
}

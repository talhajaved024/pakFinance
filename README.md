# PakFinance — Pakistan Salary & Finance Calculators

A modern, responsive financial calculator web app built with **React.js + Vite**, designed for Pakistan.

## Calculators

| Calculator | Route | Description |
|---|---|---|
| Income Tax | `/income-tax-calculator-pakistan` | FBR progressive slab system (2023-24, 2024-25) |
| Salary Breakup | `/salary-breakup-estimator` | Basic + allowances + deductions → net pay |
| Loan / EMI | `/loan-emi-calculator` | EMI formula with amortization schedule |
| Currency | `/currency-comparison` | PKR ↔ 9 major currencies (mock-ready for live API) |
| Inflation | `/inflation-calculator` | Purchasing power erosion over time |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** — Functional components, hooks (`useState`, `useMemo`)
- **React Router v6** — Client-side routing with SEO-friendly paths
- **Vite 6** — Fast dev server and optimized builds
- **Pure CSS** — Custom properties, no heavy frameworks

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── InputField.jsx
│   ├── Toggle.jsx
│   ├── ResultPanel.jsx
│   ├── ExplanationSection.jsx
│   ├── AdPlaceholder.jsx
│   ├── SEOHead.jsx
│   └── ScrollToTop.jsx
├── pages/            # Route page components
│   ├── HomePage.jsx
│   ├── IncomeTaxPage.jsx
│   ├── SalaryBreakupPage.jsx
│   ├── LoanEMIPage.jsx
│   ├── CurrencyPage.jsx
│   ├── InflationPage.jsx
│   ├── PrivacyPage.jsx
│   └── NotFoundPage.jsx
├── data/
│   └── taxData.js    # Tax slabs, exchange rates
├── utils/
│   └── format.js     # Number formatting helpers
├── styles/
│   └── index.css     # Global styles
├── App.jsx           # Root component with routes
└── main.jsx          # Entry point
```

## Monetization

- AdSense placeholder slots are included on key pages
- Stripe upgrade modal hook ready (add your implementation)

## Live API Integration

The currency tool uses mock rates. To connect live rates:

1. Sign up at [Open Exchange Rates](https://openexchangerates.org/) or similar
2. Replace `EXCHANGE_RATES` in `src/data/taxData.js` with an API fetch
3. Add loading states as needed

## License

MIT

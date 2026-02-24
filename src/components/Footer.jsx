import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>PakFinance</h3>
          <p>
            Free, fast, and accurate financial calculators built for Pakistan.
            Tax, salary, loans, currency, and inflation — all in one place.
          </p>
        </div>

        <div className="footer-col">
          <h4>Calculators</h4>
          <Link to="/income-tax-calculator-pakistan">Income Tax</Link>
          <Link to="/salary-breakup-estimator">Salary Breakup</Link>
          <Link to="/loan-emi-calculator">Loan / EMI</Link>
          <Link to="/currency-comparison">Currency</Link>
          <Link to="/inflation-calculator">Inflation</Link>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} PakFinance. All calculations are estimates only.</span>
        <span>Built with ♥ in Pakistan</span>
      </div>
    </footer>
  )
}

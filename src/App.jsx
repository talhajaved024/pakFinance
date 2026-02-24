import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import HomePage from './pages/HomePage'
import IncomeTaxPage from './pages/IncomeTaxPage'
import SalaryBreakupPage from './pages/SalaryBreakupPage'
import LoanEMIPage from './pages/LoanEMIPage'
import CurrencyPage from './pages/CurrencyPage'
import InflationPage from './pages/InflationPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/income-tax-calculator-pakistan" element={<IncomeTaxPage />} />
        <Route path="/salary-breakup-estimator" element={<SalaryBreakupPage />} />
        <Route path="/loan-emi-calculator" element={<LoanEMIPage />} />
        <Route path="/currency-comparison" element={<CurrencyPage />} />
        <Route path="/inflation-calculator" element={<InflationPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </>
  )
}

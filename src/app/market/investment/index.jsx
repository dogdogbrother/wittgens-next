import { useAuthStore } from '../../../store/useAuthStore'
import { useInvestments } from '../../../hooks/useInvestments'
import InvestmentTable from './components/InvestmentTable'

export default function MyInvestment() {
  const { isLoggedIn } = useAuthStore()
  const invest = useInvestments()

  if (!isLoggedIn) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
        Please connect your wallet to view investments.
      </div>
    )
  }

  return (
    <div style={{ padding: '0' }}>
      <InvestmentTable {...invest} />
    </div>
  )
}

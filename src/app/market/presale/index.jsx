import { usePresaleMarket } from '../../../hooks/usePresaleMarket'
import PrimaryMarketTable from './components/PrimaryMarketTable'

export default function PresaleMarket() {
  const market = usePresaleMarket()

  return (
    <div style={{ padding: '0' }}>
      <PrimaryMarketTable {...market} />
    </div>
  )
}

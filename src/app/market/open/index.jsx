import { useSecondaryMarket } from '../../../hooks/useSecondaryMarket'
import OpenMarketTable from './components/OpenMarketTable'

export default function OpenMarket() {
  const market = useSecondaryMarket()

  return (
    <div style={{ padding: '0' }}>
      <OpenMarketTable {...market} />
    </div>
  )
}

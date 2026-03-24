import { Outlet } from 'react-router-dom'
import MarketTabs from './components/MarketTabs'

export default function Market() {
  return (
    <div className="w-full">
      <MarketTabs />
      <Outlet />
    </div>
  )
}

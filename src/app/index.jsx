import { Outlet } from 'react-router-dom'
import Header from './components/Header'

export default function AppLayout() {
  return (
    <div className="min-h-screen" style={{ minWidth: '1520px' }}>
      <Header />
      <main style={{ maxWidth: '1520px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}

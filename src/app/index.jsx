import { Outlet } from 'react-router-dom'
import Header from './components/Header'

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main style={{ maxWidth: '1520px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  )
}

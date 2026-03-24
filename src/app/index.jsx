import { Outlet } from 'react-router-dom'
import Header from './components/Header'

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

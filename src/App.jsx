import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './app/index'
import Tokenize from './app/tokenize/index'
import Market from './app/market/index'
import Earn from './app/earn/index'
import Swap from './app/swap/index'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/tokenize" replace />} />
          <Route path="tokenize" element={<Tokenize />} />
          <Route path="market" element={<Market />} />
          <Route path="earn" element={<Earn />} />
          <Route path="swap" element={<Swap />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/tokenize" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

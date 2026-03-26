import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './app/index'
import Tokenize from './app/tokenize/index'
import Market from './app/market/index'
import PresaleMarket from './app/market/presale/index'
import SecondaryMarket from './app/market/open/index'
import MyInvestment from './app/market/investment/index'
import MyCollection from './app/market/collection/index'
import Earn from './app/earn/index'
import Swap from './app/swap/index'
import TokenizationProperty from './app/tokenization-property/index'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/tokenize" replace />} />
          <Route path="tokenize" element={<Tokenize />} />
          <Route path="market" element={<Market />}>
            <Route index element={<Navigate to="/app/market/primary" replace />} />
            <Route path="primary" element={<PresaleMarket />} />
            <Route path="secondary" element={<SecondaryMarket />} />
            <Route path="investment" element={<MyInvestment />} />
          </Route>
          <Route path="collection" element={<MyCollection />} />
          <Route path="tokenization-property" element={<TokenizationProperty />} />
          <Route path="earn" element={<Earn />} />
          <Route path="swap" element={<Swap />} />
        </Route>
        <Route path="*" element={<Navigate to="/app/tokenize" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

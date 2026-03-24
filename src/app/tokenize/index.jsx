import { useState } from 'react'
import TokenizeHeader from './components/TokenizeHeader'
import emptyIcon from '../../assets/bg-svg/empty.svg'

const MOCK_COUNTS = { all: 0, tokenized: 0, reviewing: 0, rejected: 0 }

export default function Tokenize() {
  const [activeTab, setActiveTab] = useState('all')

  const isEmpty = true // 后续接入 API 后替换为真实数据判断

  return (
    <div style={{ padding: '0 24px' }}>
      <TokenizeHeader activeTab={activeTab} onTabChange={setActiveTab} counts={MOCK_COUNTS} />

      {isEmpty && (
        <div className="flex flex-col items-center justify-center" style={{ paddingTop: '60px' }}>
          <img src={emptyIcon} alt="No data" style={{ width: '320px', height: '320px' }} />
        </div>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import tokenizeIcon from '../../../assets/icon-svg/tokenize-property.svg'

const TABS = [
  { id: 'all',       label: 'All' },
  { id: 'tokenized', label: 'Tokenized' },
  { id: 'reviewing', label: 'Reviewing' },
  { id: 'rejected',  label: 'Rejected' },
]

export default function TokenizeHeader({ activeTab, onTabChange, counts = {} }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between py-4">
      {/* 左侧：Tokenize 按钮 */}
      <button
        onClick={() => navigate('/app/tokenization-property')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-none"
        style={{ width: '150px', background: 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)', transition: 'background 150ms' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #1465AA 0%, #005298 100%)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)')}
      >
        <img src={tokenizeIcon} alt="Tokenize" style={{ width: '28px', height: '28px' }} />
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff', fontFamily: 'Manrope, sans-serif', whiteSpace: 'nowrap' }}>
          Tokenize
        </span>
      </button>

      {/* 右侧：tab 切换 */}
      <div className="flex items-center gap-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const count = counts[tab.id] ?? 0
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 border-none cursor-pointer"
              style={{
                backgroundColor: isActive ? '#DBEAFE' : 'transparent',
                color: isActive ? '#2563EB' : '#4b5563',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              {tab.label}
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: isActive ? '#2563EB' : '#e5e7eb',
                  color: isActive ? '#fff' : '#4b5563',
                }}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

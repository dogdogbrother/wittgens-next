import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'

const TABS = [
  { to: '/app/market/primary',    label: 'Primary Market',  icon: 'mdi:rocket-launch-outline' },
  { to: '/app/market/secondary', label: 'Secondary Market', icon: 'ix:linechart' },
  { to: '/app/market/investment', label: 'My Investment',   icon: 'mdi:bank-outline' },
]

export default function MarketTabs() {
  return (
    <div
      className="w-full bg-white"
      style={{ borderBottom: '1px solid #e2e8f0' }}
    >
      <div className="flex items-center px-8">
        {TABS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 20px',
                  borderBottom: isActive ? '2px solid #0D6EC0' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  color: isActive ? '#0D6EC0' : '#64748b',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon icon={icon} width={16} height={16} />
                <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Manrope, sans-serif' }}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

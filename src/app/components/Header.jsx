import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Globe, Settings, Bell, ChevronDown, Wallet, LogOut, User, Check } from 'lucide-react'
import { Icon } from '@iconify/react'
import { createAvatar } from '@dicebear/core'
import { pixelArt } from '@dicebear/collection'
import { cn } from '../../lib/utils'
import { useAuthStore } from '../../store/useAuthStore'
import WalletDrawer from '../../components/WalletDrawer'
import connectWalletSvg from '../../assets/icon-svg/connectWallet.svg'

const LEFT_NAV = [
  { to: '/app/tokenize', label: 'Tokenize' },
  { to: '/app/market', label: 'Market' },
  { to: '/app/earn', label: 'Earn', hasDropdown: true },
  { to: '/app/swap', label: 'Swap', hasDropdown: true },
]

function shortAddress(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (ref.current && !ref.current.contains(e.target)) handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function NavItem({ to, label, hasDropdown }) {
  return (
    <NavLink to={to} className="h-full flex items-center" style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <div
          className="cursor-pointer"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Manrope, sans-serif', color: isActive ? '#fff' : 'rgba(255,255,255,0.75)', transition: 'color 150ms' }}>
              {label}
            </span>
            {hasDropdown && <ChevronDown size={13} style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.75)' }} />}
          </div>
          <div style={{ height: '2px', width: '100%', backgroundColor: isActive ? '#92C4EF' : 'transparent', borderRadius: '15px', transition: 'background-color 150ms' }} />
        </div>
      )}
    </NavLink>
  )
}

function IconBtn({ icon: Icon, badge = false }) {
  return (
    <button
      className="relative p-2 transition-all duration-200 hover:bg-white/10 cursor-pointer border-0 bg-transparent"
      style={{ color: '#cee5ff', borderRadius: '4px' }}
    >
      <Icon size={20} />
      {badge && (
        <span className="absolute bg-red-600 rounded-full" style={{ top: '7px', right: '7px', width: '7px', height: '7px' }} />
      )}
    </button>
  )
}

function BnbLogo() {
  return <Icon icon="token-branded:bnb" width={20} height={20} className="shrink-0" />
}

function EthLogo() {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: '20px', height: '20px', backgroundColor: '#627EEA' }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
        <path d="M12 1.75L5.75 12.25L12 16L18.25 12.25L12 1.75Z" opacity="0.6" />
        <path d="M5.75 13.5L12 22.25L18.25 13.5L12 17.25L5.75 13.5Z" />
      </svg>
    </div>
  )
}

function WalletAvatar({ address, size = 22 }) {
  if (!address) return <div className="rounded-full shrink-0 bg-gray-400" style={{ width: size, height: size }} />
  const svg = createAvatar(pixelArt, { seed: address.toLowerCase(), size }).toDataUri()
  return (
    <div className="rounded-full shrink-0 flex items-center justify-center overflow-hidden" style={{ width: size + 6, height: size + 6, backgroundColor: 'rgba(255,255,255,0.15)', padding: '2px' }}>
      <img src={svg} className="rounded-full" style={{ width: size, height: size }} alt="avatar" />
    </div>
  )
}

const glassBtn = {
  display: 'flex', alignItems: 'center', gap: '6px',
  height: '40px', padding: '0 12px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px', color: '#fff', cursor: 'pointer',
  transition: 'background-color 150ms', whiteSpace: 'nowrap',
}

const dropdownMenu = {
  position: 'absolute', top: 'calc(100% + 8px)',
  backgroundColor: '#fff', borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  zIndex: 60, overflow: 'hidden', padding: '6px 0', minWidth: '210px',
  whiteSpace: 'nowrap',
}

function DropdownItem({ onClick, children, danger = false, separator = false }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1 px-3 py-1.5 text-sm text-left transition-colors"
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#1e293b',
        borderTop: separator ? '1px solid #f1f5f9' : 'none',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {children}
    </button>
  )
}

const NETWORKS = [
  { id: 'bnb', label: 'BNB Smart Chain', Logo: BnbLogo },
]

function NetworkDropdown() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('bnb')
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const currentNet = NETWORKS.find((n) => n.id === current)

  return (
    <div ref={ref} style={{ position: 'relative', marginLeft: '10px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ ...glassBtn, width: '210px' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
      >
        <currentNet.Logo />
        <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif', flex: 1, textAlign: 'left' }}>{currentNet.label}</span>
        <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.8)', transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{ ...dropdownMenu, left: 0 }}>
          {NETWORKS.map((net) => (
            <DropdownItem key={net.id} onClick={() => { setCurrent(net.id); setOpen(false) }}>
              <net.Logo />
              <span style={{ fontWeight: 500, flex: 1 }}>{net.label}</span>
              {current === net.id && <Check size={14} style={{ color: '#23547b' }} />}
            </DropdownItem>
          ))}
        </div>
      )}
    </div>
  )
}

function WalletDropdown({ address, logout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} style={{ position: 'relative', marginLeft: '4px' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ ...glassBtn }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.18)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
      >
        <WalletAvatar address={address} />
        <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{shortAddress(address)}</span>
        <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.8)', transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div style={{ ...dropdownMenu, right: 0 }}>
          <DropdownItem onClick={() => setOpen(false)}>
            <User size={16} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 500 }}>Profile</span>
          </DropdownItem>
          <DropdownItem onClick={() => { logout(); setOpen(false) }} separator>
            <LogOut size={16} style={{ color: '#64748b' }} />
            <span style={{ fontWeight: 500 }}>Disconnect</span>
          </DropdownItem>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const [walletOpen, setWalletOpen] = useState(false)
  const { isLoggedIn, address, logout } = useAuthStore()

  return (
    <>
      <header className="w-full sticky top-0 z-50 border-b border-white/10" style={{ background: 'linear-gradient(to right, #003d62, #23547b)' }}>
        <div className="flex items-center justify-between px-8" style={{ maxWidth: '1920px', margin: '0 auto', height: '78px' }}>

          <nav className="flex items-center gap-8 h-full">
            {LEFT_NAV.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} hasDropdown={item.hasDropdown} />
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <IconBtn icon={Globe} />
            <IconBtn icon={Settings} />
            <IconBtn icon={Bell} badge />

            <NetworkDropdown />

            {isLoggedIn ? (
              <WalletDropdown address={address} logout={logout} />
            ) : (
              <button
                onClick={() => setWalletOpen(true)}
                className="flex items-center gap-2 cursor-pointer transition-colors duration-150"
                style={{ height: '40px', padding: '0 14px', marginLeft: '6px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '8px', color: '#fff', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
              >
                <img src={connectWalletSvg} className="w-4 h-4" alt="" />
                <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Connect Wallet</span>
              </button>
            )}
          </div>

        </div>
      </header>

      <WalletDrawer open={walletOpen} onOpenChange={setWalletOpen} />
    </>
  )
}

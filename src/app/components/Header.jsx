import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Globe, Settings, Bell, ChevronDown, LogOut, Check } from 'lucide-react'
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
    <NavLink to={to} className="h-full flex items-center no-underline">
      {({ isActive }) => (
        <div className="cursor-pointer flex flex-col items-center gap-[3px]">
          <div className="flex items-center gap-1">
            <span className={cn(
              'text-[14px] font-bold font-[Manrope,sans-serif] transition-colors duration-150',
              isActive ? 'text-white' : 'text-white/75'
            )}>
              {label}
            </span>
            {hasDropdown && (
              <ChevronDown size={13} className={cn(isActive ? 'text-white' : 'text-white/75')} />
            )}
          </div>
          <div className={cn(
            'h-0.5 w-full rounded-full transition-colors duration-150',
            isActive ? 'bg-[#92C4EF]' : 'bg-transparent'
          )} />
        </div>
      )}
    </NavLink>
  )
}

function IconBtn({ icon: IconComponent, badge = false }) {
  return (
    <button className="relative p-2 transition-all duration-200 hover:bg-white/10 cursor-pointer border-0 bg-transparent text-[#cee5ff] rounded-[4px]">
      <IconComponent size={20} />
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
    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#627EEA]">
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
    <div
      className="rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-white/15 p-0.5"
      style={{ width: size + 6, height: size + 6 }}
    >
      <img src={svg} className="rounded-full" style={{ width: size, height: size }} alt="avatar" />
    </div>
  )
}

function DropdownItem({ onClick, children, separator = false }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-1 px-3 py-1.5 text-sm text-left text-slate-800 bg-transparent border-none cursor-pointer transition-colors hover:bg-slate-50',
        separator && 'border-t border-slate-100'
      )}
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
    <div ref={ref} className="relative ml-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-3 w-[210px] bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer transition-colors duration-150 hover:bg-white/18 whitespace-nowrap"
      >
        <currentNet.Logo />
        <span className="text-[13px] font-semibold font-[Inter,sans-serif] flex-1 text-left">{currentNet.label}</span>
        <ChevronDown
          size={13}
          className={cn('text-white/80 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-white rounded-xl border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-60 overflow-hidden py-1.5 min-w-[210px] whitespace-nowrap">
          {NETWORKS.map((net) => (
            <DropdownItem key={net.id} onClick={() => { setCurrent(net.id); setOpen(false) }}>
              <net.Logo />
              <span className="font-medium flex-1">{net.label}</span>
              {current === net.id && <Check size={14} className="text-[#23547b]" />}
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
    <div ref={ref} className="relative ml-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-9 px-3 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer transition-colors duration-150 hover:bg-white/18 whitespace-nowrap"
      >
        <WalletAvatar address={address} />
        <span className="text-[13px] font-semibold font-[Inter,sans-serif]">{shortAddress(address)}</span>
        <ChevronDown
          size={13}
          className={cn('text-white/80 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 bg-white rounded-xl border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-60 overflow-hidden py-1.5 w-full whitespace-nowrap">
          <DropdownItem onClick={() => { logout(); setOpen(false) }}>
            <LogOut size={16} className="text-slate-500" />
            <span className="font-medium">Disconnect</span>
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
      <header
        className="w-full sticky top-0 z-50 border-b border-white/10"
        style={{ background: 'linear-gradient(to right, #003d62, #23547b)' }}
      >
        <div className="flex items-center justify-between px-8 mx-auto h-[78px]" style={{ maxWidth: '1920px' }}>

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
                className="flex items-center gap-2 h-10 px-3.5 ml-1.5 bg-white/15 border border-white/35 rounded-lg text-white cursor-pointer transition-colors duration-150 hover:bg-white/25 whitespace-nowrap"
              >
                <img src={connectWalletSvg} className="w-4 h-4" alt="" />
                <span className="text-[13px] font-semibold font-[Inter,sans-serif]">Connect Wallet</span>
              </button>
            )}
          </div>

        </div>
      </header>

      <WalletDrawer open={walletOpen} onOpenChange={setWalletOpen} />
    </>
  )
}

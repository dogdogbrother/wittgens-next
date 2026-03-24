import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet'
import wallet1Icon from '../assets/icon-svg/wallet1.svg'
import wallet2Icon from '../assets/icon-svg/wallet2.svg'
import wallet3Icon from '../assets/icon-svg/wallet3.svg'
import wallet4Icon from '../assets/icon-svg/wallet4.svg'
import { getNonce, loginWithSignature } from '../utils/authApi'
import { useAuthStore } from '../store/useAuthStore'

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect with MetaMask browser extension',
    icon: wallet4Icon,
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    description: 'Connect with the popular browser extension',
    icon: wallet1Icon,
  },
  {
    id: 'walletconnect',
    name: 'Wallet Connect',
    description: 'Scan QR code with any compatible mobile wallet',
    icon: wallet2Icon,
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Connect with Coinbase wallet',
    icon: wallet3Icon,
  },
]

const STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  SIGNING: 'signing',
  LOGGING_IN: 'logging_in',
  SUCCESS: 'success',
  ERROR: 'error',
}

const statusText = {
  connecting: '正在连接钱包...',
  signing: '请在 MetaMask 中确认签名...',
  logging_in: '正在登录...',
  success: '登录成功！',
}

function WalletDrawer({ open, onOpenChange }) {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [errorMsg, setErrorMsg] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)

  const isLoading = [STATUS.CONNECTING, STATUS.SIGNING, STATUS.LOGGING_IN].includes(status)

  const handleMetaMaskLogin = async () => {
    setErrorMsg('')
    if (!window.ethereum) {
      setStatus(STATUS.ERROR)
      setErrorMsg('未检测到 MetaMask，请先安装 MetaMask 插件后刷新页面。')
      return
    }
    try {
      setStatus(STATUS.CONNECTING)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      const nonceData = await getNonce(address)
      const message = nonceData.message
      const nonce = nonceData.nonce

      setStatus(STATUS.SIGNING)
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })

      setStatus(STATUS.LOGGING_IN)
      const loginData = await loginWithSignature(address, nonce, signature)

      setAuth({ token: loginData.accessToken, refreshToken: loginData.refreshToken ?? null, address })
      setStatus(STATUS.SUCCESS)
      setTimeout(() => {
        onOpenChange(false)
        setStatus(STATUS.IDLE)
      }, 800)
    } catch (err) {
      console.error('MetaMask 登录失败:', err)
      setStatus(STATUS.ERROR)
      setErrorMsg(err.code === 4001 ? '您已取消签名授权，登录中止。' : (err.message || '登录失败，请重试。'))
    }
  }

  const handleWalletConnect = (walletId) => {
    if (walletId === 'metamask') handleMetaMaskLogin()
  }

  const handleOpenChange = (v) => {
    if (!isLoading) {
      onOpenChange(v)
      if (!v) {
        setStatus(STATUS.IDLE)
        setErrorMsg('')
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-[520px] sm:max-w-[548px]">
        <SheetHeader className="pt-5 pb-4">
          <SheetTitle className="text-xl font-semibold text-center">Connect Your Wallet</SheetTitle>
        </SheetHeader>

        {/* 状态提示 */}
        {status !== STATUS.IDLE && (
          <div
            className={[
              'mb-4 px-4 py-3 rounded-lg text-sm font-medium text-center',
              status === STATUS.SUCCESS ? 'bg-green-50 text-green-700 border border-green-200' : '',
              status === STATUS.ERROR ? 'bg-red-50 text-red-600 border border-red-200' : '',
              isLoading ? 'bg-blue-50 text-blue-700 border border-blue-200' : '',
            ].join(' ')}
          >
            {isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2 align-middle" />
            )}
            {statusText[status] || errorMsg}
          </div>
        )}

        {/* 钱包选项列表 */}
        <div className="mt-2 space-y-5">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletConnect(wallet.id)}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex gap-6">
                <img src={wallet.icon} alt={wallet.name} className="w-10 h-10 rounded mt-1.5" />
                <div className="text-left w-64">
                  <div className="text-lg font-semibold text-[#00032A] mb-1">{wallet.name}</div>
                  <div className="text-sm/[16px] font-semibold text-[#555C70]">{wallet.description}</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* MetaMask 安装引导 */}
        {status === STATUS.ERROR && errorMsg.includes('MetaMask') && (
          <div className="mt-4 text-center">
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              点击这里下载安装 MetaMask →
            </a>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default WalletDrawer

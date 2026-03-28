import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select'
import propertyIcon from '../../../../assets/icon-svg/b-home.svg'

function  SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[13px] font-semibold text-[#59636E] whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-[#E5EBF1]" />
    </div>
  )
}

export function SubscriptionForm({
  assetName = 'RWAT12345',
  shortToken = '0x3a...45b0',
  tradingPair = 'RWAT-PRO-12345',
  projectToken = '',
  issuePrice = 0.003,
}) {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [payToken, setPayToken] = useState('usdt')

  const subscriptionAmount = amount
    ? (parseFloat(amount) / issuePrice).toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    : '20,000,000.0000'

  const amountUsd = amount ? (parseFloat(amount) * 1.2).toFixed(2) : '240.00'

  return (
    <div className="w-[558px] shrink-0 h-fit border border-[#E5EBF1] rounded-lg py-6 px-7">

      {/* Asset Type */}
      <SectionTitle>Asset Type</SectionTitle>
      <div className="flex items-center gap-2 mb-6">
        <img src={propertyIcon} alt="property" className="w-8 h-8" />
        <div className="flex flex-col mr-3 ">
          <span className="text-[14px] font-bold text-[#142B40]">{assetName}</span>
          <span
            className="inline-flex items-center px-2 h-[18px] rounded text-[10px] font-medium mt-0.5"
            style={{ background: '#EDF5FF', border: '1px solid #C8DEFA', color: '#0D6EC0' }}
          >
            {tradingPair}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[13px] text-[#0D6EC0] underline cursor-pointer">{shortToken}</span>
          <button
            className="text-slate-400 hover:text-slate-600 bg-transparent border-none p-0 cursor-pointer"
            onClick={() => navigator.clipboard.writeText(projectToken || shortToken)}
          >
            <Icon icon="bx:copy" width={15} height={15} />
          </button>
        </div>
      </div>

      {/* Payment */}
      <SectionTitle>Payment</SectionTitle>
      <div className="flex items-center justify-between mb-2">
        <Select value={payToken} onValueChange={setPayToken}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usdt">
              <div className="flex items-center gap-1.5">
                <Icon icon="cryptocurrency-color:usdt" width={16} height={16} />
                <span>USDT</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="text-[14px]/[1.6] text-[#59636E] font-semibold">Balance:20,000,000.0000</span>
            <span className="text-[12px]/[1.6] text-[#59636E]">≈ $ 36.1</span>
          </div>
          <button
            className="px-2.5 py rounded text-[13px] font-semibold"
            style={{ background: 'white', color: '#0D6EC0', border: '1px solid #C8DEFA' }}
            onClick={() => setAmount('20000000')}
          >
            max
          </button>
        </div>
      </div>
      <div
        className="flex items-center rounded-lg px-3 mb-1"
        style={{ height: '48px', border: '1px solid #DDE7F0', background: '#F8FAFC' }}
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="00.00"
          className="flex-1 bg-transparent border-none outline-none text-[22px] font-semibold text-[#142B40] placeholder-[#C5D3E0]"
          style={{ minWidth: 0 }}
        />
        <span className="text-[13px] text-[#8B9DB5] shrink-0">USDT</span>
      </div>
      <p className="text-[12px] text-[#8B9DB5] mb-6">
        ≈ $ {amount ? parseFloat(amount).toFixed(2) : '00.00'}
      </p>

      {/* Subscription Amount */}
      <SectionTitle>Subscription Amount</SectionTitle>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[22px] font-bold text-[#142B40]">{subscriptionAmount}</span>
        <span className="text-[13px] text-[#8B9DB5]">RWAT</span>
      </div>
      <p className="text-[12px] text-[#8B9DB5] mb-5">≈ ${amountUsd}</p>

      {/* 提示 */}
      <div
        className="flex items-center gap-2 mb-6 px-3 py-2.5 rounded-lg"
        style={{ background: '#EDF5FF' }}
      >
        <Icon icon="mdi:information-outline" width={14} height={14} style={{ color: '#5A9BCF', flexShrink: 0 }} />
        <p className="text-[12px] text-[#7EADD1]">
          You can only claim your tokens after the pre-sale period ends.
        </p>
      </div>

      {/* 按钮 */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 h-[44px] rounded-lg text-[14px] font-semibold cursor-pointer border-none"
          style={{ background: '#B4C7D9', color: '#fff' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#9AB4CA' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#B4C7D9' }}
        >
          Cancel
        </button>
        <button
          className="flex-1 h-[44px] rounded-lg text-[14px] font-semibold text-white cursor-pointer border-none"
          style={{ background: 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(90deg, #1465AA 0%, #005298 100%)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)' }}
        >
          Subscribe
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import placeholderImg from '../../../../assets/bg-svg/empty.svg'
import liveTagImg from '../../../../assets/icon-svg/liveTag.svg'
import noLiveTagImg from '../../../../assets/icon-svg/noLiveTag.svg'

/* ─── 倒计时 hook ─── */
function useCountdown(endTimestamp) {
  const calc = () => {
    const diff = Math.max(0, endTimestamp - Date.now())
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [endTimestamp])
  return time
}

/* ─── 倒计时格子 ─── */
const UNIT_LABELS = ['DAY', 'HOUR', 'MIN', 'SEC']

function CountdownUnit({ value, index }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center text-[15px] font-bold rounded-lg"
        style={{
          width: '42px',
          height: '42px',
          background: '#F0F5F9',
          border: '1px solid #DDE7F0',
          color: '#00AC98',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-[#8B9DB5] font-medium tracking-widest">{UNIT_LABELS[index]}</span>
    </div>
  )
}

/* ─── 虚线行 ─── */
function DashedRow({ label, value, subValue, last }) {
  return (
    <div className="flex items-center justify-between pb-1.5 pt-2.5 relative">
      <span className="text-[13px] text-[#7D7D7D]">{label}</span>
      <div className="flex flex-col items-end">
        <span className="text-[13px] font-semibold text-[#323232] leading-tight">{value}</span>
        {subValue && <span className="text-[11px] text-[#888] leading-tight">{subValue}</span>}
      </div>
      {!last && (
        <span
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ backgroundImage: 'repeating-linear-gradient(to right, #E5EBF1 0, #E5EBF1 6px, transparent 6px, transparent 12px)' }}
        />
      )}
    </div>
  )
}

export default function PresaleCard({ item }) {
  const [collected, setCollected] = useState(false)
  const countdown = useCountdown(item.endTimestamp ?? Date.now())
  const isLive = item.status === 'live'

  const symbol = item.baseAsset ?? '—'
  const tradingPair = item.symbol ?? '—'
  const title = item.projectTitle || symbol
  const serialNo = item.projectId ? `US${String(item.projectId).padStart(11, '0')}` : 'US00238840136'
  const token = item.projectToken
    ? item.projectToken.slice(0, 6) + '...' + item.projectToken.slice(-4)
    : '—'

  const fmt = (v, d = 2) =>
    v != null ? Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d }) : '—'

  return (
    <div
      className="rounded-lg bg-white px-4 pt-4 pb-2"
      style={{ border: '1px solid #D5E8F8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* 顶部：图片 + 信息 */}
      <div className="flex gap-3 mb-4">
        {/* 图片 + Live 徽章 */}
        <div className="relative shrink-0" style={{ width: '140px', height: '136px' }}>
          <div
            className="w-full h-full overflow-hidden"
            style={{ boxShadow: '0 0 3px rgba(0,0,0,0.25)', padding: '3px' }}
          >
            <div
              style={{
                width: '100%', height: '100%',
                backgroundImage: `url(${placeholderImg})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                backgroundColor: '#E8F0F8',
              }}
            />
          </div>
          {/* Live badge */}
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '29px' }}>
            <img src={isLive ? liveTagImg : noLiveTagImg} alt="live" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            <span style={{ position: 'relative', zIndex: 1, color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '0.02em', marginRight: '8px' }}>
              Live
            </span>
          </div>
        </div>

        {/* 右侧信息 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-[#142B40] mb-2 truncate">{title}</h3>
          <div className="flex items-center gap-1 text-[#59636E] mb-3">
            <Icon icon="material-symbols:home-pin-outline" width={14} height={14} />
            <span className="text-[13px] truncate">Unit 307, 8956 Arbutus ...Canada</span>
          </div>
          {/* 徽章行 1 */}
          <div
            className="flex items-center gap-2 px-2.5 mb-2"
            style={{ height: '34px', borderRadius: '6px', background: '#F4F7FA' }}
          >
            <Icon icon="akar-icons:bitcoin-fill" width={20} height={20} style={{ color: '#0D6EC0' }} />
            <span className="text-[12px] font-medium text-[#142B40]">{symbol}</span>
            <div
              className="flex items-center px-2 h-[22px] rounded text-[11px] font-medium text-[#0D6EC0]"
              style={{ border: '1px solid #C8DEFA', background: '#EDF5FF' }}
            >
              {tradingPair}
            </div>
          </div>
          {/* 徽章行 2 */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-2 h-[26px] rounded flex-1 min-w-0" style={{ background: '#F4F7FA' }}>
              <span className="text-[11px] text-[#555C70] truncate">{serialNo}</span>
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-0 shrink-0" onClick={() => navigator.clipboard.writeText(serialNo)}>
                <Icon icon="mdi:content-copy" width={12} height={12} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 px-2 h-[26px] rounded flex-1 min-w-0" style={{ background: '#F4F7FA' }}>
              <span className="text-[11px] text-[#0D6EC0] underline truncate cursor-pointer">{token}</span>
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-0 shrink-0" onClick={() => item.projectToken && navigator.clipboard.writeText(item.projectToken)}>
                <Icon icon="mdi:content-copy" width={12} height={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 列统计 */}
      <div
        className="grid grid-cols-3 gap-2 rounded-lg mb-3 p-2"
        style={{ border: '1px solid #DDE7F0', background: 'white' }}
      >
        {[
          { label: 'Total Supply', value: fmt(item.totalSupply), unit: 'RWAT', sub: '≈ $35.1' },
          { label: 'Tokenized value', value: fmt(item.tokenizedValue), unit: 'USDT', sub: '≈ $35.1' },
          { label: 'Projected APY', value: item.projectedAPY ?? '—', apy: true },
        ].map((cell, i) => (
          <div key={i} className="rounded-md px-2 py-1" style={{ background: '#F4F7F9' }}>
            <p className="text-[10px] text-[#8B9DB5] mb-0.5">{cell.label}</p>
            <div className="flex items-baseline gap-1">
              <p className={`text-[13px] font-bold leading-none ${cell.apy ? 'text-[#FF521D]' : 'text-[#323232]'}`}>
                {cell.value}
              </p>
              {cell.unit && <span className="text-[10px] leading-none text-[#8B9DB5]">{cell.unit}</span>}
            </div>
            {cell.sub && (
              <span
                className="inline-flex items-center px-1.5 text-[10px] text-[#59636E] rounded"
                style={{ background: '#E2EAF2', height: '18px' }}
              >
                {cell.sub}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 倒计时 + 日期 */}
      <div
        className="flex items-center justify-between rounded-lg px-3 py-2 mb-3"
        style={{ border: '1px solid #DDE7F0', background: '#F8FAFC' }}
      >
        <div className="flex items-center gap-1">
          <CountdownUnit value={countdown.d} index={0} />
          <span className="text-[#8B9DB5] text-[14px] font-bold mb-6">:</span>
          <CountdownUnit value={countdown.h} index={1} />
          <span className="text-[#8B9DB5] text-[14px] font-bold mb-6">:</span>
          <CountdownUnit value={countdown.m} index={2} />
          <span className="text-[#8B9DB5] text-[14px] font-bold mb-6">:</span>
          <CountdownUnit value={countdown.s} index={3} />
        </div>
        <div className="flex flex-col gap-1 text-right">
          <div className="flex items-center gap-1 text-[13px] text-[#59636E]">
            <Icon icon="material-symbols-light:event-available-sharp" width={15} height={15} />
            <span>Start date {item.startDate ?? '—'}</span>
          </div>
          <div className="flex items-center gap-1 text-[13px] text-[#59636E]">
            <Icon icon="material-symbols-light:event-busy-sharp" width={15} height={15} />
            <span>End date &nbsp; {item.endDate ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* 指标列表 */}
      <DashedRow
        label="Presale supply (RWAT)"
        value={fmt(item.presaleSupply, 0)}
        subValue="≈$35.1"
      />
      <DashedRow
        label="Issue price  (USD/RWAT)"
        value={item.issuePrice ?? '—'}
        subValue="≈$35.1"
      />
      <DashedRow
        label="Use of Proceeds"
        value={item.useOfProceeds ?? '—'}
        last
      />

      {/* 按钮 */}
      <div className="flex gap-2 mt-3">
        <button
          disabled={!isLive}
          className="flex-1 h-[44px] text-white text-[14px] font-semibold rounded-lg transition-opacity border-none cursor-pointer"
          style={{
            background: isLive
              ? 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)'
              : '#CBD5E1',
          }}
          onMouseEnter={e => { if (isLive) e.currentTarget.style.background = 'linear-gradient(90deg, #1465AA 0%, #005298 100%)' }}
          onMouseLeave={e => { if (isLive) e.currentTarget.style.background = 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)' }}
        >
          Subscribe
        </button>
        <button
          onClick={() => isLive && setCollected(v => !v)}
          disabled={!isLive}
          className="w-[44px] h-[44px] rounded-lg flex items-center justify-center transition-opacity shrink-0"
          style={
            !isLive
              ? {
                  background: '#EAF0F6',
                  border: '1px solid #D2D8DD',
                  color: '#A8BDD0',
                  cursor: 'not-allowed',
                }
              : {
                  background: '#D8E6F2',
                  border: '1px solid #0A6DC0',
                  color: collected ? '#F59E0B' : '#0A6DC0',
                  cursor: 'pointer',
                }
          }
        >
          <Icon
            icon={
              !isLive
                ? 'material-symbols:kid-star-outline-sharp'
                : collected
                  ? 'material-symbols:kid-star-sharp'
                  : 'material-symbols:kid-star-outline-sharp'
            }
            width={22} height={22}
          />
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <button className="text-[12px] text-slate-400 hover:underline transition-all cursor-pointer bg-transparent border-none">
          Details
        </button>
      </div>
    </div>
  )
}

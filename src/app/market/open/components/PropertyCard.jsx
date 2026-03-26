import { useState } from 'react'
import { Icon } from '@iconify/react'
import placeholderImg from '../../../../assets/bg-svg/empty.svg'
import DashedRow from '../../components/DashedRow'

export default function PropertyCard({ item, onDelete, hideCollect }) {
  const [collected, setCollected] = useState(false)
  const symbol = item.baseAsset ?? '—'
  const tradingPair = item.symbol ?? '—'
  const title = item.projectTitle || symbol
  const token = item.projectToken
    ? item.projectToken.slice(0, 6) + '...' + item.projectToken.slice(-4)
    : '—'
  const serialNo = item.projectId
    ? `US${String(item.projectId).padStart(11, '0')}`
    : 'US00238840136'

  return (
    <div
      className="rounded-lg bg-white px-4 pt-4 pb-2 relative"
      style={{ border: '1px solid #D5E8F8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {onDelete && (
        <button
          onClick={() => onDelete(item.id ?? item.projectId)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer border-none z-10"
        >
          <Icon icon="mdi:close" width={13} height={13} />
        </button>
      )}

        {/* 顶部：图片 + 信息 */}
        <div className="flex gap-3 mb-4">
          {/* 左侧图片 */}
          <div
            className="shrink-0 overflow-hidden"
            style={{ width: '140px', height: '136px', boxShadow: '0 0 3px rgba(0,0,0,0.25)', padding: '3px' }}
          >
            <img
              src={placeholderImg}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 右侧信息 */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-[#142B40] mb-2 truncate">{title}</h3>
            {/* 地址 */}
            <div className="flex items-center gap-1 text-[#59636E] mb-2">
              <Icon icon="material-symbols:home-pin-outline" width={14} height={14} />
              <span className="text-[13px] truncate">Unit 307, 8956 Arbutus ...Canada</span>
            </div>
            {/* 徽章行 1：token icon + symbol | 交易对 tag，外层阴影容器 */}
            <div
              className="flex items-center gap-2 px-2.5 mb-2"
              style={{
                height: '34px',
                borderRadius: '6px',
                background: '#F4F7FA',
              }}
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
            {/* 徽章行 2：序列号 | 合约地址 */}
            <div className="flex gap-2">
              <div
                className="flex items-center gap-1.5 px-2 h-[26px] rounded flex-1 min-w-0"
                style={{ background: '#F4F7FA' }}
              >
                <span className="text-[11px] text-[#555C70] truncate">{serialNo}</span>
                <button
                  className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-0 shrink-0"
                  onClick={() => navigator.clipboard.writeText(serialNo)}
                >
                  <Icon icon="mdi:content-copy" width={12} height={12} />
                </button>
              </div>
              <div
                className="flex items-center gap-1.5 px-2 h-[26px] rounded flex-1 min-w-0"
                style={{ background: '#F4F7FA' }}
              >
                <span className="text-[11px] text-[#0D6EC0] underline truncate cursor-pointer">{token}</span>
                <button
                  className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none p-0 shrink-0"
                  onClick={() => item.projectToken && navigator.clipboard.writeText(item.projectToken)}
                >
                  <Icon icon="mdi:content-copy" width={12} height={12} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 数据格 2x2 */}
        <div
          className="grid grid-cols-2 gap-2 rounded-lg mb-3 p-2"
          style={{ border: '1px solid #DDE7F0', background: 'white' }}
        >
          {[
            {
              label: 'Total Supply',
              value: item.totalSupply
                ? Number(item.totalSupply).toLocaleString(undefined, { minimumFractionDigits: 2 })
                : '500,063.00',
              unit: 'RWAT',
              sub: '≈ $35.1',
            },
            {
              label: 'Tokenized value',
              value: item.tokenizedValue
                ? Number(item.tokenizedValue).toLocaleString(undefined, { minimumFractionDigits: 2 })
                : '500,063.00',
              unit: 'USDT',
              sub: '≈ $35.1',
            },
            {
              label: 'Estimated APY',
              value: item.estimatedAPY ?? '20%',
              apy: true,
            },
            {
              label: 'Use of Proceeds',
              value: item.useOfProceeds ?? 'Construction Funds',
              bold: true,
            },
          ].map((cell, i) => (
            <div key={i} className="rounded-md px-3 py-1.5" style={{ background: '#F4F7F9' }}>
              <p className="text-[11px] text-[#8B9DB5] mb-1">{cell.label}</p>
              <div className="flex items-baseline gap-1">
                <p
                  className={`text-[14px] font-bold leading-tight ${
                    cell.apy ? 'text-[#FF521D]' : cell.bold ? 'text-[#142B40]' : 'text-[#323232]'
                  }`}
                >
                  {cell.value}
                </p>
                {cell.unit && (
                  <span className="text-[11px] text-[#8B9DB5] font-medium">{cell.unit}</span>
                )}
              </div>
              {cell.sub && (
                <span
                  className="inline-flex items-center mt-1 px-1.5 text-[11px] text-[#59636E] rounded"
                  style={{ background: '#E2EAF2', height: '24px' }}
                >
                  {cell.sub}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 指标列表 */}
        <DashedRow label="Circulating Supply(RWAT)" value={item.circulatingSupply ?? '200,000.00'} subValue="≈$35.1" />
        <DashedRow label="Market Cap (USD)" value={item.marketCap ?? '$893,233.456.0046'} />
        <DashedRow label="Current Price(USDT/RWAT)" value={item.currentPrice ?? '3400.5038'} />
        <DashedRow label="Current Holders" value={item.currentHolders ?? '45000'} />
        <DashedRow label="Share" value={item.share ?? '23%'} last />

        {/* 按钮 */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 h-[44px] text-white text-[14px] font-semibold rounded-lg transition-opacity hover:opacity-90 cursor-pointer border-none"
            style={{ background: 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)' }}
          >
            Trade
          </button>
          {!hideCollect && (
            <button
              onClick={() => setCollected(v => !v)}
              className="w-[44px] h-[44px] border border-[#0A6DC0] bg-[#D8E6F2] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shrink-0"
              style={{ color: collected ? '#F59E0B' : '#0A6DC0' }}
            >
              <Icon
                icon={collected ? 'material-symbols:kid-star-sharp' : 'material-symbols:kid-star-outline-sharp'}
                width={22}
                height={22}
              />
            </button>
          )}
        </div>
        <div className="flex justify-center mt-2">
          <button className="text-[14px] text-slate-400 hover:underline transition-all cursor-pointer bg-transparent border-none">
            Details
          </button>
        </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { Icon } from '@iconify/react'
import Pagination from '../components/Pagination'
import CategoryFilter from '../components/CategoryFilter'
import ViewModeToggle from '../components/ViewModeToggle'
import { TH, TD, SymbolBadge, TableLoadingRow, TableEmptyRow } from '../components/TableCells'
import { useTableScrollShadow } from '../components/useTableScrollShadow'
import PresaleCard from '../presale/components/PresaleCard'
import PropertyCard from '../open/components/PropertyCard'

/* ─── mock 数据 ─── */
const now = Date.now()
const DAY = 86400000

const PRESALE_MOCK = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  projectId: 980023458 + i,
  projectTitle: 'Opensea House',
  baseAsset: `RWAT${100000 + i * 13457}`,
  symbol: `RWAT-PRO-${String(i + 1).padStart(2, '0')}/USDT`,
  projectToken: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f45b0',
  status: i < 3 ? 'live' : 'ended',
  totalSupply: 500063, tokenizedValue: 500063, projectedAPY: '20%',
  startDate: new Date(now - DAY * 5).toISOString().slice(0, 10),
  endDate: new Date(now + DAY * (30 - i * 5)).toISOString().slice(0, 10),
  endTimestamp: now + DAY * (30 - i * 5),
  presaleSupply: 1000000, issuePrice: '0.003', useOfProceeds: 'Upgrade Infrastructure',
  icoStatus: i < 3 ? 'ICO live' : 'ICO Ended',
  sharesHeld: (8234 - i * 400).toLocaleString(),
  lockUpPeriod: [30, 60, 30, 60][i], shareBoost: ['4×', '2×', '15×', '1×'][i],
  owner: ['20%', '50%', '50%', '30%'][i], canRedeem: i % 2 === 0,
}))

const SECONDARY_MOCK = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  projectId: 980023470 + i,
  projectTitle: 'Opensea House',
  baseAsset: `RWAT${200000 + i * 13457}`,
  symbol: `RWAT-SEC-${String(i + 1).padStart(2, '0')}/USDT`,
  projectToken: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f45b0',
  status: 'active',
  totalSupply: 500063, tokenizedValue: 500063, estimatedAPY: '20%',
  useOfProceeds: 'Construction Funds',
  circulatingSupply: '200,000.00', marketCap: '$893,233.456.0046',
  currentPrice: '3400.5038', currentHolders: '45000', share: '23%',
}))

function formatNum(v, d = 2) {
  if (v == null || v === '') return '—'
  const n = Number(v)
  return isNaN(n) ? '—' : n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })
}

function StatusBadge({ status }) {
  const isLive = status === 'ICO live'
  return (
    <span
      className="inline-block px-2.5 rounded-full text-[11px] font-medium border"
      style={{
        lineHeight: '20px',
        ...(isLive
          ? { background: 'rgba(0,172,152,0.15)', color: '#00AC98', borderColor: '#00AC98' }
          : { background: 'rgba(128,141,154,0.15)', color: '#6B7280', borderColor: '#59636E' })
      }}
    >
      {status ?? '—'}
    </span>
  )
}

const fmt = (v) => v != null ? Number(v).toLocaleString() : '—'

/* ─── Primary Market Tab ─── */
function PrimaryTab({ viewMode }) {
  const [items, setItems] = useState(PRESALE_MOCK)
  const [activeCategory, setActiveCategory] = useState('All')
  const { scrollRef, stickyStyle } = useTableScrollShadow(items)
  const handleDelete = (id) => setItems(prev => prev.filter(item => (item.id ?? item.projectId) !== id))

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-4 pt-4">
        <CategoryFilter value={activeCategory} onChange={setActiveCategory} />
      </div>

      {viewMode === 'list' ? (
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TH>Property ID</TH>
                <TH>Symbol</TH>
                <TH>Asset Name</TH>
                <TH style={{ minWidth: '155px' }}>ICO Status</TH>
                <TH>Total Supply (RWAT)</TH>
                <TH>Tokenized Value (USDT)</TH>
                <TH>Projected APY</TH>
                <TH>Presale Supply (RWAT)</TH>
                <TH>Issue Price (USD/RWAT)</TH>
                <TH>Use of Proceeds</TH>
                <TH>Start Date</TH>
                <TH>End Date</TH>
                <TH style={stickyStyle('#F8FAFC')}>Action</TH>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-50 transition-colors duration-100">
                  <TD><span className="text-[#00032A] font-mono text-[12px]">{row.projectId ?? '—'}</span></TD>
                  <TD><SymbolBadge text={row.baseAsset} /></TD>
                  <TD><span className="font-medium text-[#00032A]">{row.projectTitle ?? '—'}</span></TD>
                  <TD><StatusBadge status={row.icoStatus} /></TD>
                  <TD><div className="font-medium text-[#00032A]">{fmt(row.totalSupply)}</div><div className="text-xs text-slate-400 mt-0.5">≈$35.1</div></TD>
                  <TD><div className="font-medium text-[#00032A]">{row.tokenizedValue ? `$${fmt(row.tokenizedValue)}` : '—'}</div><div className="text-xs text-slate-400 mt-0.5">≈$35.1</div></TD>
                  <TD><span className="font-semibold text-[#FF521D]">{row.projectedAPY ?? '—'}</span></TD>
                  <TD><div className="font-medium text-[#00032A]">{fmt(row.presaleSupply)}</div><div className="text-xs text-slate-400 mt-0.5">≈$35.1</div></TD>
                  <TD><span className="font-medium text-[#00032A]">{row.issuePrice ?? '—'}</span></TD>
                  <TD><span className="text-slate-700 whitespace-nowrap">{row.useOfProceeds ?? '—'}</span></TD>
                  <TD><span className="text-slate-500 whitespace-nowrap">{row.startDate ?? '—'}</span></TD>
                  <TD><span className="text-slate-500 whitespace-nowrap">{row.endDate ?? '—'}</span></TD>
                  <TD style={stickyStyle('#ffffff')}>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={row.status !== 'live'}
                        className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] rounded-md border-none text-white"
                        style={{ background: row.status === 'live' ? 'linear-gradient(90deg,#3D81BC,#096CC0)' : '#CBD5E1', cursor: row.status === 'live' ? 'pointer' : 'not-allowed' }}
                      >Subscribe</button>
                      <button
                        onClick={() => handleDelete(row.id ?? row.projectId)}
                        className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] bg-white border border-red-200 rounded-md text-red-500 cursor-pointer hover:border-red-400 hover:bg-red-50"
                      >Remove</button>
                    </div>
                  </TD>
                </tr>
              ))}
              {items.length === 0 && <TableEmptyRow colSpan={13} message="No collected items." />}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => <PresaleCard key={item.id} item={item} onDelete={handleDelete} hideCollect />)}
          {items.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400 text-sm">No collected items.</div>}
        </div>
      )}
      {items.length > 0 && <Pagination pageIndex={1} pageSize={10} total={items.length} onPageChange={() => {}} />}
    </div>
  )
}

/* ─── Secondary Market Tab ─── */
function SecondaryTab({ viewMode }) {
  const [items, setItems] = useState(SECONDARY_MOCK)
  const [activeCategory, setActiveCategory] = useState('All')
  const { scrollRef, stickyStyle } = useTableScrollShadow(items)
  const handleDelete = (id) => setItems(prev => prev.filter(item => (item.id ?? item.projectId) !== id))

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap mb-4 pt-4">
        <CategoryFilter value={activeCategory} onChange={setActiveCategory} />
      </div>

      {viewMode === 'list' ? (
        <div className="overflow-x-auto" ref={scrollRef}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TH>Property ID</TH>
                <TH>Symbol</TH>
                <TH>Asset Name</TH>
                <TH>Total Supply(RWAT)</TH>
                <TH>Tokenized Value(USDT)</TH>
                <TH>Estimated APY</TH>
                <TH>Circulating Supply(RWAT)</TH>
                <TH><span className="flex items-center gap-1">Current Price(USDT/RWAT)<RefreshCw size={12} className="cursor-pointer hover:text-slate-700" /></span></TH>
                <TH>Market Cap</TH>
                <TH style={stickyStyle('#F8FAFC')}>Action</TH>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-50 transition-colors duration-100">
                  <TD><span className="text-[#00032A] font-mono text-[12px]">{row.projectId ?? '—'}</span></TD>
                  <TD><SymbolBadge text={row.baseAsset} /></TD>
                  <TD><span className="font-medium text-[#00032A]">{row.projectTitle ?? row.baseAsset ?? '—'}</span></TD>
                  <TD>{formatNum(row.totalSupply)}</TD>
                  <TD><span className="text-slate-700">{row.tokenizedValue ? `$${formatNum(row.tokenizedValue)}` : '—'}</span></TD>
                  <TD><span className="text-[#00AC98] font-semibold">{row.estimatedAPY ?? '—'}</span></TD>
                  <TD>{formatNum(row.circulatingSupply)}</TD>
                  <TD><span className="text-[#00AC98] font-semibold">{row.currentPrice ? `$${row.currentPrice}` : '—'}</span></TD>
                  <TD><span className="text-[#00AC98]">{row.marketCap ?? '—'}</span></TD>
                  <TD style={stickyStyle('#ffffff')}>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] rounded-md border-none cursor-pointer text-white hover:opacity-90"
                        style={{ background: 'linear-gradient(90deg,#3D81BC,#096CC0)' }}
                      >Trade</button>
                      <button
                        onClick={() => handleDelete(row.id ?? row.projectId)}
                        className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] bg-white border border-red-200 rounded-md text-red-500 cursor-pointer hover:border-red-400 hover:bg-red-50"
                      >Remove</button>
                    </div>
                  </TD>
                </tr>
              ))}
              {items.length === 0 && <TableEmptyRow colSpan={10} message="No collected items." />}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {items.map((item) => <PropertyCard key={item.id} item={item} onDelete={handleDelete} hideCollect />)}
          {items.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400 text-sm">No collected items.</div>}
        </div>
      )}
      {items.length > 0 && <Pagination pageIndex={1} pageSize={10} total={items.length} onPageChange={() => {}} />}
    </div>
  )
}

/* ─── 主页面 ─── */
const TABS = [
  { key: 'primary',   label: 'Primary Market'   },
  { key: 'secondary', label: 'Secondary Market' },
]

export default function MyCollection() {
  const [activeTab, setActiveTab] = useState('primary')
  const [viewMode, setViewMode] = useState('list')
  const [keyword, setKeyword] = useState('')

  return (
    <div style={{ padding: '0' }}>
      {/* 顶部：标题 + 搜索 + 视图切换 */}
      <div className="bg-white flex items-center justify-between px-0 py-4">
        <h2 className="m-0 font-bold font-[Manrope,sans-serif] text-slate-900" style={{ fontSize: '22px' }}>
          My Collection
        </h2>
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden transition-colors focus-within:border-[#0D6EC0]"
            style={{ height: '38px', width: '380px' }}
          >
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Enter property ID, token name, contract address"
              className="flex-1 h-full px-3 text-[13px] text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-400"
            />
            <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db', flexShrink: 0 }} />
            <button className="flex items-center justify-center px-3 h-full border-none bg-transparent cursor-pointer text-slate-400 hover:text-[#0D6EC0] transition-colors">
              <Search size={16} />
            </button>
          </div>
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="w-full bg-white" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center">
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="cursor-pointer bg-transparent border-none"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '14px 20px',
                  borderBottom: isActive ? '3px solid #0D6EC0' : '3px solid transparent',
                  transition: 'all 150ms',
                  color: isActive ? '#0D6EC0' : '#64748b',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon icon={key === 'primary' ? 'mdi:home-clock-outline' : 'ix:linechart'} width={16} height={16} />
                <span style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Manrope, sans-serif' }}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 内容 */}
      <div className="bg-white overflow-hidden">
        {activeTab === 'primary'
          ? <PrimaryTab viewMode={viewMode} />
          : <SecondaryTab viewMode={viewMode} />
        }
      </div>
    </div>
  )
}

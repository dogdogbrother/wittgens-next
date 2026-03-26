import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader2, ChevronDown, RefreshCw, LayoutList, LayoutGrid } from 'lucide-react'
import { Icon } from '@iconify/react'
import { cn } from '../../../../lib/utils'
import MarketTableHeader from '../../components/MarketTableHeader'

/* ─────────────── 工具函数 ─────────────── */
function formatNum(val, decimals = 2) {
  if (val == null || val === '' || val === '--') return '—'
  const n = Number(val)
  if (isNaN(n)) return '—'
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/* ─────────────── 分类筛选栏 ─────────────── */
const CATEGORIES = ['All', 'Retail', 'Office', 'Tourism & Hospitality', 'Industrial & Logistics', 'Mixed-Use']

const SORT_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'hot', label: 'Hot' },
  { value: 'top-volume', label: 'Top Volume' },
]

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = SORT_OPTIONS.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-[5px] text-sm font-medium text-[#59636E] border border-[#DFE2E8] rounded-md bg-white hover:bg-[#F1F4F8] transition-colors"
      >
        {current?.label ?? 'New'}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden min-w-[130px]">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={cn(
                'block w-full px-4 py-2 text-left text-[13px] font-[Inter,sans-serif] border-none cursor-pointer transition-colors hover:bg-slate-50',
                value === opt.value ? 'text-[#0D6EC0] font-semibold bg-blue-50' : 'text-slate-700 bg-white'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────── Symbol Badge ─────────────── */
function SymbolBadge({ text }) {
  if (!text) return <span className="text-slate-400">—</span>
  return (
    <span
      className="inline-block px-2 py-0.5 text-[11px] font-semibold font-[Inter,sans-serif] rounded whitespace-nowrap"
      style={{ background: '#E8F1FA', color: '#1565C0' }}
    >
      {text}
    </span>
  )
}

/* ─────────────── 分页 ─────────────── */
function Pagination({ pageIndex, pageSize, total, onPageChange }) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const start = Math.max(1, pageIndex - 2)
  const end = Math.min(totalPages, start + 4)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex justify-center items-center gap-1 py-5">
      <button
        onClick={() => onPageChange(pageIndex - 1)}
        disabled={pageIndex <= 1}
        className={cn(
          'w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white',
          pageIndex <= 1 ? 'cursor-not-allowed text-slate-300' : 'cursor-pointer text-slate-500 hover:border-[#0D6EC0]'
        )}
      >
        <ChevronLeft size={15} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'w-8 h-8 flex items-center justify-center border rounded-md text-[13px] font-[Inter,sans-serif] cursor-pointer',
            pageIndex === p
              ? 'border-[#0D6EC0] bg-[#0D6EC0] text-white font-semibold'
              : 'border-slate-200 bg-white text-slate-500 hover:border-[#0D6EC0]'
          )}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="text-slate-400 text-[13px]">...</span>}
      <button
        onClick={() => onPageChange(pageIndex + 1)}
        disabled={pageIndex >= totalPages}
        className={cn(
          'w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white',
          pageIndex >= totalPages ? 'cursor-not-allowed text-slate-300' : 'cursor-pointer text-slate-500 hover:border-[#0D6EC0]'
        )}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

/* ─────────────── 表头/单元格 ─────────────── */
const TH = ({ children, className, green }) => (
  <th
    className={cn(
      'px-3.5 py-3 text-left text-[11px] font-bold font-[Inter,sans-serif] tracking-wide uppercase border-b border-slate-200 bg-slate-50 whitespace-nowrap',
      green ? 'text-[#00AC98]' : 'text-slate-500',
      className
    )}
  >
    {children}
  </th>
)

const TD = ({ children, className }) => (
  <td
    className={cn(
      'px-3.5 py-3 text-[13px] font-[Inter,sans-serif] text-slate-800 border-b border-slate-100 align-middle',
      className
    )}
  >
    {children}
  </td>
)

/* ─────────────── 网格卡片（Grid View） ─────────────── */
function PropertyCard({ item }) {
  return (
    <div
      className="p-px rounded-lg"
      style={{
        background: 'linear-gradient(180deg, rgba(155,195,229,1) 0%, rgba(213,232,248,1) 50%, rgba(233,236,237,1) 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div className="bg-white rounded-lg p-4">
        {/* 图片占位 */}
        <div
          className="w-full rounded-md mb-3 overflow-hidden flex items-center justify-center"
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #E8F1FA 0%, #C8DFF5 100%)',
          }}
        >
          <span className="text-3xl">🏢</span>
        </div>
        {/* 标题 */}
        <div className="mb-2">
          <SymbolBadge text={item.baseAsset} />
        </div>
        <p className="text-[13px] font-semibold text-slate-800 mb-1 truncate">{item.projectTitle || item.symbol || '—'}</p>
        <p className="text-[11px] text-slate-400 mb-3">ID: {item.projectId ?? '—'}</p>
        {/* 数据行 */}
        <div className="grid grid-cols-2 gap-y-1 mb-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Estimated APY</p>
            <p className="text-[13px] font-semibold text-[#00AC98]">{item.estimatedAPY ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Current Price</p>
            <p className="text-[13px] font-semibold text-[#00AC98]">{item.currentPrice ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total Supply</p>
            <p className="text-[13px] text-slate-700">{formatNum(item.totalSupply)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Market Cap</p>
            <p className="text-[13px] text-slate-700">{item.marketCap ?? '—'}</p>
          </div>
        </div>
        {/* 按钮 */}
        <div className="flex gap-2">
          <button
            className="flex-1 h-[40px] text-white text-[13px] font-semibold rounded-lg transition-opacity hover:opacity-90 cursor-pointer border-none"
            style={{ background: 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)' }}
          >
            Trade
          </button>
          <button className="w-[40px] h-[40px] border border-[#0A6DC0] bg-[#D8E6F2] rounded-lg flex items-center justify-center text-[#0A6DC0] hover:opacity-80 transition-opacity cursor-pointer">
            ★
          </button>
        </div>
        <div className="flex justify-center mt-2">
          <button className="text-[12px] text-slate-400 hover:underline transition-all cursor-pointer">Details</button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── 主组件 ─────────────── */
export default function OpenMarketTable({
  data,
  total,
  loading,
  keyword,
  setKeyword,
  handleSearch,
  pageIndex,
  setPageIndex,
  pageSize,
}) {
  const [viewMode, setViewMode] = useState('list')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('new')

  return (
    <div className="bg-white overflow-hidden mt-2">

      {/* 顶部 Header */}
      <MarketTableHeader
        title="Secondary Market"
        keyword={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
        loading={loading}
        actions={
          <div className="flex items-center border border-[#DFE2E8] rounded-lg bg-[#F1F4F8] overflow-hidden" style={{ height: '38px' }}>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={cn(
                'w-9 h-full flex items-center justify-center transition-colors rounded-md',
                viewMode === 'list' ? 'bg-white text-[#0D6EC0]' : 'text-[#8B9DB5] hover:text-[#0D6EC0]'
              )}
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={cn(
                'w-9 h-full flex items-center justify-center transition-colors rounded-md',
                viewMode === 'grid' ? 'bg-white text-[#0D6EC0]' : 'text-[#8B9DB5] hover:text-[#0D6EC0]'
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        }
      />

      {/* 筛选栏 */}
      <div className="flex items-center justify-between mb-4">
        {/* 分类 tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-3 py-1 text-[13px] font-semibold rounded transition-colors cursor-pointer border-none bg-[#EDF2F5]',
                activeCategory === cat
                  ? 'text-[#00032A]'
                  : 'text-[rgba(0,3,42,0.45)] hover:text-[#00032A]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* 右侧按钮 */}
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-4 text-[13px] font-medium text-[#174F80] border border-[#22537D] bg-[#F4F6F8] hover:bg-[#E8ECF0] rounded transition-colors cursor-pointer"
            style={{ height: '35px' }}
          >
            <Icon icon="icon-park-solid:collection-files" width={15} height={15} />
            My Collection
          </button>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* 内容区 */}
      {viewMode === 'list' ? (
        <div className="overflow-x-auto">
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
                <TH>
                  <span className="flex items-center gap-1">
                    Current Price(USDT/RWAT)
                    <RefreshCw size={12} className="cursor-pointer hover:text-slate-700 transition-colors" />
                  </span>
                </TH>
                <TH>Market Cap</TH>
                <TH className="text-right">Action</TH>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <Loader2 size={24} className="animate-spin inline-block text-[#0D6EC0]" />
                  </td>
                </tr>
              )}
              {!loading && (!data || data.length === 0) && (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-slate-400 text-sm font-[Inter,sans-serif]">
                    No records found.
                  </td>
                </tr>
              )}
              {!loading && data?.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="hover:bg-slate-50 transition-colors duration-100"
                >
                  <TD>
                    <span className="text-[#00032A] font-mono text-[12px]">{row.projectId ?? '—'}</span>
                  </TD>
                  <TD>
                    <SymbolBadge text={row.baseAsset} />
                  </TD>
                  <TD>
                    <SymbolBadge text={row.baseAsset} />
                  </TD>
                  <TD>{formatNum(row.totalSupply)}</TD>
                  <TD>
                    <span className="text-slate-700">{row.tokenizedValue ? `$${formatNum(row.tokenizedValue)}` : '—'}</span>
                  </TD>
                  <TD>
                    <span className="text-[#00AC98] font-semibold">{row.estimatedAPY ?? '—'}</span>
                  </TD>
                  <TD>{formatNum(row.circulatingSupply)}</TD>
                  <TD>
                    <span className="text-[#00AC98] font-semibold">{row.currentPrice ? `$${row.currentPrice}` : '—'}</span>
                  </TD>
                  <TD>
                    <span className="text-[#00AC98]">{row.marketCap ? `$${row.marketCap}` : '—'}</span>
                  </TD>
                  <TD className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="h-[22px] px-3 text-[12px] font-medium text-[#22537D] border border-[#22537D] rounded-full bg-white hover:bg-[#F4F8FC] transition-colors cursor-pointer">
                        Trade
                      </button>
                      <button className="h-[22px] px-3 text-[12px] font-medium text-[#22537D] border border-[#22537D] rounded-full bg-white hover:bg-[#F4F8FC] transition-colors cursor-pointer">
                        Details
                      </button>
                    </div>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* 网格视图 */
        <div>
          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 size={28} className="animate-spin text-[#0D6EC0]" />
            </div>
          )}
          {!loading && (!data || data.length === 0) && (
            <div className="text-center py-16 text-slate-400 text-sm font-[Inter,sans-serif]">
              No records found.
            </div>
          )}
          {!loading && data && data.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {data.map((item, i) => (
                <PropertyCard key={item.id ?? i} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 分页 */}
      {total > 0 && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          total={total}
          onPageChange={setPageIndex}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, RefreshCw } from 'lucide-react'
import { Icon } from '@iconify/react'
import MarketTableHeader from '../../components/MarketTableHeader'
import Pagination from '../../components/Pagination'
import SortDropdown from '../../components/SortDropdown'
import CategoryFilter from '../../components/CategoryFilter'
import ViewModeToggle from '../../components/ViewModeToggle'
import { TH, TD, SymbolBadge, TableLoadingRow, TableEmptyRow } from '../../components/TableCells'
import { useTableScrollShadow } from '../../components/useTableScrollShadow'
import PropertyCard from './PropertyCard'

const SORT_OPTIONS = [
  { value: 'new',        label: 'New'        },
  { value: 'hot',        label: 'Hot'        },
  { value: 'top-volume', label: 'Top Volume' },
]

function formatNum(val, decimals = 2) {
  if (val == null || val === '' || val === '--') return '—'
  const n = Number(val)
  if (isNaN(n)) return '—'
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function OpenMarketTable({
  data, total, loading,
  keyword, setKeyword, handleSearch,
  pageIndex, setPageIndex, pageSize,
}) {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('list')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('new')
  const { scrollRef, stickyStyle } = useTableScrollShadow(data)

  return (
    <div className="bg-white overflow-hidden mt-2">

      <MarketTableHeader
        title="Secondary Market"
        keyword={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
        loading={loading}
        actions={<ViewModeToggle value={viewMode} onChange={setViewMode} />}
      />

      {/* 筛选栏 */}
      <div className="flex items-center justify-between mb-4">
        <CategoryFilter value={activeCategory} onChange={setActiveCategory} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/collection')}
            className="flex items-center gap-1.5 px-4 text-[13px] font-medium text-[#174F80] border border-[#22537D] bg-[#F4F6F8] hover:bg-[#E8ECF0] rounded transition-colors cursor-pointer"
            style={{ height: '35px' }}
          >
            <Icon icon="icon-park-solid:collection-files" width={15} height={15} />
            My Collection
          </button>
          <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* 内容区 */}
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
                <TH>
                  <span className="flex items-center gap-1">
                    Current Price(USDT/RWAT)
                    <RefreshCw size={12} className="cursor-pointer hover:text-slate-700 transition-colors" />
                  </span>
                </TH>
                <TH>Market Cap</TH>
                <TH style={stickyStyle('#F8FAFC')}>Action</TH>
              </tr>
            </thead>
            <tbody>
              {loading && <TableLoadingRow colSpan={10} />}
              {!loading && (!data || data.length === 0) && <TableEmptyRow colSpan={10} />}
              {!loading && data?.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-50 transition-colors duration-100">
                  <TD><span className="text-[#00032A] font-mono text-[12px]">{row.projectId ?? '—'}</span></TD>
                  <TD><SymbolBadge text={row.baseAsset} /></TD>
                  <TD><span className="font-medium text-[#00032A]">{row.projectTitle ?? row.baseAsset ?? '—'}</span></TD>
                  <TD>{formatNum(row.totalSupply)}</TD>
                  <TD><span className="text-slate-700">{row.tokenizedValue ? `$${formatNum(row.tokenizedValue)}` : '—'}</span></TD>
                  <TD><span className="text-[#00AC98] font-semibold">{row.estimatedAPY ?? '—'}</span></TD>
                  <TD>{formatNum(row.circulatingSupply)}</TD>
                  <TD><span className="text-[#00AC98] font-semibold">{row.currentPrice ? `$${row.currentPrice}` : '—'}</span></TD>
                  <TD><span className="text-[#00AC98]">{row.marketCap ? `$${row.marketCap}` : '—'}</span></TD>
                  <TD style={stickyStyle('#ffffff')}>
                    <div className="flex items-center gap-1.5">
                      <button
                        className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] rounded-md border-none cursor-pointer text-white hover:opacity-90"
                        style={{ background: 'linear-gradient(90deg, #3D81BC, #096CC0)' }}
                      >
                        Trade
                      </button>
                      <button className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] bg-white border border-gray-300 rounded-md text-slate-800 cursor-pointer hover:border-[#0D6EC0]">
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
        <div>
          {loading && <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#0D6EC0]" /></div>}
          {!loading && (!data || data.length === 0) && <div className="text-center py-16 text-slate-400 text-sm">No records found.</div>}
          {!loading && data && data.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {data.map((item, i) => <PropertyCard key={item.id ?? i} item={item} />)}
            </div>
          )}
        </div>
      )}

      {total > 0 && (
        <Pagination pageIndex={pageIndex} pageSize={pageSize} total={total} onPageChange={setPageIndex} />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Icon } from '@iconify/react'
import MarketTableHeader from '../../components/MarketTableHeader'
import Pagination from '../../components/Pagination'
import SortDropdown from '../../components/SortDropdown'
import CategoryFilter from '../../components/CategoryFilter'
import ViewModeToggle from '../../components/ViewModeToggle'
import { TH, TD, SymbolBadge, TableLoadingRow, TableEmptyRow } from '../../components/TableCells'
import { useTableScrollShadow } from '../../components/useTableScrollShadow'
import PresaleCard from './PresaleCard'

const SORT_OPTIONS = [
  { value: 'new',        label: 'New'       },
  { value: 'hot',        label: 'Hot'       },
  { value: 'top-volume', label: 'Top Volume'},
  { value: 'ico-live',   label: 'ICO Live'  },
  { value: 'ico-ended',  label: 'ICO Ended' },
]

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
      {status}
    </span>
  )
}

const fmt = (v) => v != null ? Number(v).toLocaleString() : '—'

export default function PrimaryMarketTable({
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
        title="Primary Market"
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
                <TH style={{ minWidth: '140px' }}>ICO Status</TH>
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
              {loading && <TableLoadingRow colSpan={13} />}
              {!loading && (!data || data.length === 0) && <TableEmptyRow colSpan={13} />}
              {!loading && data?.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-50 transition-colors duration-100">
                  <TD><span className="text-[#00032A] font-mono text-[12px]">{row.projectId ?? '—'}</span></TD>
                  <TD><SymbolBadge text={row.baseAsset} /></TD>
                  <TD><span className="font-medium text-[#00032A]">{row.projectTitle ?? row.baseAsset ?? '—'}</span></TD>
                  <TD><StatusBadge status={row.icoStatus ?? 'ICO live'} /></TD>
                  <TD>
                    <div className="font-medium text-[#00032A]">{fmt(row.totalSupply)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">≈$35.1</div>
                  </TD>
                  <TD>
                    <div className="font-medium text-[#00032A]">{row.tokenizedValue ? `$${fmt(row.tokenizedValue)}` : '—'}</div>
                    <div className="text-xs text-slate-400 mt-0.5">≈$35.1</div>
                  </TD>
                  <TD><span className="font-semibold text-[#FF521D]">{row.projectedAPY ?? '—'}</span></TD>
                  <TD>
                    <div className="font-medium text-[#00032A]">{fmt(row.presaleSupply)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">≈$35.1</div>
                  </TD>
                  <TD><span className="font-medium text-[#00032A]">{row.issuePrice ?? '—'}</span></TD>
                  <TD><span className="text-slate-700 whitespace-nowrap">{row.useOfProceeds ?? '—'}</span></TD>
                  <TD><span className="text-slate-500 whitespace-nowrap">{row.startDate ?? '—'}</span></TD>
                  <TD><span className="text-slate-500 whitespace-nowrap">{row.endDate ?? '—'}</span></TD>
                  <TD style={stickyStyle('#ffffff')}>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={row.status !== 'live'}
                        className="h-[30px] px-2.5 text-[13px] font-[Inter,sans-serif] rounded-md border-none text-white"
                        style={{
                          background: row.status === 'live' ? 'linear-gradient(90deg,#3D81BC,#096CC0)' : '#CBD5E1',
                          cursor: row.status === 'live' ? 'pointer' : 'not-allowed',
                        }}
                      >
                        Subscribe
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
              {data.map((item, i) => <PresaleCard key={item.id ?? i} item={item} />)}
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

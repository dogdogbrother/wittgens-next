import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronDown, Loader2, FileText } from 'lucide-react'
import { cn } from '../../../../lib/utils'

function SearchBar({ value, onChange, onSearch, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }
  return (
    <div
      className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden transition-colors duration-150 focus-within:border-[#0D6EC0]"
      style={{ height: '38px', width: '380px' }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter property ID, token name, contract address"
        className="flex-1 h-full px-3 text-[13px] font-[Inter,sans-serif] text-slate-800 bg-transparent border-none outline-none placeholder:text-slate-400"
      />
      {/* 竖线分割 */}
      <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db', flexShrink: 0 }} />
      {/* 搜索按钮 */}
      <button
        onClick={onSearch}
        disabled={loading}
        className="flex items-center justify-center px-3 h-full border-none bg-transparent cursor-pointer text-slate-400 hover:text-[#0D6EC0] transition-colors duration-150 disabled:cursor-not-allowed"
      >
        {loading
          ? <Loader2 size={16} className="animate-spin text-[#0D6EC0]" />
          : <Search size={16} />
        }
      </button>
    </div>
  )
}

function ClaimBtn({ disabled }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 h-[30px] px-2.5 text-[13px] font-medium font-[Inter,sans-serif] border-none rounded-md',
          disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-[#0D6EC0] text-white cursor-pointer'
        )}
      >
        Claim
        <ChevronDown size={13} />
      </button>
      {open && (
        <div className="absolute top-[34px] left-0 z-50 bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden min-w-[130px]">
          {['Claim Tokens', 'Claim Earnings'].map((label) => (
            <button
              key={label}
              onClick={() => setOpen(false)}
              className="block w-full px-3.5 py-2 text-left text-[13px] font-[Inter,sans-serif] text-slate-800 bg-transparent border-none cursor-pointer hover:bg-slate-50"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RedeemBtn({ disabled }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'h-[30px] px-2.5 text-[13px] font-medium font-[Inter,sans-serif] bg-white border rounded-md transition-colors duration-150',
        disabled
          ? 'text-slate-400 border-slate-200 cursor-not-allowed'
          : 'text-slate-800 border-gray-300 cursor-pointer hover:border-[#0D6EC0]'
      )}
    >
      Redeem
    </button>
  )
}

function formatNum(val, decimals = 2) {
  return Number(val ?? 0).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function shortAddr(addr) {
  if (!addr) return '—'
  return addr.slice(0, 6) + '...'
}

function Pagination({ pageIndex, pageSize, total, onPageChange }) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)
  return (
    <div className="flex justify-center items-center gap-1 p-5">
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
      {totalPages > 5 && <span className="text-slate-400 text-[13px]">...</span>}
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

const TH = ({ children, className }) => (
  <th className={cn('px-3.5 py-2.5 text-left text-[11px] font-bold font-[Inter,sans-serif] text-slate-500 tracking-widest uppercase border-b border-slate-200 bg-slate-50 whitespace-nowrap', className)}>
    {children}
  </th>
)

const TD = ({ children, className }) => (
  <td className={cn('px-3.5 py-3.5 text-[13px] font-[Inter,sans-serif] text-slate-800 border-b border-slate-100 align-middle', className)}>
    {children}
  </td>
)

export default function InvestmentTable({ data, total, loading, keyword, setKeyword, handleSearch, pageIndex, setPageIndex, pageSize }) {
  return (
    <div className="bg-white overflow-hidden mt-2">

      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between py-4">
        <h3 className="m-0 text-base font-bold font-[Manrope,sans-serif] text-slate-900">
          My Investment
        </h3>
        <div className="flex items-center gap-2.5">
          <SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} loading={loading} />
          <button
            className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg cursor-pointer whitespace-nowrap hover:border-[#0D6EC0] transition-colors duration-150"
            style={{ height: '38px', padding: '0 16px', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#1e293b' }}
          >
            <FileText size={15} style={{ color: '#475569' }} />
            Claim details
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <TH>Symbol</TH>
              <TH>Asset Name</TH>
              <TH>Holdings (RWAT)</TH>
              <TH>Share</TH>
              <TH>Spent (USDT)</TH>
              <TH>Claim Earnings (BEAC)</TH>
              <TH>Redemption (USDT)</TH>
              <TH>Redemption Date</TH>
              <TH>Contract</TH>
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
                  No investment records found.
                </td>
              </tr>
            )}
            {!loading && data?.map((row, i) => (
              <tr
                key={row.projectId ?? i}
                className="hover:bg-slate-50 transition-colors duration-100"
              >
                <TD><span className="font-semibold">{row.symbol?.split('/')[0] ?? '—'}</span></TD>
                <TD>
                  <span className="text-[#0D6EC0] font-medium cursor-pointer hover:underline">
                    {row.assetName ?? '—'}
                  </span>
                </TD>
                <TD>{formatNum(row.sharesHeld)}</TD>
                <TD>
                  <span className="text-green-600 font-semibold">
                    {(Number(row.heldRatio ?? 0) * 100).toFixed(0)}%
                  </span>
                </TD>
                <TD>
                  <div>{formatNum(row.spent)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">≈${formatNum(row.spent / 1000, 1)}</div>
                </TD>
                <TD>
                  <div>{formatNum(row.claimableEarnings)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">≈${formatNum(row.claimableEarnings / 1000, 1)}</div>
                </TD>
                <TD>
                  <div>{formatNum(row.redemptionAmount)}</div>
                  <div className="text-xs text-slate-400 mt-0.5">≈${formatNum(row.redemptionAmount / 1000, 1)}</div>
                </TD>
                <TD className="text-slate-500 whitespace-nowrap">{row.redemptionAt ? row.redemptionAt.replace('T', ' ').slice(0, 19) : '—'}</TD>
                <TD>
                  <span
                    className="text-[#0D6EC0] cursor-pointer font-mono text-[13px] hover:underline"
                    title={row.contract}
                  >
                    {shortAddr(row.contract)}
                  </span>
                </TD>
                <TD className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <ClaimBtn disabled={!row.canClaimTokens && !row.canClaimEarnings} />
                    <RedeemBtn disabled={!row.canRedeem} />
                  </div>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 0 && <Pagination pageIndex={pageIndex} pageSize={pageSize} total={total} onPageChange={setPageIndex} />}
    </div>
  )
}

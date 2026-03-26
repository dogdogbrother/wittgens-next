import { ChevronDown, FileText } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '../../../../lib/utils'
import MarketTableHeader from '../../components/MarketTableHeader'
import Pagination from '../../components/Pagination'
import { TH, TD, TableLoadingRow, TableEmptyRow } from '../../components/TableCells'
import { useTableScrollShadow } from '../../components/useTableScrollShadow'

function ClaimBtn({ disabled }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          disabled={disabled}
          className={cn(
            'flex items-center gap-1 h-[30px] px-2.5 text-[13px] font-medium font-[Inter,sans-serif] border-none rounded-md outline-none',
            disabled
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-auto'
              : 'bg-[#0D6EC0] text-white cursor-pointer'
          )}
        >
          Claim
          <ChevronDown size={13} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden min-w-[130px]"
          style={{ zIndex: 9999 }}
        >
          {['Claim Tokens', 'Claim Earnings'].map((label) => (
            <DropdownMenu.Item
              key={label}
              className="px-3.5 py-2 text-[13px] font-[Inter,sans-serif] text-slate-800 cursor-pointer outline-none"
              style={{ display: 'block', border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
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

export default function InvestmentTable({ data, total, loading, keyword, setKeyword, handleSearch, pageIndex, setPageIndex, pageSize }) {
  const { scrollRef, stickyStyle } = useTableScrollShadow(data)

  return (
    <div className="bg-white overflow-hidden mt-2">

      <MarketTableHeader
        title="My Investment"
        keyword={keyword}
        onChange={setKeyword}
        onSearch={handleSearch}
        loading={loading}
        actions={
          <button
            className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg cursor-pointer whitespace-nowrap hover:border-[#0D6EC0] transition-colors duration-150"
            style={{ height: '38px', padding: '0 16px', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#1e293b' }}
          >
            <FileText size={15} style={{ color: '#475569' }} />
            Claim details
          </button>
        }
      />

      <div className="overflow-x-auto" ref={scrollRef}>
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
              <TH style={stickyStyle('#F8FAFC')}>Action</TH>
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoadingRow colSpan={10} />}
            {!loading && (!data || data.length === 0) && <TableEmptyRow colSpan={10} message="No investment records found." />}
            {!loading && data?.map((row, i) => (
              <tr key={row.projectId ?? i} className="hover:bg-slate-50 transition-colors duration-100">
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
                  <div
                    className="inline-flex items-center gap-2 px-3 rounded-md border border-[#C8DEFA] bg-white"
                    style={{ height: '30px', minWidth: '160px' }}
                  >
                    <span className="text-[#0D6EC0] font-mono text-[12px] cursor-pointer hover:underline flex-1" title={row.contract}>
                      {shortAddr(row.contract)}
                    </span>
                    <button
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none p-0 shrink-0"
                      title="Copy address"
                      onClick={() => row.contract && navigator.clipboard.writeText(row.contract)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    </button>
                    <button
                      className="text-slate-400 hover:text-[#0D6EC0] transition-colors cursor-pointer bg-transparent border-none p-0 shrink-0"
                      title="View on explorer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        <path d="M2 12h2M20 12h2"/>
                      </svg>
                    </button>
                  </div>
                </TD>
                <TD style={stickyStyle('#ffffff')}>
                  <div className="flex items-center gap-1.5">
                    <ClaimBtn disabled={false} />
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

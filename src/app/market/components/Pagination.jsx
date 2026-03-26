import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

/**
 * 通用分页组件。以当前页为中段，最多展示 5 个页码按钮，超出时末尾显示省略号。
 */
export default function Pagination({ pageIndex, pageSize, total, onPageChange }) {
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
          pageIndex <= 1
            ? 'cursor-not-allowed pointer-events-auto text-slate-300'
            : 'cursor-pointer text-slate-500 hover:border-[#0D6EC0]'
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
          pageIndex >= totalPages
            ? 'cursor-not-allowed pointer-events-auto text-slate-300'
            : 'cursor-pointer text-slate-500 hover:border-[#0D6EC0]'
        )}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

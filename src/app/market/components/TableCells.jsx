import { Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

/**
 * 统一的表头单元格。
 * @param {boolean} green - 是否使用绿色文字（用于价格类列头）
 */
export const TH = ({ children, className, green, style }) => (
  <th
    className={cn(
      'px-3.5 py-2.5 text-left text-[11px] font-bold font-[Inter,sans-serif] tracking-widest uppercase border-b border-slate-200 bg-slate-50 whitespace-nowrap',
      green ? 'text-[#00AC98]' : 'text-slate-500',
      className
    )}
    style={style}
  >
    {children}
  </th>
)

/**
 * 统一的表格数据单元格。
 */
export const TD = ({ children, className, style }) => (
  <td
    className={cn(
      'px-3.5 py-3 text-[13px] font-[Inter,sans-serif] text-slate-800 border-b border-slate-100 align-middle',
      className
    )}
    style={style}
  >
    {children}
  </td>
)

/**
 * 蓝色 Symbol 徽章，用于展示资产代码。
 */
export function SymbolBadge({ text }) {
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

/**
 * 表格 loading 行。
 */
export function TableLoadingRow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-16">
        <Loader2 size={24} className="animate-spin inline-block text-[#0D6EC0]" />
      </td>
    </tr>
  )
}

/**
 * 表格空数据行。
 */
export function TableEmptyRow({ colSpan, message = 'No records found.' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-16 text-slate-400 text-sm font-[Inter,sans-serif]">
        {message}
      </td>
    </tr>
  )
}

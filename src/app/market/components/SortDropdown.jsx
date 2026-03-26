import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/utils'

/**
 * 通用排序下拉组件。
 * @param {Array<{value:string, label:string}>} options - 排序选项
 * @param {string} value - 当前选中值
 * @param {function} onChange - 选中回调
 */
export default function SortDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const current = options.find((o) => o.value === value)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 text-[13px] font-medium text-[#59636E] border border-[#DFE2E8] rounded-md bg-white hover:bg-[#F1F4F8] transition-colors cursor-pointer"
        style={{ height: '35px' }}
      >
        {current?.label ?? options[0]?.label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden min-w-[140px]">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={cn(
                'block w-full px-4 py-2 text-left text-[13px] font-[Inter,sans-serif] border-none cursor-pointer hover:bg-slate-50',
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

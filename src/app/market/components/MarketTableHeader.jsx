import { Search, Loader2 } from 'lucide-react'

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
      <div style={{ width: '1px', height: '20px', backgroundColor: '#d1d5db', flexShrink: 0 }} />
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

/**
 * 通用市场表格顶部 Header
 * @param {string} title - 左侧标题
 * @param {string} keyword - 搜索关键词
 * @param {function} onChange - 输入变化
 * @param {function} onSearch - 触发搜索
 * @param {boolean} loading - 搜索加载中
 * @param {ReactNode} actions - 搜索框右侧额外操作区（可选）
 */
export default function MarketTableHeader({ title, keyword, onChange, onSearch, loading, actions }) {
  return (
    <div className="flex items-center justify-between py-4">
      <h3
        className="m-0 font-bold font-[Manrope,sans-serif] text-slate-900"
        style={{ fontSize: '22px' }}
      >
        {title}
      </h3>
      <div className="flex items-center gap-2.5">
        <SearchBar value={keyword} onChange={onChange} onSearch={onSearch} loading={loading} />
        {actions}
      </div>
    </div>
  )
}

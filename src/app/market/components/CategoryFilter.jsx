import { cn } from '../../../lib/utils'

export const MARKET_CATEGORIES = [
  'All',
  'Retail',
  'Office',
  'Tourism & Hospitality',
  'Industrial & Logistics',
  'Mixed-Use',
]

/**
 * 分类筛选胶囊按钮组。
 * @param {string[]} categories - 分类列表，默认使用 MARKET_CATEGORIES
 * @param {string} value - 当前选中分类
 * @param {function} onChange - 选中回调
 */
export default function CategoryFilter({ categories = MARKET_CATEGORIES, value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'px-3 py-1 text-[13px] font-semibold rounded transition-colors cursor-pointer border-none bg-[#EDF2F5]',
            value === cat ? 'text-[#00032A]' : 'text-[rgba(0,3,42,0.45)] hover:text-[#00032A]'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

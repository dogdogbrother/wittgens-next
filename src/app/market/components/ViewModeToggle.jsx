import { LayoutList, LayoutGrid } from 'lucide-react'
import { cn } from '../../../lib/utils'

/**
 * 列表 / 网格视图切换按钮组。
 * @param {'list'|'grid'} value - 当前视图模式
 * @param {function} onChange - 切换回调
 */
export default function ViewModeToggle({ value, onChange }) {
  return (
    <div
      className="flex items-center border border-[#DFE2E8] rounded-lg bg-[#F1F4F8] overflow-hidden"
      style={{ height: '38px' }}
    >
      <button
        onClick={() => onChange('list')}
        title="List View"
        className={cn(
          'w-9 h-full flex items-center justify-center transition-colors rounded-md',
          value === 'list' ? 'bg-white text-[#0D6EC0]' : 'text-[#8B9DB5] hover:text-[#0D6EC0]'
        )}
      >
        <LayoutList size={18} />
      </button>
      <button
        onClick={() => onChange('grid')}
        title="Grid View"
        className={cn(
          'w-9 h-full flex items-center justify-center transition-colors rounded-md',
          value === 'grid' ? 'bg-white text-[#0D6EC0]' : 'text-[#8B9DB5] hover:text-[#0D6EC0]'
        )}
      >
        <LayoutGrid size={18} />
      </button>
    </div>
  )
}

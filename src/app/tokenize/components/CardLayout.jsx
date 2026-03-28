import propertyIcon from '../../../assets/icon-svg/b-home.svg'
import { Icon } from '@iconify/react'

function CardLayout({ projectNo, buttons, onExpand }) {
  return (
    <div className="rounded-[2px] overflow-hidden mb-4">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-2"
        style={{ background: 'linear-gradient(90deg, #92C4EF 0%, #A3C2DD 100%)' }}
      >
        <div className="flex items-center gap-3">
          <img src={propertyIcon} alt="Property" className="w-7 h-7" />
          <span className="text-lg font-semibold text-gray-900">{projectNo}</span>
        </div>
        <div className="flex items-center gap-2">
          {buttons}
          <button
            onClick={onExpand}
            className="w-8 h-8 bg-[#22537D] text-white rounded flex items-center justify-center hover:bg-[#1a4160] transition-colors"
          >
            <Icon icon="mdi:chevron-down" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardLayout

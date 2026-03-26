/**
 * 虚线分隔行，用于卡片内的指标列表。
 * @param {string} label - 左侧标签
 * @param {string|number} value - 右侧主值
 * @param {string} subValue - 右侧副值（小字）
 * @param {boolean} last - 是否为最后一行（不显示底部虚线）
 */
export default function DashedRow({ label, value, subValue, last }) {
  return (
    <div className="flex items-center justify-between pb-2 pt-3 relative">
      <span className="text-[13px] text-[#7D7D7D]">{label}</span>
      <div className="flex flex-col items-end">
        <span className="text-[13px] font-semibold text-[#323232] leading-tight">{value}</span>
        {subValue && (
          <span className="text-[11px] text-[#888] leading-tight">{subValue}</span>
        )}
      </div>
      {!last && (
        <span
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, #E5EBF1 0, #E5EBF1 6px, transparent 6px, transparent 12px)',
          }}
        />
      )}
    </div>
  )
}

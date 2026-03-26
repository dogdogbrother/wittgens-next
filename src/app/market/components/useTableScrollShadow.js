import { useState, useEffect, useRef } from 'react'

/**
 * 监听横向滚动容器，判断右侧是否还有内容可以滚动。
 * 返回 scrollRef（绑到 overflow-x-auto 容器）和 stickyStyle（用于粘性右侧列）。
 * @param {any} dep - 依赖项，数据变化时重新计算（一般传 data）
 */
export function useTableScrollShadow(dep) {
  const [showShadow, setShowShadow] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el
      setShowShadow(scrollLeft + clientWidth < scrollWidth - 2)
    }
    update()
    el.addEventListener('scroll', update)
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [dep])

  const stickyStyle = (bg = '#F8FAFC') => ({
    position: 'sticky',
    right: 0,
    backgroundColor: bg,
    zIndex: 1,
    boxShadow: showShadow ? 'inset 4px 0 6px -2px rgba(0,0,0,0.08)' : 'none',
  })

  return { scrollRef, stickyStyle }
}

import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'

// 修复 Leaflet 默认 marker 图标路径问题
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DEFAULT_CENTER = [30.2741, 120.1551]

// 动态更新地图中心
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1 })
  }, [center, map])
  return null
}

export default function PropertyMap({ center, style }) {
  const position = center ? [center.lat, center.lng] : DEFAULT_CENTER

  return (
    <div style={{ position: 'relative', zIndex: 0, isolation: 'isolate', overflow: 'hidden', borderRadius: '6px', ...style }}>
    <MapContainer
      center={position}
      zoom={14}
      style={{ width: '100%', height: '100%', minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {center && <MapUpdater center={[center.lat, center.lng]} />}
    </MapContainer>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function BackButton({ label = 'back', to }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="flex items-center gap-1 pr-3 pl-1 py-1.5 rounded transition-colors duration-150 hover:bg-gray-100 cursor-pointer border-none bg-transparent"
      style={{ color: '#374151', fontSize: '15px' }}
    >
      <ChevronLeft size={20} />
      <span>{label}</span>
    </button>
  )
}

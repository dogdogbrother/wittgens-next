export function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div
      className="px-4 py-3 rounded-md flex items-center gap-3 mb-4"
      style={{ background: 'linear-gradient(90deg, #92C4EF 0%, #A3C2DD 100%)' }}
    >
      {Icon && <Icon size={22} style={{ color: '#1e3a5f' }} />}
      <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1e3a5f', fontFamily: 'Manrope, sans-serif' }}>
        {title}
      </h2>
      {description && (
        <span style={{ fontSize: '13px', color: '#4a6a8a', marginLeft: '8px' }}>{description}</span>
      )}
    </div>
  )
}

export default function SectionCard({ id, icon, title, description, children, className = '' }) {
  return (
    <div id={id} className={className}>
      <SectionHeader icon={icon} title={title} description={description} />
      {children}
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { FileText, Image, Gift } from 'lucide-react'
import { Icon } from '@iconify/react'
import BackButton from '../../components/BackButton'
import SectionCard from '../../components/SectionCard'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { countries, getCountryByPhonePrefix } from '../../utils/countries'

// 将 iconify icon name 包装成 React 组件，兼容 SectionCard（size prop）和 tabs
const iconify = (name) => {
  const Comp = ({ size, ...props }) => <Icon icon={name} width={size} height={size} {...props} />
  Comp.displayName = name
  return Comp
}

const TABS = [
  { id: 'issuer',            label: 'Issuer',            icon: iconify('material-symbols:deployed-code-account-outline') },
  { id: 'property',          label: 'Property',          icon: iconify('tabler:home-eco') },
  { id: 'mint-token',        label: 'Mint Token',        icon: iconify('ic:twotone-currency-bitcoin') },
  { id: 'property-document', label: 'Property Document', icon: FileText },
  { id: 'property-photos',   label: 'Property Photos',   icon: Image },
  { id: 'invitation-code',   label: 'Invitation code',   icon: Gift },
]

// header(78px) + tab nav(49px) + 间距(16px)
const STICKY_OFFSET = 143

function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

function FieldGroup({ label, required, error, children }) {
  return (
    <div className="space-y-1">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      <p className="text-red-500 text-xs min-h-[16px]">{error || '\u00A0'}</p>
    </div>
  )
}

function IssuerSection({ formData, onChange, errors }) {
  return (
    <SectionCard id="issuer" icon={TABS[0].icon} title="Issuer" className="mb-8">
      <div className="py-4">
        {/* Row 1: First name / Last name / Email / Phone */}
        <div className="grid grid-cols-4 gap-x-6">
          <FieldGroup label="First name" required error={errors.firstName}>
            <Input
              placeholder="Type your first name"
              value={formData.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              className={errors.firstName ? 'border-red-500' : ''}
            />
          </FieldGroup>

          <FieldGroup label="Last name" required error={errors.lastName}>
            <Input
              placeholder="Type your last name"
              value={formData.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              className={errors.lastName ? 'border-red-500' : ''}
            />
          </FieldGroup>

          <FieldGroup label="Email" required error={errors.email}>
            <Input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
          </FieldGroup>

          <FieldGroup label="Phone number" required error={errors.phoneNumber}>
            <div className="flex gap-2">
              <Select value={formData.phoneCountry} onValueChange={(v) => onChange('phoneCountry', v)}>
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue>
                    {(() => {
                      const c = getCountryByPhonePrefix(formData.phoneCountry)
                      return (
                        <div className="flex items-center gap-2">
                          {c && <Icon icon={c.flagIcon} className="w-5 h-4 shrink-0" />}
                          <span>{formData.phoneCountry}</span>
                        </div>
                      )
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.phonePrefix}>
                      <div className="flex items-center w-56">
                        <div className="flex items-center gap-2">
                          <Icon icon={c.flagIcon} className="w-5 h-4 shrink-0" />
                          <span>{c.name}</span>
                        </div>
                        <span className="ml-auto text-gray-500">{c.phonePrefix}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="1234567"
                value={formData.phoneNumber}
                onChange={(e) => onChange('phoneNumber', e.target.value)}
                className={`flex-1 ${errors.phoneNumber ? 'border-red-500' : ''}`}
              />
            </div>
          </FieldGroup>
        </div>

        {/* Row 2: Institution */}
        <div className="mt-0">
          <FieldGroup label="Institution">
            <Input
              placeholder="If the issuer is an institution, please fill in."
              value={formData.institution}
              onChange={(e) => onChange('institution', e.target.value)}
            />
          </FieldGroup>
        </div>
      </div>
    </SectionCard>
  )
}

function StubSection({ id, icon, title }) {
  return (
    <SectionCard id={id} icon={icon} title={title} className="mb-8">
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
        Coming soon...
      </div>
    </SectionCard>
  )
}

export default function TokenizationProperty() {
  const [activeTab, setActiveTab] = useState('issuer')
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    phoneCountry: '+1', phoneNumber: '', institution: '',
  })
  const [errors, setErrors] = useState({})
  const isScrollingByClick = useRef(false)
  const OFFSET = STICKY_OFFSET

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingByClick.current) return
      const scrollY = window.scrollY + OFFSET
      let current = TABS[0].id
      for (const { id } of TABS) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) current = id
      }
      setActiveTab(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleTabClick = (id) => {
    setActiveTab(id)
    isScrollingByClick.current = true
    scrollTo(id)
    setTimeout(() => { isScrollingByClick.current = false }, 800)
  }

  return (
    <div className="min-h-screen pb-16" style={{ padding: '0 24px 64px' }}>
      {/* Back button */}
      <div className="py-3">
        <BackButton />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-center mb-10 mt-2">
        Submit Application for Property Tokenization
      </h1>

      {/* Sticky tab nav */}
      <div
        className="sticky top-[78px] bg-white z-40 mb-6"
        style={{ borderBottom: '1px solid #e2e8f0' }}
      >
        <div className="flex items-center gap-0">
          {TABS.map(({ id, label, icon: TabIcon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => handleTabClick(id)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors duration-150 whitespace-nowrap"
                style={{
                  color: isActive ? '#0D6EC0' : '#64748b',
                  borderBottom: isActive ? '2px solid #0D6EC0' : '2px solid transparent',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <TabIcon size={15} />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sections */}
      <IssuerSection formData={formData} onChange={handleChange} errors={errors} />
      <StubSection id="property"          icon={TABS[1].icon} title="Property" />
      <StubSection id="mint-token"        icon={TABS[2].icon} title="Mint Token" />
      <StubSection id="property-document" icon={FileText} title="Property Document" />
      <StubSection id="property-photos"   icon={Image}    title="Property Photos" />
      <StubSection id="invitation-code"   icon={Gift}     title="Invitation code" />
    </div>
  )
}

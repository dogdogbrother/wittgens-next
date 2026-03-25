import { useState, useEffect, useRef } from 'react'
import { FileText, Image, Gift } from 'lucide-react'
import { Icon } from '@iconify/react'
import BackButton from '../../components/BackButton'
import SectionCard from '../../components/SectionCard'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { countries, getCountryByPhonePrefix } from '../../utils/countries'
import PropertySection from './components/PropertySection'
import { iconify } from './utils.jsx'

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

function MintTokenSection() {
  const [form, setForm] = useState({ tokenName: '', tokenSymbol: '', expectedSupply: '' })
  const set = (field, val) => setForm(p => ({ ...p, [field]: val }))

  return (
    <SectionCard id="mint-token" icon={TABS[2].icon} title="Mint Token" className="mb-8">
      <div className="py-4">
        <div className="grid grid-cols-3 gap-6">
          <FieldGroup label="Token name" required>
            <Input
              placeholder="RWAT-PRO-*"
              value={form.tokenName}
              onChange={e => set('tokenName', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Token Symbol" required>
            <Input
              placeholder="RWAT"
              value={form.tokenSymbol}
              onChange={e => set('tokenSymbol', e.target.value)}
            />
          </FieldGroup>
          <FieldGroup label="Expected Token Supply" required>
            <Input
              placeholder="10,00,000"
              value={form.expectedSupply}
              onChange={e => set('expectedSupply', e.target.value)}
            />
          </FieldGroup>
        </div>
      </div>
    </SectionCard>
  )
}

function PropertyDocumentSection() {
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type }))])
  }

  const handleDeleteFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <SectionCard id="property-document" icon={TABS[3].icon} title="Property Document" className="mb-8">
      <div className="pt-6 pb-4">
        <div className="flex gap-4 items-start">
          {/* 左侧：上传按钮 */}
          <div className="w-64 flex-shrink-0">
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 mb-4 transition-colors">
              <Icon icon="mdi:upload" width={20} height={20} />
              <span className="text-sm">Upload Files</span>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs" style={{ color: '#555C70' }}>
              Upload your property photos and legal documents.<br />
              Supported formats: PDF, JPEG, PNG
            </p>
          </div>

          <div className="self-stretch w-px bg-gray-200 mr-2 flex-shrink-0" />

          {/* 右侧：文件列表 */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="h-8 border border-[#D0E2EA] rounded p-3 flex items-center justify-between"
                style={{ background: 'rgba(221,243,254,0.48)' }}
              >
                <span className="text-sm text-[#00032A] truncate flex-1">{file.name}</span>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <button className="text-xs text-blue-600 underline hover:text-blue-800 bg-transparent border-none cursor-pointer">Preview</button>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="w-8 h-8 rounded flex items-center justify-center bg-transparent border-none cursor-pointer transition-colors"
                    style={{ color: '#E04141' }}
                  >
                    <Icon icon="mdi:trash-can-outline" width={20} height={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
      <PropertySection />
      <MintTokenSection />
      <PropertyDocumentSection />
      <StubSection id="property-photos"   icon={Image}    title="Property Photos" />
      <StubSection id="invitation-code"   icon={Gift}     title="Invitation code" />
    </div>
  )
}

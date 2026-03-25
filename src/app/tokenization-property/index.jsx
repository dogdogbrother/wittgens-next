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

function MintTokenSection({ form, onChange, errors = {} }) {
  return (
    <SectionCard id="mint-token" icon={TABS[2].icon} title="Mint Token" className="mb-8">
      <div className="py-4">
        <div className="grid grid-cols-3 gap-6">
          <FieldGroup label="Token name" required error={errors.tokenName}>
            <Input
              placeholder="RWAT-PRO-*"
              value={form.tokenName}
              onChange={e => onChange('tokenName', e.target.value)}
              className={errors.tokenName ? 'border-red-500' : ''}
            />
          </FieldGroup>
          <FieldGroup label="Token Symbol" required error={errors.tokenSymbol}>
            <Input
              placeholder="RWAT"
              value={form.tokenSymbol}
              onChange={e => onChange('tokenSymbol', e.target.value)}
              className={errors.tokenSymbol ? 'border-red-500' : ''}
            />
          </FieldGroup>
          <FieldGroup label="Expected Token Supply" required error={errors.expectedSupply}>
            <Input
              placeholder="10,00,000"
              value={form.expectedSupply}
              onChange={e => onChange('expectedSupply', e.target.value)}
              className={errors.expectedSupply ? 'border-red-500' : ''}
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

function PropertyPhotosSection() {
  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState(new Set())

  const handleUpload = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.map(f => ({ url: URL.createObjectURL(f), name: f.name }))
    setPhotos(prev => [...prev, ...newPhotos])
  }

  const toggleSelect = (index) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })
  }

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(new Set(photos.map((_, i) => i)))
    } else {
      setSelected(new Set())
    }
  }

  const handleDelete = () => {
    setPhotos(prev => prev.filter((_, i) => !selected.has(i)))
    setSelected(new Set())
  }

  const allSelected = photos.length > 0 && selected.size === photos.length

  return (
    <SectionCard id="property-photos" icon={TABS[4].icon} title="Property Photos" className="mb-8">
      <div className="pt-4 pb-4">
        {/* 操作栏 */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: '#555C70' }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 cursor-pointer"
            />
            Select All
          </label>
          {selected.size > 0 && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-sm border-none bg-transparent cursor-pointer transition-colors"
              style={{ color: '#E04141' }}
            >
              <Icon icon="mdi:trash-can-outline" width={18} height={18} />
              Delete
            </button>
          )}
        </div>

        {/* 图片网格 */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
          {/* 上传格 */}
          <label
            className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0D6EC0] hover:bg-blue-50 transition-colors"
            style={{ aspectRatio: '1', padding: '12px' }}
          >
            <Icon icon="mdi:upload" width={28} height={28} style={{ color: '#94a3b8' }} />
            <span className="text-xs text-center leading-tight" style={{ color: '#94a3b8' }}>
              Upload your property photos. Supported formats include PDF, JPEG, PNG
            </span>
            <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf" onChange={handleUpload} className="hidden" />
          </label>

          {/* 已上传图片 */}
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden cursor-pointer"
              style={{
                aspectRatio: '1',
                border: selected.has(index) ? '2px solid #0D6EC0' : '2px solid transparent',
                boxSizing: 'border-box',
              }}
              onClick={() => toggleSelect(index)}
            >
              <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
              <div
                className="absolute top-1.5 left-1.5"
                onClick={e => { e.stopPropagation(); toggleSelect(index) }}
              >
                <input
                  type="checkbox"
                  checked={selected.has(index)}
                  onChange={() => toggleSelect(index)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

function InvitationCodeSection({ value, onChange }) {
  return (
    <SectionCard id="invitation-code" icon={TABS[5].icon} title="Invitation code" className="mb-8">
      <div className="py-4">
        <Input
          placeholder="If you have an invitation code, please type it here"
          value={value}
          onChange={e => onChange('invitationCode', e.target.value)}
        />
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

const INITIAL_FORM = {
  // Issuer
  firstName: '', lastName: '', email: '', phoneCountry: '+1', phoneNumber: '', institution: '',
  // Property
  country: 'CH', streetAddress: '', apt: '', city: '', province: '', postalCode: '',
  lifecycleStage: 'existing', propertySize: '', propertySizeUnit: 'ft²', propertyAge: '',
  commercialType: 'retail', useOfProceeds: 'construction_funds', tokenizationOptions: 'for_sale', expectedValuation: '', description: '',
  // Mint Token
  tokenName: '', tokenSymbol: '', expectedSupply: '',
  // Invitation
  invitationCode: '',
}

function validate(form) {
  const e = {}
  // Issuer
  if (!form.firstName.trim())  e.firstName  = 'First name is required'
  if (!form.lastName.trim())   e.lastName   = 'Last name is required'
  if (!form.email.trim())      e.email      = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format'
  if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required'
  // Property
  if (!form.streetAddress.trim())  e.streetAddress  = 'Street address is required'
  if (!form.city.trim())           e.city           = 'City is required'
  if (!form.lifecycleStage)        e.lifecycleStage = 'Lifecycle stage is required'
  if (!form.propertySize.trim())   e.propertySize   = 'Property size is required'
  if (!form.propertyAge.trim())    e.propertyAge    = 'Property age is required'
  if (!form.commercialType)        e.commercialType = 'Commercial type is required'
  if (!form.useOfProceeds)         e.useOfProceeds  = 'Use of proceeds is required'
  if (!form.tokenizationOptions)   e.tokenizationOptions = 'Tokenization options is required'
  if (!form.expectedValuation.trim()) e.expectedValuation = 'Expected valuation is required'
  // Mint Token
  if (!form.tokenName.trim())     e.tokenName     = 'Token name is required'
  if (!form.tokenSymbol.trim())   e.tokenSymbol   = 'Token symbol is required'
  if (!form.expectedSupply.trim()) e.expectedSupply = 'Expected token supply is required'
  return e
}

export default function TokenizationProperty() {
  const [activeTab, setActiveTab] = useState('issuer')
  const [formData, setFormData] = useState(INITIAL_FORM)
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

  const handleClear = () => {
    setFormData(INITIAL_FORM)
    setErrors({})
  }

  const handleSubmit = () => {
    const errs = validate(formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      // 滚动到第一个出错的 section
      const sectionOrder = ['issuer', 'property', 'mint-token']
      const issuerFields = ['firstName', 'lastName', 'email', 'phoneNumber']
      const propertyFields = ['streetAddress', 'city', 'lifecycleStage', 'propertySize', 'propertyAge', 'commercialType', 'useOfProceeds', 'tokenizationOptions', 'expectedValuation']
      const mintFields = ['tokenName', 'tokenSymbol', 'expectedSupply']
      const fieldSection = { ...Object.fromEntries(issuerFields.map(f => [f, 'issuer'])), ...Object.fromEntries(propertyFields.map(f => [f, 'property'])), ...Object.fromEntries(mintFields.map(f => [f, 'mint-token'])) }
      const firstErrField = Object.keys(errs)[0]
      const targetSection = fieldSection[firstErrField]
      if (targetSection) {
        setActiveTab(targetSection)
        isScrollingByClick.current = true
        scrollTo(targetSection)
        setTimeout(() => { isScrollingByClick.current = false }, 800)
      }
      return
    }
    console.log('Submit:', formData)
    alert('Submitted successfully!')
  }

  return (
    <div className="min-h-screen pb-16" style={{ padding: '0 24px 64px' }}>
      <div className="py-3">
        <BackButton />
      </div>

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
      <PropertySection form={formData} onChange={handleChange} errors={errors} />
      <MintTokenSection form={formData} onChange={handleChange} errors={errors} />
      <PropertyDocumentSection />
      <PropertyPhotosSection />
      <InvitationCodeSection value={formData.invitationCode} onChange={handleChange} />

      {/* 底部按钮 */}
      <div className="flex justify-end gap-4 pt-2 pb-4">
        <button
          onClick={handleClear}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(90deg, #9BAFC0 0%, #7EA3BE 100%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg, #BBC7D2 0%, #9BBAD4 100%)'}
          style={{
            width: '180px', height: '44px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(90deg, #BBC7D2 0%, #9BBAD4 100%)',
            color: '#fff', fontSize: '16px', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'background 150ms',
          }}
        >
          Clear
        </button>
        <button
          onClick={handleSubmit}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1465AA 0%, #005298 100%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)'}
          style={{
            width: '180px', height: '44px', borderRadius: '8px', border: 'none',
            background: 'linear-gradient(90deg, #3D81BC 0%, #096CC0 100%)',
            color: '#fff', fontSize: '16px', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'background 150ms',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

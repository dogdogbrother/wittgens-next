import { useState } from 'react'
import { Icon } from '@iconify/react'
import SectionCard from '../../../components/SectionCard'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { countries, getCountryByName } from '../../../utils/countries'
import PropertyMap from './PropertyMap'
import { iconify } from '../utils.jsx'

// 通用 field 包装
function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
}

// 单选按钮组
function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex items-center gap-3 flex-wrap mt-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer text-sm" style={{ color: '#555C70' }}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ accentColor: '#0D6EC0', width: '15px', height: '15px' }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

const PropertyIcon = iconify('tabler:home-eco')

export default function PropertySection() {
  const [mapOnTop, setMapOnTop] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)
  const [geocoding, setGeocoding] = useState(false)
  const [form, setForm] = useState({
    country: 'Switzerland',
    streetAddress: '',
    apt: '',
    city: '',
    province: '',
    postalCode: '',
    lifecycleStage: '',
    propertySize: '',
    propertySizeUnit: 'ft²',
    propertyAge: '',
    commercialType: '',
    useOfProceeds: '',
    tokenizationOptions: '',
    expectedValuation: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }))

  // 用 Nominatim (OpenStreetMap) 免费 geocoding
  const geocodeAddress = async () => {
    const addr = [form.streetAddress, form.city, form.province, form.country].filter(Boolean).join(', ')
    if (!addr) return
    setGeocoding(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`)
      const data = await res.json()
      if (data[0]) setMapCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) })
    } catch (_) {}
    finally { setGeocoding(false) }
  }

  const EnterAddressBtn = (
    <button
      onClick={() => { setMapOnTop(v => !v); geocodeAddress() }}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D6EC0] transition-colors duration-150 cursor-pointer border-none bg-transparent mb-4"
    >
      <Icon icon="mdi:map-marker-outline" width={18} height={18} />
      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Enter address</span>
    </button>
  )

  const MapBlock = (
    <PropertyMap
      center={mapCenter}
      style={{ height: mapOnTop ? '360px' : '360px', minHeight: '300px' }}
    />
  )

  // 地址字段（左绿框内容）
  const AddressBlock = (
    <div className="space-y-4">
      {EnterAddressBtn}

      {/* Row 1: Country / Street address */}
      <div className="grid grid-cols-2 gap-6">
        <Field label="Country/Region" required>
          <Select value={form.country} onValueChange={(v) => set('country', v)}>
            <SelectTrigger>
              <SelectValue>
                {(() => {
                  const c = getCountryByName(form.country)
                  return (
                    <div className="flex items-center gap-2">
                      {c && <Icon icon={c.flagIcon} className="w-5 h-4 shrink-0" />}
                      <span>{form.country}</span>
                    </div>
                  )
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.name}>
                  <div className="flex items-center gap-2">
                    <Icon icon={c.flagIcon} className="w-5 h-4 shrink-0" />
                    <span>{c.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Street address" required>
          <Input placeholder="Hauptstraße 25" value={form.streetAddress} onChange={e => set('streetAddress', e.target.value)} onBlur={geocodeAddress} />
        </Field>
      </div>

      {/* Row 2: Apt / City */}
      <div className="grid grid-cols-2 gap-6">
        <Field label="Apt, floor, bldg (if applicable)">
          <Input placeholder="5" value={form.apt} onChange={e => set('apt', e.target.value)} />
        </Field>
        <Field label="City/town/village" required>
          <Input placeholder="Aarau" value={form.city} onChange={e => set('city', e.target.value)} onBlur={geocodeAddress} />
        </Field>
      </div>

      {/* Row 3: Province / Postal code */}
      <div className="grid grid-cols-2 gap-6">
        <Field label="Province/state/territory (if applicable)">
          <Input placeholder="Aargau" value={form.province} onChange={e => set('province', e.target.value)} />
        </Field>
        <Field label="Postal code (if applicable)">
          <Input placeholder="5000" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} />
        </Field>
      </div>
    </div>
  )

  // 其余字段（红框下方全宽）
  const ExtraBlock = (
    <div className="space-y-4 mt-6">
      {/* Row 4: 左半(Lifecycle/Size/Age) + 右半(Commercial Type) */}
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0 flex gap-4 justify-between">
          <Field label="Lifecycle Stage" required>
            <RadioGroup
              name="lifecycleStage"
              value={form.lifecycleStage}
              onChange={v => set('lifecycleStage', v)}
              options={[
                { value: 'existing', label: 'Existing' },
                { value: 'under-construction', label: 'Under construction' },
              ]}
            />
          </Field>
          <Field label="Property Size" required>
            <div className="flex gap-2">
              <Input placeholder="0" value={form.propertySize} onChange={e => set('propertySize', e.target.value)} className="w-20" />
              <Select value={form.propertySizeUnit} onValueChange={v => set('propertySizeUnit', v)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ft²">ft²</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Field>
          <Field label="Property Age" required>
            <div className="flex items-center gap-2">
              <Input placeholder="0" value={form.propertyAge} onChange={e => set('propertyAge', e.target.value)} className="w-20" />
              <span className="text-sm text-gray-600 whitespace-nowrap">Years</span>
            </div>
          </Field>
        </div>
        <div className="flex-1 min-w-0">
          <Field label="Commercial Type" required>
            <RadioGroup
              name="commercialType"
              value={form.commercialType}
              onChange={v => set('commercialType', v)}
              options={[
                { value: 'retail', label: 'Retail' },
                { value: 'office', label: 'Office' },
                { value: 'tourism', label: 'Tourism & Hospitality' },
                { value: 'industrial', label: 'Industrial & Logistics' },
                { value: 'mixed', label: 'Mixed-Use' },
              ]}
            />
          </Field>
        </div>
      </div>

      {/* Row 5: Use of Proceeds / Tokenization Options */}
      <div className="flex gap-8 items-start">
        <Field label="Use of Proceeds" required>
          <RadioGroup
            name="useOfProceeds"
            value={form.useOfProceeds}
            onChange={v => set('useOfProceeds', v)}
            options={[
              { value: 'construction', label: 'Construction Funds' },
              { value: 'infrastructure', label: 'Infrastructure Fundraising' },
              { value: 'business', label: 'Fundraising for business expansion' },
              { value: 'new-project', label: 'Fundraising for New Project' },
            ]}
          />
        </Field>
        <Field label="Property Tokenization Options" required>
          <RadioGroup
            name="tokenizationOptions"
            value={form.tokenizationOptions}
            onChange={v => set('tokenizationOptions', v)}
            options={[
              { value: 'sale', label: 'For Sale' },
              { value: 'rent', label: 'For Rent' },
              { value: 'both', label: 'For Both' },
            ]}
          />
        </Field>
      </div>

      {/* Row 6: Expected Valuation */}
      <Field label="Expected Valuation(USD)" required>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <Input
            placeholder="Enter your estimated value, priced in USD"
            value={form.expectedValuation}
            onChange={e => set('expectedValuation', e.target.value)}
            className="pl-7"
          />
        </div>
      </Field>

      {/* Row 7: Description */}
      <Field label="Property Description  (Available in your preferred language)">
        <textarea
          placeholder=""
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
          style={{
            width: '100%', padding: '8px 12px', fontSize: '14px',
            fontFamily: 'Inter, sans-serif', color: '#1e293b',
            border: '1px solid #d1d5db', borderRadius: '6px',
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            transition: 'border-color 150ms',
          }}
          onFocus={e => (e.target.style.borderColor = '#5B9AC8')}
          onBlur={e => (e.target.style.borderColor = '#d1d5db')}
        />
      </Field>
    </div>
  )

  return (
    <SectionCard id="property" icon={PropertyIcon} title="Property" className="mb-8">
      <div className="py-4">
        {/* 红框：flex 容器，左绿框=地址表单，右绿框=地图 */}
        {mapOnTop ? (
          // Enter address 切换后：地图在上全宽，地址表单在下
          <>
            {MapBlock}
            <div className="mt-4">{AddressBlock}</div>
          </>
        ) : (
          <div className="flex gap-6 items-start">
            <div className="flex-1 min-w-0">{AddressBlock}</div>
            <div className="flex-1 min-w-0">{MapBlock}</div>
          </div>
        )}

        {/* 红框下方：其余属性字段，全宽展示 */}
        {ExtraBlock}
      </div>
    </SectionCard>
  )
}

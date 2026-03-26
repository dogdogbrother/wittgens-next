import { useState } from 'react'
import { Icon } from '@iconify/react'
import SectionCard from '../../../components/SectionCard'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { countries, getCountryByCode } from '../../../utils/countries'
import PropertyMap from './PropertyMap'
import { iconify } from '../utils.jsx'

function Field({ label, required, error, children, className = '', bordered = false }) {
  return (
    <div
      className={`space-y-1 ${className}`}
      style={bordered ? { borderLeft: '3px solid #D0E2EA', paddingLeft: '10px' } : undefined}
    >
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {children}
      <p className="text-red-500 text-xs min-h-[16px]">{error || '\u00A0'}</p>
    </div>
  )
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="flex items-center gap-3 flex-nowrap mt-3">
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

export default function PropertySection({ form, onChange, errors = {} }) {
  const [mapOnTop, setMapOnTop] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)
  const [geocoding, setGeocoding] = useState(false)

  const set = (field, val) => onChange(field, val)

  const geocodeAddress = async () => {
    const countryName = getCountryByCode(form.country)?.name || form.country
    const addr = [form.streetAddress, form.city, form.province, countryName].filter(Boolean).join(', ')
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
      style={mapOnTop ? { height: '360px' } : { height: '100%', minHeight: '200px' }}
    />
  )

  const AddressBlock = (
    <div className="space-y-4">
      {EnterAddressBtn}

      <div className="grid grid-cols-2 gap-6">
        <Field label="Country/Region" required error={errors.country}>
          <Select value={form.country} onValueChange={(v) => set('country', v)}>
            <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
              <SelectValue>
                {(() => {
                  const c = getCountryByCode(form.country)
                  return (
                    <div className="flex items-center gap-2">
                      {c && <Icon icon={c.flagIcon} className="w-5 h-4 shrink-0" />}
                      <span>{c?.name || form.country}</span>
                    </div>
                  )
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <div className="flex items-center gap-2">
                    <Icon icon={c.flagIcon} className="w-5 h-4 shrink-0" />
                    <span>{c.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Street address" required error={errors.streetAddress}>
          <Input
            placeholder="Hauptstraße 25"
            value={form.streetAddress}
            onChange={e => set('streetAddress', e.target.value)}
            onBlur={geocodeAddress}
            className={errors.streetAddress ? 'border-red-500' : ''}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Field label="Apt, floor, bldg (if applicable)">
          <Input placeholder="5" value={form.apt} onChange={e => set('apt', e.target.value)} />
        </Field>
        <Field label="City/town/village" required error={errors.city}>
          <Input
            placeholder="Aarau"
            value={form.city}
            onChange={e => set('city', e.target.value)}
            onBlur={geocodeAddress}
            className={errors.city ? 'border-red-500' : ''}
          />
        </Field>
      </div>

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

  const ExtraBlock = (
    <div className="space-y-4 mt-6">
      <div className="flex gap-8 items-start">
        <div className="flex-1 min-w-0 flex gap-4 justify-between">
          <Field label="Lifecycle Stage" required error={errors.lifecycleStage} bordered>
            <RadioGroup
              name="lifecycleStage"
              value={form.lifecycleStage}
              onChange={v => set('lifecycleStage', v)}
              options={[
                { value: 'existing', label: 'Existing' },
                { value: 'under_construction', label: 'Under construction' },
              ]}
            />
          </Field>
          <Field label="Property Size" required error={errors.propertySize}>
            <div className="flex gap-2">
              <Input placeholder="0" value={form.propertySize} onChange={e => set('propertySize', e.target.value)} className={`w-20 ${errors.propertySize ? 'border-red-500' : ''}`} />
              <Select value={form.propertySizeUnit} onValueChange={v => set('propertySizeUnit', v)}>
                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ft²">ft²</SelectItem>
                  <SelectItem value="m²">m²</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Field>
          <Field label="Property Age" required error={errors.propertyAge}>
            <div className="flex items-center gap-2">
              <Input placeholder="0" value={form.propertyAge} onChange={e => set('propertyAge', e.target.value)} className={`w-20 ${errors.propertyAge ? 'border-red-500' : ''}`} />
              <span className="text-sm text-gray-600 whitespace-nowrap">Years</span>
            </div>
          </Field>
        </div>
        <div className="flex-1 min-w-0">
          <Field label="Commercial Type" required error={errors.commercialType} bordered>
            <RadioGroup
              name="commercialType"
              value={form.commercialType}
              onChange={v => set('commercialType', v)}
              options={[
                { value: 'retail', label: 'Retail' },
                { value: 'office', label: 'Office' },
                { value: 'tourism_hospitality', label: 'Tourism & Hospitality' },
                { value: 'industrial_logistics', label: 'Industrial & Logistics' },
                { value: 'mixed_use', label: 'Mixed-Use' },
              ]}
            />
          </Field>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <Field label="Use of Proceeds" required error={errors.useOfProceeds} bordered>
          <RadioGroup
            name="useOfProceeds"
            value={form.useOfProceeds}
            onChange={v => set('useOfProceeds', v)}
              options={[
                { value: 'construction_funds', label: 'Construction Funds' },
                { value: 'infrastructure_fundraising', label: 'Infrastructure Fundraising' },
                { value: 'fundraising_for_business_expansion', label: 'Fundraising for business expansion' },
                { value: 'fundraising_for_new_project', label: 'Fundraising for New Project' },
              ]}
          />
        </Field>
        <Field label="Property Tokenization Options" required error={errors.tokenizationOptions} bordered>
          <RadioGroup
            name="tokenizationOptions"
            value={form.tokenizationOptions}
            onChange={v => set('tokenizationOptions', v)}
              options={[
                { value: 'for_sale', label: 'For Sale' },
                { value: 'for_rent', label: 'For Rent' },
                { value: 'for_both', label: 'For Both' },
              ]}
          />
        </Field>
      </div>

      <Field label="Expected Valuation(USD)" required error={errors.expectedValuation}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <Input
            placeholder="Enter your estimated value, priced in USD"
            value={form.expectedValuation}
            onChange={e => set('expectedValuation', e.target.value)}
            className={`pl-7 ${errors.expectedValuation ? 'border-red-500' : ''}`}
          />
        </div>
      </Field>

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
        {mapOnTop ? (
          <>
            {MapBlock}
            <div className="mt-4">{AddressBlock}</div>
          </>
        ) : (
          <div className="flex gap-6 items-stretch">
            <div className="flex-1 min-w-0">{AddressBlock}</div>
            <div className="flex-1 min-w-0 flex flex-col">{MapBlock}</div>
          </div>
        )}
        {ExtraBlock}
      </div>
    </SectionCard>
  )
}

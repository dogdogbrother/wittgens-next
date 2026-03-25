// 用 @iconify/react 渲染国旗，返回 icon name 字符串
export const countries = [
  { code: 'US', name: 'USA',         phonePrefix: '+1',  flagIcon: 'flagpack:us' },
  { code: 'GB', name: 'UK',          phonePrefix: '+44', flagIcon: 'flagpack:gb' },
  { code: 'CN', name: 'China',       phonePrefix: '+86', flagIcon: 'flagpack:cn' },
  { code: 'CH', name: 'Switzerland', phonePrefix: '+41', flagIcon: 'flagpack:ch' },
  { code: 'DE', name: 'Germany',     phonePrefix: '+49', flagIcon: 'flagpack:de' },
  { code: 'FR', name: 'France',      phonePrefix: '+33', flagIcon: 'flagpack:fr' },
  { code: 'JP', name: 'Japan',       phonePrefix: '+81', flagIcon: 'flagpack:jp' },
  { code: 'SG', name: 'Singapore',   phonePrefix: '+65', flagIcon: 'flagpack:sg' },
  { code: 'AU', name: 'Australia',   phonePrefix: '+61', flagIcon: 'flagpack:au' },
  { code: 'CA', name: 'Canada',      phonePrefix: '+1',  flagIcon: 'flagpack:ca' },
]

export const getCountryByPhonePrefix = (prefix) => countries.find(c => c.phonePrefix === prefix)
export const getCountryByName = (name) => countries.find(c => c.name === name)
export const getCountryByCode = (code) => countries.find(c => c.code === code)

import { Icon } from '@iconify/react'

export const iconify = (name) => {
  const Comp = ({ size, ...props }) => <Icon icon={name} width={size} height={size} {...props} />
  Comp.displayName = name
  return Comp
}

import * as React from 'react'
import { cn } from '../../lib/utils'

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#5B9AC8] disabled:cursor-not-allowed disabled:bg-[#F6F6F6] disabled:text-[rgba(0,0,0,0.4)] transition-colors duration-150',
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = 'Input'
export { Input }

import { memo } from 'react'
import { cn } from '@/lib/utils'

export type Gender = 'M' | 'F' | ''

interface InputGenderProps {
  value: Gender
  onChange: (value: Gender) => void
}

export const InputGender = memo(({ value, onChange }: InputGenderProps) => {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        onClick={() => onChange(value === 'M' ? '' : 'M')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium border transition-colors rounded-l-md',
          value === 'M'
            ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
      >
        M
      </button>
      <button
        type="button"
        onClick={() => onChange(value === 'F' ? '' : 'F')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium border border-l-0 transition-colors rounded-r-md',
          value === 'F'
            ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        )}
      >
        F
      </button>
    </div>
  )
})

InputGender.displayName = 'InputGender'

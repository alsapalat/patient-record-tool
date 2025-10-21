import { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { DISEASES } from '@/constants/diseases'
import type { PatientRow as PatientRowType } from '@/store/patientStore'

interface PatientRowProps {
  row: PatientRowType
  rowIndex: number
  onAgeChange: (index: number, value: string) => void
  onDateChange: (index: number, value: string) => void
  onDiseaseToggle: (rowIndex: number, disease: string) => void
}

export const PatientRow = memo(({
  row,
  rowIndex,
  onAgeChange,
  onDateChange,
  onDiseaseToggle,
}: PatientRowProps) => {
  const hasNoAge = !row.age || row.age === ''
  const hasNoDisease = (row.diseases || []).length === 0
  const needsAttention = hasNoAge || hasNoDisease

  const rowBg = needsAttention ? 'bg-yellow-50' : (rowIndex % 2 === 0 ? 'bg-muted/30' : 'bg-white')
  const stickyBg = needsAttention ? 'bg-yellow-50' : 'bg-white'

  return (
    <div className={`grid-row ${rowBg}`} style={{ display: 'contents' }}>
      <div className={`cell sticky-index ${stickyBg}`}>
        <span className="text-sm font-medium text-muted-foreground">{rowIndex + 1}</span>
      </div>
      <div className={`cell sticky-name ${stickyBg}`}>
        <span className="text-sm">{row.Name || ''}</span>
      </div>
      <div className={`cell sticky-age ${stickyBg}`}>
        <Input
          type="number"
          value={row.age || ''}
          onChange={(e) => onAgeChange(rowIndex, e.target.value)}
          className="w-20 h-8"
          placeholder="Age"
        />
      </div>
      <div className={`cell ${rowBg}`}>
        <Input
          type="date"
          value={row.date || ''}
          onChange={(e) => onDateChange(rowIndex, e.target.value)}
          className="w-32 h-8"
          placeholder="Date"
        />
      </div>
      {DISEASES.map((disease) => {
        const isChecked = (row.diseases || []).includes(disease)
        return (
          <div
            key={disease}
            className={`cell disease-cell cursor-pointer transition-colors ${
              isChecked ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-muted/50'
            }`}
            onClick={() => onDiseaseToggle(rowIndex, disease)}
          >
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => onDiseaseToggle(rowIndex, disease)}
              className="pointer-events-none"
            />
          </div>
        )
      })}
    </div>
  )
})

PatientRow.displayName = 'PatientRow'

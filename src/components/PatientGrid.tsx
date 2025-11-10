import { Card, CardContent } from '@/components/ui/card'
import { PatientRow } from '@/components/PatientRow'
import { DISEASES, getDiseaseShortName } from '@/constants/diseases'
import type { PatientRow as PatientRowType } from '@/store/patientStore'

interface PatientGridProps {
  csvData: PatientRowType[]
  onAgeChange: (index: number, value: string) => void
  onDateChange: (index: number, value: string) => void
  onGenderChange: (index: number, value: 'M' | 'F' | '') => void
  onDiseaseToggle: (rowIndex: number, disease: string) => void
}

export const PatientGrid = ({ csvData, onAgeChange, onDateChange, onGenderChange, onDiseaseToggle }: PatientGridProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div
          className="overflow-auto max-h-[calc(100vh-250px)]"
          style={{
            border: '2px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        >
          {/* Grid container */}
          <div
            className="patient-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `60px 150px 100px 150px 100px repeat(${DISEASES.length}, 50px)`,
              minWidth: 'max-content',
            }}
          >
            {/* Header Row */}
            <div className="header sticky-index bg-white">#</div>
            <div className="header sticky-name bg-white">Name</div>
            <div className="header sticky-age bg-white">Age</div>
            <div className="header bg-white">Date</div>
            <div className="header bg-white">Gender</div>
            {DISEASES.map((disease) => (
              <div key={disease} className="header disease-header bg-white">
                <div>{getDiseaseShortName(disease)}</div>
              </div>
            ))}

            {/* Data Rows */}
            {csvData.map((row, rowIndex) => (
              <PatientRow
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
                onAgeChange={onAgeChange}
                onDateChange={onDateChange}
                onGenderChange={onGenderChange}
                onDiseaseToggle={onDiseaseToggle}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

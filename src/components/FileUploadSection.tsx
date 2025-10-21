import { type ChangeEvent } from 'react'
import { Upload, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SummaryDialog } from '@/components/SummaryDialog'
import { ClearDataDialog } from '@/components/ClearDataDialog'
import type { PatientRow } from '@/store/patientStore'

interface FileUploadSectionProps {
  csvData: PatientRow[]
  onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRandomAutofill: () => void
  onClearData: () => void
}

export const FileUploadSection = ({ csvData, onFileUpload, onRandomAutofill, onClearData }: FileUploadSectionProps) => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Patient Record Tool</h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {csvData.length > 0 && (
              <span className="text-sm text-muted-foreground mr-2">
                {csvData.length} record{csvData.length !== 1 ? 's' : ''} loaded
              </span>
            )}

            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={onFileUpload}
              className="hidden"
            />
            <label htmlFor="csv-upload">
              <Button variant={csvData.length > 0 ? "outline" : "default"} size="sm" className="cursor-pointer" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </span>
              </Button>
            </label>

            {csvData.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={onRandomAutofill}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Random Autofill
                </Button>
                <SummaryDialog csvData={csvData} />
                <ClearDataDialog onClear={onClearData} />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

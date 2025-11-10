import { type ChangeEvent } from 'react'
import { Upload, Download, FileDown, Sparkles } from 'lucide-react'
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
  onExportXLSX: () => void
  onDownloadTemplate: () => void
}

export const FileUploadSection = ({ csvData, onFileUpload, onRandomAutofill, onClearData, onExportXLSX, onDownloadTemplate }: FileUploadSectionProps) => {
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

            {/* Show only upload and download template when no data */}
            {csvData.length === 0 ? (
              <>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={onFileUpload}
                  className="hidden"
                />
                <label htmlFor="csv-upload">
                  <Button variant="default" size="sm" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </span>
                  </Button>
                </label>

                <Button variant="outline" size="sm" onClick={onDownloadTemplate}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </>
            ) : (
              <>
                {/* Show autofill, summary, export, and clear when data is loaded */}
                <Button className="hidden" variant="secondary" size="sm" onClick={onRandomAutofill}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Autofill All
                </Button>
                <SummaryDialog csvData={csvData} />
                <Button variant="outline" size="sm" onClick={onExportXLSX}>
                  <Download className="mr-2 h-4 w-4" />
                  Export XLSX
                </Button>
                <ClearDataDialog onClear={onClearData} />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

import { type ChangeEvent, useState, useCallback } from 'react'
import { FileUploadSection } from '@/components/FileUploadSection'
import { PatientGrid } from '@/components/PatientGrid'
import { EmptyState } from '@/components/EmptyState'
import { DISEASES } from '@/constants/diseases'
import { usePatientStore, type PatientRow } from '@/store/patientStore'
import { parseDateFromCSV } from '@/utils/dateParser'
import { parseCSVLine, removeBOM } from '@/utils/csvParser'
import * as XLSX from 'xlsx'
import './App.css'

function App() {
  // Initialize from Zustand store (get initial data only, no subscription)
  const [csvData, setCsvData] = useState<PatientRow[]>(() => usePatientStore.getState().csvData)

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isXLSX = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')

    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result

      let headerLine: string[] = []
      let dataRows: string[][] = []

      if (isXLSX) {
        // Handle XLSX files
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

        if (jsonData.length === 0) return

        // Trim all header values
        headerLine = jsonData[0].map(h => (h?.toString() || '').trim())
        // Trim all cell values in data rows
        dataRows = jsonData.slice(1).map(row =>
          row.map(cell => (cell?.toString() || '').trim())
        )
      } else {
        // Handle CSV files
        let text = new TextDecoder().decode(arrayBuffer as ArrayBuffer)

        // Remove BOM if present
        text = removeBOM(text)

        const lines = text.split('\n').filter(line => line.trim())

        if (lines.length === 0) return

        // Use parseCSVLine to properly handle quoted fields with commas
        headerLine = parseCSVLine(lines[0])
        dataRows = lines.slice(1).map(line => parseCSVLine(line))
      }

      const data = dataRows.map((values) => {
        const row: PatientRow = { age: '', date: '', gender: '', diseases: [] }

        headerLine.forEach((header, i) => {
          const value = (values[i]?.toString() || '').trim()

          // Check if this is the Age column (from exported data)
          if (header.toLowerCase() === 'age') {
            row.age = value
          }

          // Check if this header contains "Date" or "Time" (case-insensitive)
          if (header.toLowerCase().includes('date') || header.toLowerCase().includes('time')) {
            // Parse and set to the date field
            row.date = parseDateFromCSV(value)
          }

          // Check if this is the Gender column (from exported data)
          if (header.toLowerCase() === 'gender') {
            const genderValue = value.toUpperCase()
            if (genderValue === 'M' || genderValue === 'F') {
              row.gender = genderValue
            }
          }

          // Check if this is a disease column (from exported data)
          if (DISEASES.includes(header as typeof DISEASES[number]) && value.toLowerCase() === 'yes') {
            row.diseases = [...(row.diseases || []), header]
          }

          // Still store the original value in the row (but skip disease columns to avoid redundancy)
          if (!DISEASES.includes(header as typeof DISEASES[number])) {
            row[header] = value
          }
        })

        return row
      })

      // Update both local state and store
      setCsvData(data)
      usePatientStore.setState({ csvData: data })
    }

    reader.readAsArrayBuffer(file)
  }

  const handleAgeChange = useCallback((index: number, value: string) => {
    // Update local state immediately for fast UI
    setCsvData((prevData) => {
      const newData = [...prevData]
      newData[index] = { ...newData[index], age: value }

      // Sync to store in background (no subscription, no re-render)
      usePatientStore.setState({ csvData: newData })

      return newData
    })
  }, [])

  const handleDateChange = useCallback((index: number, value: string) => {
    // Update local state immediately for fast UI
    setCsvData((prevData) => {
      const newData = [...prevData]
      newData[index] = { ...newData[index], date: value }

      // Sync to store in background (no subscription, no re-render)
      usePatientStore.setState({ csvData: newData })

      return newData
    })
  }, [])

  const handleGenderChange = useCallback((index: number, value: 'M' | 'F' | '') => {
    // Update local state immediately for fast UI
    setCsvData((prevData) => {
      const newData = [...prevData]
      newData[index] = { ...newData[index], gender: value }

      // Sync to store in background (no subscription, no re-render)
      usePatientStore.setState({ csvData: newData })

      return newData
    })
  }, [])

  const handleDiseaseToggle = useCallback((rowIndex: number, disease: string) => {
    // Update local state immediately for fast UI
    setCsvData((prevData) => {
      const newData = [...prevData]
      const row = newData[rowIndex]
      const currentDiseases = row.diseases || []

      const updatedDiseases = currentDiseases.includes(disease)
        ? currentDiseases.filter((d) => d !== disease)
        : [...currentDiseases, disease]

      newData[rowIndex] = { ...row, diseases: updatedDiseases }

      // Sync to store in background (no subscription, no re-render)
      usePatientStore.setState({ csvData: newData })

      return newData
    })
  }, [])

  const handleRandomAutofill = useCallback(() => {
    setCsvData((prevData) => {
      const newData = prevData.map((row) => {
        const randomAge = Math.floor(Math.random() * 90) + 1
        const numDiseases = Math.floor(Math.random() * 4)
        const shuffledDiseases = [...DISEASES].sort(() => Math.random() - 0.5)
        const randomDiseases = shuffledDiseases.slice(0, numDiseases)
        const randomGender: 'M' | 'F' = Math.random() > 0.5 ? 'M' : 'F'

        return {
          ...row,
          age: randomAge.toString(),
          gender: randomGender,
          diseases: randomDiseases,
        }
      })

      // Sync to store in background (no subscription, no re-render)
      usePatientStore.setState({ csvData: newData })

      return newData
    })
  }, [])

  const handleClearData = useCallback(() => {
    // Clear local state
    setCsvData([])

    // Clear store and session storage
    usePatientStore.setState({ csvData: [], headers: [] })
  }, [])

  const handleExportXLSX = useCallback(() => {
    if (csvData.length === 0) return

    // Prepare data for export with individual disease columns
    const exportData = csvData.map((row) => {
      const { diseases, age, date, gender, ...originalFields } = row

      // Create an object with all original CSV fields first
      const exportRow: Record<string, string> = { ...originalFields as Record<string, string> }

      // Add age, date, and gender columns (these are the updated/annotated values)
      exportRow['Age'] = age || ''
      exportRow['Date'] = date || ''
      exportRow['Gender'] = gender || ''

      // Add individual columns for each disease
      DISEASES.forEach((disease) => {
        exportRow[disease] = (diseases || []).includes(disease) ? 'Yes' : 'No'
      })

      return exportRow
    })

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Records')

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `patient-records-${timestamp}.xlsx`

    // Write the file
    XLSX.writeFile(workbook, filename)
  }, [csvData])

  const handleDownloadTemplate = useCallback(() => {
    // Create a link element to download the template file
    const link = document.createElement('a')
    link.href = '/template/example.xlsx'
    link.download = 'patient-template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return (
    <>
      <FileUploadSection
        csvData={csvData}
        onFileUpload={handleFileUpload}
        onRandomAutofill={handleRandomAutofill}
        onClearData={handleClearData}
        onExportXLSX={handleExportXLSX}
        onDownloadTemplate={handleDownloadTemplate}
      />

      <div className="container mx-auto p-6 max-w-[1800px]">
        {csvData.length > 0 ? (
          <PatientGrid
            csvData={csvData}
            onAgeChange={handleAgeChange}
            onDateChange={handleDateChange}
            onGenderChange={handleGenderChange}
            onDiseaseToggle={handleDiseaseToggle}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  )
}

export default App

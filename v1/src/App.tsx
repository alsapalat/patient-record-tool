import { type ChangeEvent, useState, useCallback } from 'react'
import { FileUploadSection } from '@/components/FileUploadSection'
import { PatientGrid } from '@/components/PatientGrid'
import { EmptyState } from '@/components/EmptyState'
import { DISEASES } from '@/constants/diseases'
import { usePatientStore, type PatientRow } from '@/store/patientStore'
import { parseDateFromCSV } from '@/utils/dateParser'
import './App.css'

function App() {
  // Initialize from Zustand store (get initial data only, no subscription)
  const [csvData, setCsvData] = useState<PatientRow[]>(() => usePatientStore.getState().csvData)

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())

      if (lines.length === 0) return

      const headerLine = lines[0].split(',')

      const data = lines.slice(1).map((line) => {
        const values = line.split(',')
        const row: PatientRow = { age: '', date: '', diseases: [] }

        headerLine.forEach((header, i) => {
          const value = values[i] || ''

          // Check if this header contains "Date" or "Time" (case-insensitive)
          if (header.toLowerCase().includes('date') || header.toLowerCase().includes('time')) {
            // Parse and set to the date field
            row.date = parseDateFromCSV(value)
          }

          // Still store the original value in the row
          row[header] = value
        })

        return row
      })

      // Update both local state and store
      setCsvData(data)
      usePatientStore.setState({ csvData: data })
    }

    reader.readAsText(file)
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

        return {
          ...row,
          age: randomAge.toString(),
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

  return (
    <>
      <FileUploadSection
        csvData={csvData}
        onFileUpload={handleFileUpload}
        onRandomAutofill={handleRandomAutofill}
        onClearData={handleClearData}
      />

      <div className="container mx-auto p-6 max-w-[1800px]">
        {csvData.length > 0 ? (
          <PatientGrid
            csvData={csvData}
            onAgeChange={handleAgeChange}
            onDateChange={handleDateChange}
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

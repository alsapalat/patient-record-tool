import { type ChangeEvent } from 'react'
import { Upload, BarChart3, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { usePatientStore, type PatientRow } from '@/store/patientStore'
import './App.css'

const DISEASES = [
  'Blood & Blood Components',
  'Cardiovascular',
  'Development Anomalies',
  'Endocrine Nutrition and Metabolic',
  'ENT',
  'Gastro and Digestive',
  'Infectious',
  'Neurology',
  'OB',
  'Oncology',
  'Ortho',
  'Pulmo',
  'Renal',
  'Surgery',
  'Trauma',
  'Urology',
  'Psych'
] as const

type AgeGroupStats = {
  ageGroup: string
  count: number
  percentage: string
}

type DiseaseStats = {
  disease: string
  count: number
  percentage: string
  ageBreakdown: { ageGroup: string; count: number }[]
}

function App() {
  const { csvData, headers, updateAge, toggleDisease, loadCsvFile, autofillRandom } = usePatientStore()

  const getAgeGroup = (age: string): string => {
    const ageNum = parseInt(age)
    if (isNaN(ageNum)) return 'Unknown'
    if (ageNum < 18) return '0-17'
    if (ageNum < 30) return '18-29'
    if (ageNum < 40) return '30-39'
    if (ageNum < 50) return '40-49'
    if (ageNum < 60) return '50-59'
    if (ageNum < 70) return '60-69'
    if (ageNum < 80) return '70-79'
    return '80+'
  }

  const calculateSummaryStats = (): { ageGroups: AgeGroupStats[], diseases: DiseaseStats[] } => {
    const ageGroupCounts: Record<string, number> = {}
    const diseaseCounts: Record<string, number> = {}
    const diseaseAgeBreakdown: Record<string, Record<string, number>> = {}

    // Count age groups and diseases
    csvData.forEach(row => {
      const ageGroup = getAgeGroup(row.age || '')
      ageGroupCounts[ageGroup] = (ageGroupCounts[ageGroup] || 0) + 1

      const diseases = row.diseases || []
      diseases.forEach(disease => {
        diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1

        // Track age breakdown for each disease
        if (!diseaseAgeBreakdown[disease]) {
          diseaseAgeBreakdown[disease] = {}
        }
        diseaseAgeBreakdown[disease][ageGroup] = (diseaseAgeBreakdown[disease][ageGroup] || 0) + 1
      })
    })

    const totalRecords = csvData.length

    // Convert to array format with percentages
    const ageGroups: AgeGroupStats[] = Object.entries(ageGroupCounts)
      .map(([ageGroup, count]) => ({
        ageGroup,
        count,
        percentage: totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => a.ageGroup.localeCompare(b.ageGroup))

    const diseases: DiseaseStats[] = Object.entries(diseaseCounts)
      .map(([disease, count]) => ({
        disease,
        count,
        percentage: totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : '0',
        ageBreakdown: Object.entries(diseaseAgeBreakdown[disease] || {})
          .map(([ageGroup, ageCount]) => ({ ageGroup, count: ageCount }))
          .sort((a, b) => a.ageGroup.localeCompare(b.ageGroup))
      }))
      .sort((a, b) => b.count - a.count)

    return { ageGroups, diseases }
  }

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
        const row: PatientRow = { age: '', diseases: [] }
        headerLine.forEach((header, i) => {
          row[header] = values[i] || ''
        })
        return row
      })

      loadCsvFile(headerLine, data)
    }

    reader.readAsText(file)
  }

  const handleAgeChange = (index: number, value: string) => {
    updateAge(index, value)
  }

  const handleDiseaseToggle = (rowIndex: number, disease: string) => {
    toggleDisease(rowIndex, disease)
  }

  const handleRandomAutofill = () => {
    autofillRandom(DISEASES)
  }

  return (
    <div className="container mx-auto p-6 max-w-[1800px]">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl">Patient Aggregate Record</CardTitle>
          <CardDescription>Upload and manage patient records with additional metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="csv-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV File
                </span>
              </Button>
            </label>
            {csvData.length > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  {csvData.length} record{csvData.length !== 1 ? 's' : ''} loaded
                </span>
                <Button variant="secondary" onClick={handleRandomAutofill}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Random Autofill (Demo)
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Summary
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                    <DialogHeader>
                      <DialogTitle>Statistical Summary</DialogTitle>
                      <DialogDescription>
                        Aggregated statistics by age group and disease
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* Age Group Statistics */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Age Groups</h3>
                        <div className="border rounded-md p-4">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={calculateSummaryStats().ageGroups}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="ageGroup" />
                              <YAxis />
                              <Tooltip
                                formatter={(value: number, name: string) => {
                                  if (name === 'count') return [value, 'Count'];
                                  return [value, name];
                                }}
                              />
                              <Legend />
                              <Bar dataKey="count" fill="#8884d8" name="Count" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Disease Statistics */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Diseases</h3>
                        <div className="border rounded-md p-4">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={calculateSummaryStats().diseases} layout="horizontal">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" />
                              <YAxis dataKey="disease" type="category" width={150} fontSize={12} />
                              <Tooltip
                                formatter={(value: number, name: string) => {
                                  if (name === 'count') return [value, 'Count'];
                                  return [value, name];
                                }}
                              />
                              <Legend />
                              <Bar dataKey="count" fill="#82ca9d" name="Count" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Age Breakdown per Disease */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Age Breakdown by Disease</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {calculateSummaryStats().diseases.map((stat) => (
                          stat.count > 0 && (
                            <Card key={stat.disease}>
                              <CardHeader className="pb-3">
                                <CardTitle className="text-base">{stat.disease}</CardTitle>
                                <CardDescription>Total: {stat.count} patient{stat.count !== 1 ? 's' : ''}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart data={stat.ageBreakdown}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="ageGroup" fontSize={11} />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#fbbf24" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </CardContent>
                            </Card>
                          )
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {csvData.length > 0 ? (
        <Card>
          <CardContent>
            <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-250px)] relative">
              <Table className="border-collapse">
                <TableHeader className="sticky top-0 bg-background z-20">
                  <TableRow className="border-b">
                    {headers.map((header, i) =>
                      header === 'Name' ? (
                        <TableHead
                          key={i}
                          className="border whitespace-nowrap bg-muted font-semibold sticky left-0 z-20"
                        >
                          {header}
                        </TableHead>
                      ) : null
                    )}
                    <TableHead className="border whitespace-nowrap bg-muted font-semibold sticky z-20" style={{ left: '120px' }}>
                      Age
                    </TableHead>
                    {DISEASES.map((disease) => (
                      <TableHead key={disease} className="border text-center whitespace-nowrap bg-muted font-semibold min-w-[180px]">
                        {disease}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, rowIndex) => {
                    const hasNoAge = !row.age || row.age === ''
                    const hasNoDisease = (row.diseases || []).length === 0
                    const needsAttention = hasNoAge || hasNoDisease
                    const rowBgClass = needsAttention
                      ? 'bg-yellow-50'
                      : (rowIndex % 2 === 0 ? 'bg-muted/30' : 'bg-background')
                    const stickyCellBg = needsAttention ? 'bg-yellow-50' : 'bg-white'

                    return (
                      <TableRow key={rowIndex} className={rowBgClass}>
                        {headers.map((header, colIndex) =>
                          header === 'Name' ? (
                            <TableCell
                              key={colIndex}
                              className={`border text-sm whitespace-nowrap px-3 py-2 sticky z-10 left-0 ${stickyCellBg}`}
                            >
                              {row[header]}
                            </TableCell>
                          ) : null
                        )}
                        <TableCell
                          className={`border whitespace-nowrap px-3 py-2 sticky z-10 ${stickyCellBg}`}
                          style={{ left: '120px' }}
                        >
                          <Input
                            type="number"
                            value={row.age || ''}
                            onChange={(e) => handleAgeChange(rowIndex, e.target.value)}
                            className="w-20"
                            placeholder="Age"
                          />
                        </TableCell>
                        {DISEASES.map((disease) => {
                          const isChecked = (row.diseases || []).includes(disease)
                          return (
                            <TableCell
                              key={disease}
                              className={`border text-center whitespace-nowrap px-0 py-0 cursor-pointer transition-colors ${
                                isChecked ? 'bg-green-100 hover:bg-green-200' : 'hover:bg-muted/50'
                              }`}
                              onClick={() => handleDiseaseToggle(rowIndex, disease)}
                            >
                              <div className="flex justify-center items-center h-full w-full px-3 py-2">
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => handleDiseaseToggle(rowIndex, disease)}
                                  className="pointer-events-none"
                                />
                              </div>
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Upload a CSV file to get started</p>
            <p className="text-sm text-muted-foreground mt-2">Click the button above to select a file</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default App

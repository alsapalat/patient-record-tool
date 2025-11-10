import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { calculateSummaryStats, calculatePediatricStats, calculateAdultStats } from '@/utils/statistics'
import type { PatientRow } from '@/store/patientStore'

interface SummaryDialogProps {
  csvData: PatientRow[]
}

export const SummaryDialog = ({ csvData }: SummaryDialogProps) => {
  const stats = calculateSummaryStats(csvData)
  const pediatricStats = calculatePediatricStats(csvData)
  const adultStats = calculateAdultStats(csvData)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <BarChart3 className="mr-2 h-4 w-4" />
          Generate Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-7xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Statistical Summary</DialogTitle>
          <DialogDescription>
            Aggregated statistics by age group and disease
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Pediatric Age Group Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Pediatric Age Groups (0-17)</h3>
            <div className="border rounded-md p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pediatricStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" stackId="a" fill="#ef4444" name="Male" />
                  <Bar dataKey="female" stackId="a" fill="#3b82f6" name="Female" />
                </BarChart>
              </ResponsiveContainer>
              {pediatricStats.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No pediatric patients found
                </div>
              )}
            </div>
          </div>

          {/* Adult Age Group Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Adult Age Groups (18+)</h3>
            <div className="border rounded-md p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={adultStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" stackId="a" fill="#ef4444" name="Male" />
                  <Bar dataKey="female" stackId="a" fill="#3b82f6" name="Female" />
                </BarChart>
              </ResponsiveContainer>
              {adultStats.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No adult patients found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disease Statistics */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Disease Distribution</h3>
          <div className="border rounded-md p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={stats.diseases} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="disease" type="category" width={100} fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" stackId="a" fill="#ef4444" name="Male" />
                <Bar dataKey="female" stackId="a" fill="#3b82f6" name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Breakdown per Disease */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Age Breakdown by Disease</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.diseases.map((stat) => (
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
  )
}

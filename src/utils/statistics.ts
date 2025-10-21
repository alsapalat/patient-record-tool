import type { PatientRow } from '@/store/patientStore'
import type { AgeGroupStats, DiseaseStats } from '@/types/patient'

export const getAgeGroup = (age: string): string => {
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

export const calculateSummaryStats = (csvData: PatientRow[]): { ageGroups: AgeGroupStats[], diseases: DiseaseStats[] } => {
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

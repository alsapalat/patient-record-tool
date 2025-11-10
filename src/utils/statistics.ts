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

export const getPediatricAgeGroup = (age: string): string => {
  const ageNum = parseInt(age)
  if (isNaN(ageNum)) return 'Unknown'
  if (ageNum < 2) return '0-1'
  if (ageNum < 6) return '2-5'
  if (ageNum < 12) return '6-11'
  if (ageNum < 18) return '12-17'
  return 'N/A'
}

export const getAdultAgeGroup = (age: string): string => {
  const ageNum = parseInt(age)
  if (isNaN(ageNum)) return 'Unknown'
  if (ageNum < 18) return 'N/A'
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

export const calculatePediatricStats = (csvData: PatientRow[]): AgeGroupStats[] => {
  const ageGroupCounts: Record<string, number> = {}

  // Filter pediatric patients (0-17) and count by age group
  csvData.forEach(row => {
    const ageNum = parseInt(row.age || '')
    if (!isNaN(ageNum) && ageNum < 18) {
      const ageGroup = getPediatricAgeGroup(row.age || '')
      if (ageGroup !== 'N/A') {
        ageGroupCounts[ageGroup] = (ageGroupCounts[ageGroup] || 0) + 1
      }
    }
  })

  const totalPediatric = Object.values(ageGroupCounts).reduce((sum, count) => sum + count, 0)

  return Object.entries(ageGroupCounts)
    .map(([ageGroup, count]) => ({
      ageGroup,
      count,
      percentage: totalPediatric > 0 ? ((count / totalPediatric) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => a.ageGroup.localeCompare(b.ageGroup))
}

export const calculateAdultStats = (csvData: PatientRow[]): AgeGroupStats[] => {
  const ageGroupCounts: Record<string, number> = {}

  // Filter adult patients (18+) and count by age group
  csvData.forEach(row => {
    const ageNum = parseInt(row.age || '')
    if (!isNaN(ageNum) && ageNum >= 18) {
      const ageGroup = getAdultAgeGroup(row.age || '')
      if (ageGroup !== 'N/A') {
        ageGroupCounts[ageGroup] = (ageGroupCounts[ageGroup] || 0) + 1
      }
    }
  })

  const totalAdults = Object.values(ageGroupCounts).reduce((sum, count) => sum + count, 0)

  return Object.entries(ageGroupCounts)
    .map(([ageGroup, count]) => ({
      ageGroup,
      count,
      percentage: totalAdults > 0 ? ((count / totalAdults) * 100).toFixed(1) : '0'
    }))
    .sort((a, b) => a.ageGroup.localeCompare(b.ageGroup))
}

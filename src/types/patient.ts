export type AgeGroupStats = {
  ageGroup: string
  count: number
  male: number
  female: number
  percentage: string
}

export type DiseaseStats = {
  disease: string
  count: number
  male: number
  female: number
  percentage: string
  ageBreakdown: { ageGroup: string; count: number }[]
}

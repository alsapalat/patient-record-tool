export type AgeGroupStats = {
  ageGroup: string
  count: number
  percentage: string
}

export type DiseaseStats = {
  disease: string
  count: number
  percentage: string
  ageBreakdown: { ageGroup: string; count: number }[]
}

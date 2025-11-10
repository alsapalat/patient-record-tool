export const DISEASES = [
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
  'Psych',
  'Primary Care',
  'Hepa'
] as const

export type Disease = typeof DISEASES[number]

export const DISEASE_SHORTCUTS: Record<string, string> = {
  'Blood & Blood Components': 'Blood',
  'Cardiovascular': 'Cardio',
  'Development Anomalies': 'Dev Anomalies',
  'Endocrine Nutrition and Metabolic': 'Endocrine',
  'ENT': 'ENT',
  'Gastro and Digestive': 'Gastro',
  'Infectious': 'Infectious',
  'Neurology': 'Neuro',
  'OB': 'OB',
  'Oncology': 'Oncology',
  'Ortho': 'Ortho',
  'Pulmo': 'Pulmo',
  'Renal': 'Renal',
  'Surgery': 'Surgery',
  'Trauma': 'Trauma',
  'Urology': 'Urology',
  'Psych': 'Psych',
  'Primary Care': 'Primary',
  'Hepa': 'Hepa'
}

export const getDiseaseShortName = (disease: string): string => {
  return DISEASE_SHORTCUTS[disease] || disease
}

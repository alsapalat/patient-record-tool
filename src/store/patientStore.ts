import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type PatientRow = {
  [key: string]: string | string[] | undefined
  age?: string
  date?: string
  gender?: 'M' | 'F' | ''
  diseases?: string[]
}

interface PatientStore {
  csvData: PatientRow[]
  headers: string[]
  setCsvData: (data: PatientRow[]) => void
  setHeaders: (headers: string[]) => void
  updateAge: (index: number, age: string) => void
  updateDate: (index: number, date: string) => void
  toggleDisease: (rowIndex: number, disease: string) => void
  loadCsvFile: (headers: string[], data: PatientRow[]) => void
  autofillRandom: (diseases: readonly string[]) => void
  clearData: () => void
}

export const usePatientStore = create<PatientStore>()(
  persist(
    (set) => ({
      csvData: [],
      headers: [],

      setCsvData: (data) => set({ csvData: data }),

      setHeaders: (headers) => set({ headers }),

      updateAge: (index, age) =>
        set((state) => {
          const newData = [...state.csvData]
          newData[index] = { ...newData[index], age }
          return { csvData: newData }
        }),

      updateDate: (index, date) =>
        set((state) => {
          const newData = [...state.csvData]
          newData[index] = { ...newData[index], date }
          return { csvData: newData }
        }),

      toggleDisease: (rowIndex, disease) =>
        set((state) => {
          const newData = [...state.csvData]
          const row = newData[rowIndex]
          const currentDiseases = row.diseases || []

          const updatedDiseases = currentDiseases.includes(disease)
            ? currentDiseases.filter((d) => d !== disease)
            : [...currentDiseases, disease]

          newData[rowIndex] = { ...row, diseases: updatedDiseases }
          return { csvData: newData }
        }),

      loadCsvFile: (headers, data) =>
        set({ headers, csvData: data }),

      autofillRandom: (diseases) =>
        set((state) => {
          const newData = state.csvData.map((row) => {
            // Random age between 1 and 90
            const randomAge = Math.floor(Math.random() * 90) + 1

            // Random number of diseases (0-3)
            const numDiseases = Math.floor(Math.random() * 4)
            const shuffledDiseases = [...diseases].sort(() => Math.random() - 0.5)
            const randomDiseases = shuffledDiseases.slice(0, numDiseases)

            return {
              ...row,
              age: randomAge.toString(),
              diseases: randomDiseases,
            }
          })

          return { csvData: newData }
        }),

      clearData: () => set({ csvData: [], headers: [] }),
    }),
    {
      name: 'patient-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

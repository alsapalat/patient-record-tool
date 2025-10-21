/**
 * Parses date strings from CSV and converts to YYYY-MM-DD format
 * Handles formats like "10/1/25 8:15" or "10/1/25"
 */
export const parseDateFromCSV = (dateString: string): string => {
  if (!dateString) return ''

  // Trim whitespace and carriage returns
  const cleaned = dateString.trim().replace(/\r/g, '')

  if (!cleaned) return ''

  try {
    // Split by space to remove time portion if present
    const datePart = cleaned.split(' ')[0]

    // Split the date into components (MM/DD/YY)
    const parts = datePart.split('/')

    if (parts.length !== 3) return ''

    let [month, day, year] = parts

    // Pad month and day with leading zeros if needed
    month = month.padStart(2, '0')
    day = day.padStart(2, '0')

    // Convert 2-digit year to 4-digit
    // Assume 00-99 maps to 2000-2099
    if (year.length === 2) {
      year = `20${year}`
    }

    // Return in YYYY-MM-DD format
    return `${year}-${month}-${day}`
  } catch (error) {
    console.warn('Failed to parse date:', dateString, error)
    return ''
  }
}

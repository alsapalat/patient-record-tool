/**
 * Converts Excel serial date number to JavaScript Date
 * Excel dates are stored as days since January 1, 1900
 */
const excelSerialToDate = (serial: number): Date => {
  // Excel incorrectly treats 1900 as a leap year, so we need to account for that
  const excelEpoch = new Date(1899, 11, 30) // December 30, 1899
  const days = Math.floor(serial)
  const milliseconds = days * 24 * 60 * 60 * 1000
  return new Date(excelEpoch.getTime() + milliseconds)
}

/**
 * Parses date strings from CSV/XLSX and converts to YYYY-MM-DD format
 * Handles formats like:
 * - "10/1/25 8:15" or "10/1/25" (MM/DD/YY format)
 * - "2025-10-22" (ISO format - YYYY-MM-DD)
 * - "22-10-2025" or "22/10/2025" (DD-MM-YYYY or DD/MM/YYYY)
 * - Excel serial numbers like "45931.5625"
 */
export const parseDateFromCSV = (dateString: string): string => {
  if (!dateString) return ''

  // Trim whitespace and carriage returns
  const cleaned = dateString.trim().replace(/\r/g, '')

  if (!cleaned) return ''

  try {
    // Check if it's an Excel serial date number (all digits with optional decimal)
    if (/^\d+(\.\d+)?$/.test(cleaned)) {
      const serialNumber = parseFloat(cleaned)
      // Excel serial dates are typically between 1 (1900-01-01) and 100000 (modern dates)
      if (serialNumber > 0 && serialNumber < 100000) {
        const date = excelSerialToDate(serialNumber)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }

    // Split by space to remove time portion if present
    const datePart = cleaned.split(' ')[0]

    // Try to parse as ISO format (YYYY-MM-DD or YYYY/MM/DD)
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(datePart)) {
      const separator = datePart.includes('-') ? '-' : '/'
      const [year, month, day] = datePart.split(separator)
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    // Determine separator (/ or -)
    const separator = datePart.includes('/') ? '/' : datePart.includes('-') ? '-' : null

    if (!separator) return ''

    const parts = datePart.split(separator)

    if (parts.length !== 3) return ''

    let year: string, month: string, day: string

    // Determine format based on which part is likely the year
    const [first, second, third] = parts

    // If first part is 4 digits, it's YYYY-MM-DD
    if (first.length === 4) {
      year = first
      month = second
      day = third
    }
    // If third part is 4 digits, check if first part is likely day or month
    else if (third.length === 4) {
      year = third
      // If first part is > 12, it's DD-MM-YYYY, otherwise assume MM-DD-YYYY
      if (parseInt(first) > 12) {
        day = first
        month = second
      } else if (parseInt(second) > 12) {
        month = first
        day = second
      } else {
        // Ambiguous - default to MM-DD-YYYY (US format)
        month = first
        day = second
      }
    }
    // 2-digit year
    else {
      // Check if first part is > 12 to determine if it's day or month
      if (parseInt(first) > 12) {
        // DD-MM-YY format
        day = first
        month = second
        year = third
      } else if (parseInt(second) > 12) {
        // MM-DD-YY format
        month = first
        day = second
        year = third
      } else {
        // Ambiguous - default to MM-DD-YY (US format)
        month = first
        day = second
        year = third
      }
    }

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

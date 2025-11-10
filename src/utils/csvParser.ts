/**
 * Parses a CSV line that may contain quoted fields with commas
 * Handles:
 * - Quoted fields: "field, with comma"
 * - Unquoted fields: simple field
 * - Mixed: simple,"quoted, field",another
 */
export const parseCSVLine = (line: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  // Add the last field
  result.push(current.trim())

  return result
}

/**
 * Removes UTF-8 BOM (Byte Order Mark) from the beginning of text
 * Excel often adds this to CSV exports
 */
export const removeBOM = (text: string): string => {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1)
  }
  return text
}

/**
 * Parses age strings in various formats:
 * - "5Y2M" -> "5.17" (5 years 2 months ≈ 5.17 years)
 * - "11y2m" -> "11.17"
 * - "2Y3M" -> "2.25"
 * - Empty or invalid -> ""
 *
 * Returns the age string in a consistent format for display
 */
export const parseAgeFormat = (ageStr: string): string => {
  if (!ageStr || !ageStr.trim()) return ''

  const cleaned = ageStr.trim().toUpperCase()

  // Match pattern like "5Y2M" or "11Y" or "2M"
  const yearMatch = cleaned.match(/(\d+)Y/)
  const monthMatch = cleaned.match(/(\d+)M/)

  if (!yearMatch && !monthMatch) {
    // If no Y or M pattern, assume it's just a number
    return cleaned
  }

  // Keep original format for display (e.g., "5Y2M")
  return ageStr.trim()
}

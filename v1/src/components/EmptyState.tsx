import { Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const EmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">Upload a CSV file to get started</p>
        <p className="text-sm text-muted-foreground mt-2">Click the button above to select a file</p>
      </CardContent>
    </Card>
  )
}

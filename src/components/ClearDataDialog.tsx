import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'

interface ClearDataDialogProps {
  onClear: () => void
}

export const ClearDataDialog = ({ onClear }: ClearDataDialogProps) => {
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const REQUIRED_TEXT = 'clear all data'
  const isValid = confirmText.toLowerCase() === REQUIRED_TEXT

  const handleConfirm = () => {
    if (isValid) {
      onClear()
      setOpen(false)
      setConfirmText('')
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setConfirmText('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear All Data</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete all patient records from your session.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm mb-2">
            Type <span className="font-mono font-semibold">{REQUIRED_TEXT}</span> to confirm:
          </p>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={REQUIRED_TEXT}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValid) {
                handleConfirm()
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isValid}>
            Clear All Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

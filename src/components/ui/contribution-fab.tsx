'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ContributionWidget } from '@/components/ui/contribution-widget'

export function ContributionFab() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <Button
        variant="dark-primary"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Ways to contribute"
      >
        <Heart className="w-6 h-6" />
      </Button>

      {/* Popup Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent variant="dark" size="xl" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle variant="dark" className="text-2xl font-display">
              Support SOIL Your Way
            </DialogTitle>
            <DialogDescription variant="dark">
              Every contribution matters. Choose how you&apos;d like to help preserve organizational wisdom.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <ContributionWidget compact />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

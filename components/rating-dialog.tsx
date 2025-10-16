'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface RatingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  institutionId: number | null;
  institutionName: string;
  onRatingSubmitted: () => void;
}

export function RatingDialog({
  isOpen,
  onClose,
  institutionId,
  institutionName,
  onRatingSubmitted,
}: RatingDialogProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!institutionId || rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institution_id: institutionId,
          stars: rating,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Rating submitted!',
          description: 'Thank you for your feedback.',
        });
        onRatingSubmitted();
        onClose();
        setRating(0);
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Rate Institution</DialogTitle>
          <DialogDescription className="text-center">
            How would you rate <strong>{institutionName}</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              interactive
              size="lg"
            />
          </div>
          
          <AnimatePresence>
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-lg font-medium"
              >
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              'Submit Rating'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
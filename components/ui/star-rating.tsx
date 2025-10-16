'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({
  rating = 0,
  onRatingChange,
  interactive = false,
  size = 'md',
  className,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentRating = interactive ? (hoveredRating || rating) : rating;

  return (
    <div className={cn('flex gap-1', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= currentRating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 dark:text-gray-600',
            interactive && 'cursor-pointer hover:scale-110 transition-transform'
          )}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        />
      ))}
    </div>
  );
}
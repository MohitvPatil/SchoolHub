'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Star, GraduationCap, School } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { Institution } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface InstitutionCardProps {
  institution: Institution;
  onRate: (institutionId: number) => void;
}

export function InstitutionCard({ institution, onRate }: InstitutionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="overflow-hidden h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          {institution.image_url ? (
            <Image
              src={institution.image_url}
              alt={institution.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              {institution.type === 'School' ? (
                <School className="w-16 h-16 text-white" />
              ) : (
                <GraduationCap className="w-16 h-16 text-white" />
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                {institution.name}
              </h3>
              <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {institution.type}
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {institution.city}, {institution.state}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <StarRating rating={institution.rating} size="sm" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {institution.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onRate(institution.id);
              }}
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Star className="w-4 h-4 mr-1" />
              Rate
            </Button>
            <Link href={`/institution/${institution.id}`} className="flex-1">
              <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all">
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
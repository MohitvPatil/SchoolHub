'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Users, 
  BookOpen,
  School,
  GraduationCap,
  User,
  Calendar,
  Building,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StarRating } from '@/components/ui/star-rating';
import { RatingDialog } from '@/components/rating-dialog';
import { InstitutionWithDetails } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

interface InstitutionDetailPageProps {
  params: { id: string };
}

export default function InstitutionDetailPage({ params }: InstitutionDetailPageProps) {
  const [institution, setInstitution] = useState<InstitutionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [ratingDialog, setRatingDialog] = useState<{
    isOpen: boolean;
    institutionId: number | null;
    institutionName: string;
  }>({
    isOpen: false,
    institutionId: null,
    institutionName: '',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchInstitution();
  }, [params.id]);

  const fetchInstitution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institutions/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Institution not found');
      }
      
      const data = await response.json();
      setInstitution(data);
    } catch (error) {
      console.error('Error fetching institution:', error);
      toast({
        title: 'Error',
        description: 'Failed to load institution details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRate = () => {
    if (institution) {
      setRatingDialog({
        isOpen: true,
        institutionId: institution.id,
        institutionName: institution.name,
      });
    }
  };

  const handleRatingSubmitted = () => {
    fetchInstitution(); // Refresh to get updated ratings
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Institution not found
          </h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSchool = institution.type === 'School';
  const details = isSchool ? institution.school_details : institution.college_details;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Hero Section */}
          <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="md:flex">
              <div className="md:w-1/3">
                <div className="relative h-64 md:h-full">
                  {institution.image_url ? (
                    <Image
                      src={institution.image_url}
                      alt={institution.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      {isSchool ? (
                        <School className="w-20 h-20 text-white" />
                      ) : (
                        <GraduationCap className="w-20 h-20 text-white" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="secondary" 
                        className={`${isSchool ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}
                      >
                        {institution.type}
                      </Badge>
                      <Button onClick={handleRate} className="flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Rate This {institution.type}</span>
                      </Button>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                      {institution.name}
                    </h1>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="w-5 h-5 mr-2" />
                        {institution.city}, {institution.state}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <StarRating rating={institution.rating} size="lg" />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {institution.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        ({(institution as any).rating_count || 0} ratings)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {institution.contact_number && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                          <p className="text-gray-600 dark:text-gray-300">{institution.contact_number}</p>
                        </div>
                      </div>
                    )}
                    
                    {institution.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="text-gray-600 dark:text-gray-300">{institution.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {institution.address && (
                    <div className="flex items-start space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <MapPin className="w-5 h-5 text-red-600 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Address</p>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{institution.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Academic Information */}
              {details && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Academic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSchool && institution.school_details && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Standards Offered</h4>
                          <p className="text-gray-600 dark:text-gray-300">{institution.school_details.standards_offered}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Curriculum Pattern</h4>
                          <Badge variant="outline">{institution.school_details.pattern}</Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Medium of Instruction</h4>
                          <p className="text-gray-600 dark:text-gray-300">{institution.school_details.medium}</p>
                        </div>
                        
                        {institution.school_details.total_strength && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Total Strength</h4>
                            <p className="text-gray-600 dark:text-gray-300">{institution.school_details.total_strength} students</p>
                          </div>
                        )}
                      </div>
                    )}

                    {!isSchool && institution.college_details && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Field of Study</h4>
                          <p className="text-gray-600 dark:text-gray-300">{institution.college_details.fields}</p>
                        </div>
                        
                        {institution.college_details.subfields && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specializations</h4>
                            <p className="text-gray-600 dark:text-gray-300">{institution.college_details.subfields}</p>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">University Type</h4>
                          <Badge variant="outline">{institution.college_details.university_type}</Badge>
                        </div>
                        
                        {institution.college_details.university_name && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">University</h4>
                            <p className="text-gray-600 dark:text-gray-300">{institution.college_details.university_name}</p>
                          </div>
                        )}
                        
                        {institution.college_details.course_duration && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Course Duration</h4>
                            <p className="text-gray-600 dark:text-gray-300">{institution.college_details.course_duration}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Quick Stats</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Rating</span>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={institution.rating} size="sm" />
                      <span className="font-bold">{institution.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Type</span>
                    <Badge variant={isSchool ? "default" : "secondary"}>
                      {institution.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Location</span>
                    <span className="font-medium text-right">
                      {institution.city}<br />
                      <span className="text-sm text-gray-500">{institution.state}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Leadership */}
              {((isSchool && institution.school_details?.principal_name) || 
                (!isSchool && institution.college_details?.dean_name)) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Leadership</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {isSchool ? institution.school_details?.principal_name : institution.college_details?.dean_name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {isSchool ? 'Principal' : 'Dean'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Button 
                      onClick={handleRate} 
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate This {institution.type}
                    </Button>
                    
                    <Link href="/add-institution" className="block">
                      <Button variant="outline" className="w-full">
                        Add Another Institution
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Rating Dialog */}
      <RatingDialog
        isOpen={ratingDialog.isOpen}
        onClose={() => setRatingDialog({ isOpen: false, institutionId: null, institutionName: '' })}
        institutionId={ratingDialog.institutionId}
        institutionName={ratingDialog.institutionName}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
}
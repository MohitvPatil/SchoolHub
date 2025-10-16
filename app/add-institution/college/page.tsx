'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Save, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { collegeSchema, CollegeFormData } from '@/lib/validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddCollegePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
  });

  const onSubmit = async (data: CollegeFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'College' }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'College added successfully!',
          description: 'Thank you for contributing to our directory.',
        });
        router.push('/');
      } else {
        throw new Error(result.error || 'Failed to add college');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add college. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/add-institution">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add College
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fill in the college details
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                College Information
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Provide comprehensive details about the college to help others discover it
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Basic Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">College Name *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter college name"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url">College Image URL</Label>
                      <Input
                        id="image_url"
                        {...register('image_url')}
                        placeholder="https://example.com/college-image.jpg"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.image_url && (
                        <p className="text-sm text-red-600">{errors.image_url.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register('city')}
                        placeholder="Enter city"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.city && (
                        <p className="text-sm text-red-600">{errors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        {...register('state')}
                        placeholder="Enter state"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.state && (
                        <p className="text-sm text-red-600">{errors.state.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      placeholder="Enter complete address"
                      className="bg-white dark:bg-gray-800"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Contact Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact_number">Contact Number *</Label>
                      <Input
                        id="contact_number"
                        {...register('contact_number')}
                        placeholder="+91 XXXXXXXXXX"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.contact_number && (
                        <p className="text-sm text-red-600">{errors.contact_number.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="college@example.com"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Academic Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fields">Field of Study *</Label>
                      <Input
                        id="fields"
                        {...register('fields')}
                        placeholder="e.g., Engineering, Medical, Arts"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.fields && (
                        <p className="text-sm text-red-600">{errors.fields.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subfields">Specializations/Subfields</Label>
                      <Input
                        id="subfields"
                        {...register('subfields')}
                        placeholder="e.g., Computer Science, Mechanical"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.subfields && (
                        <p className="text-sm text-red-600">{errors.subfields.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="university_type">University Type *</Label>
                      <Select onValueChange={(value) => setValue('university_type', value as any)}>
                        <SelectTrigger className="bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select university type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Autonomous">Autonomous</SelectItem>
                          <SelectItem value="Affiliated">Affiliated</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.university_type && (
                        <p className="text-sm text-red-600">{errors.university_type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="university_name">University Name *</Label>
                      <Input
                        id="university_name"
                        {...register('university_name')}
                        placeholder="Enter university name"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.university_name && (
                        <p className="text-sm text-red-600">{errors.university_name.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Additional Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="course_duration">Course Duration</Label>
                      <Input
                        id="course_duration"
                        {...register('course_duration')}
                        placeholder="e.g., 4 years, 2 years"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.course_duration && (
                        <p className="text-sm text-red-600">{errors.course_duration.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dean_name">Dean Name</Label>
                      <Input
                        id="dean_name"
                        {...register('dean_name')}
                        placeholder="Dean's full name"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.dean_name && (
                        <p className="text-sm text-red-600">{errors.dean_name.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding College...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-5 h-5" />
                        <span>Add College to Directory</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
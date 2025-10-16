'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, School, Save, Loader as Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import { schoolSchema, SchoolFormData } from '@/lib/validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddSchoolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
  });

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'School' }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'School added successfully!',
          description: 'Thank you for contributing to our directory.',
        });
        router.push('/');
      } else {
        throw new Error(result.error || 'Failed to add school');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add school. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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
                <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl">
                  <School className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add School
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Fill in the school details
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
                School Information
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Provide comprehensive details about the school to help others discover it
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
                      <Label htmlFor="name">School Name *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="Enter school name"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url">School Image URL</Label>
                      <Input
                        id="image_url"
                        {...register('image_url')}
                        placeholder="https://example.com/school-image.jpg"
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
                        placeholder="school@example.com"
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
                      <Label htmlFor="standards_offered">Standards Offered *</Label>
                      <Input
                        id="standards_offered"
                        {...register('standards_offered')}
                        placeholder="e.g., LKG-12th, 6th-10th"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.standards_offered && (
                        <p className="text-sm text-red-600">{errors.standards_offered.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pattern">Curriculum Pattern *</Label>
                      <Select onValueChange={(value) => setValue('pattern', value as any)}>
                        <SelectTrigger className="bg-white dark:bg-gray-800">
                          <SelectValue placeholder="Select curriculum" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CBSE">CBSE</SelectItem>
                          <SelectItem value="ICSE">ICSE</SelectItem>
                          <SelectItem value="State">State Board</SelectItem>
                          <SelectItem value="IB">International Baccalaureate</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.pattern && (
                        <p className="text-sm text-red-600">{errors.pattern.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medium">Medium of Instruction *</Label>
                    <Input
                      id="medium"
                      {...register('medium')}
                      placeholder="e.g., English, Hindi, Tamil"
                      className="bg-white dark:bg-gray-800"
                    />
                    {errors.medium && (
                      <p className="text-sm text-red-600">{errors.medium.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Additional Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="total_strength">Total Student Strength</Label>
                      <Input
                        id="total_strength"
                        type="number"
                        {...register('total_strength', { valueAsNumber: true })}
                        placeholder="Number of students"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.total_strength && (
                        <p className="text-sm text-red-600">{errors.total_strength.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="principal_name">Principal Name</Label>
                      <Input
                        id="principal_name"
                        {...register('principal_name')}
                        placeholder="Principal's full name"
                        className="bg-white dark:bg-gray-800"
                      />
                      {errors.principal_name && (
                        <p className="text-sm text-red-600">{errors.principal_name.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding School...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-5 h-5" />
                        <span>Add School to Directory</span>
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
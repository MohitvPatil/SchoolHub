'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, School, GraduationCap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

export default function AddInstitutionPage() {
  const [selectedType, setSelectedType] = useState<'School' | 'College' | null>(null);

  const institutionCards = [
    {
      type: 'School' as const,
      icon: School,
      title: 'Add School',
      description:
        'Add primary and secondary schools with curriculum details, patterns, and facilities.',
      features: ['Standards offered', 'Curriculum pattern', 'Medium of instruction', 'Principal details'],
      gradient: 'from-blue-500 to-cyan-500',
      path: '/add-institution/school',
    },
    {
      type: 'College' as const,
      icon: GraduationCap,
      title: 'Add College',
      description:
        'Add colleges and universities with course information, specializations, and faculty details.',
      features: ['Field of study', 'Specializations', 'University type', 'Dean information'],
      gradient: 'from-purple-500 to-pink-500',
      path: '/add-institution/college',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Add Institution
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Help grow our educational directory
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedType ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center space-y-6 mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                What would you like to add?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the type of educational institution you want to add to our directory. 
                Your contribution helps others discover quality education options.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {institutionCards.map(({ type, icon: Icon, title, description, features, gradient, path }) => (
                <motion.div
                  key={type}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="h-full cursor-pointer group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                  >
                    <CardHeader className="text-center pb-4">
                      <div className={`mx-auto p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                        {description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-center">
                          Information Required:
                        </h4>
                        <ul className="space-y-2">
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient} mr-3`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Link href={path}>
                        <Button 
                          className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 py-6 text-lg font-medium group-hover:scale-105 transition-transform`}
                        >
                          {title}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Why Add an Institution?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Help students and parents discover quality educational options in their area. 
                  Your contributions make our directory more comprehensive and valuable for everyone.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GraduationCap, School, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { InstitutionCard } from '@/components/institution-card';
import { RatingDialog } from '@/components/rating-dialog';
import { SearchFilters } from '@/components/search-filters';
import { Institution, FilterOptions, PaginationInfo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function Home() {
  const [activeType, setActiveType] = useState<'School' | 'College'>('School');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ type: 'School' });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [filterOptions, setFilterOptions] = useState<any>({});
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

  // Initialize database on component mount
  useEffect(() => {
    const initDB = async () => {
      try {
        const response = await fetch('/api/init-db');
        if (!response.ok) {
          throw new Error('Failed to initialize database');
        }
      } catch (error) {
        console.error('Database initialization error:', error);
        toast({
          title: 'Database Error',
          description: 'Failed to initialize database. Some features may not work properly.',
          variant: 'destructive',
        });
      }
    };

    initDB();
  }, [toast]);

  // Fetch institutions
  useEffect(() => {
    fetchInstitutions(true);
  }, [filters]);

  // Fetch filter options when type changes
  useEffect(() => {
    fetchFilterOptions();
  }, [activeType]);

  // Update filters when type changes
  useEffect(() => {
    setFilters({ type: activeType });
  }, [activeType]);

  const fetchInstitutions = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const page = reset ? 1 : pagination.page + 1;
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        type: activeType,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v && v !== '')
        ),
      });

      const response = await fetch(`/api/institutions?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch institutions');

      const data = await response.json();
      
      setInstitutions(reset ? data.institutions : [...institutions, ...data.institutions]);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load institutions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`/api/filters?type=${activeType}`);
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleRate = (institutionId: number) => {
    const institution = institutions.find(i => i.id === institutionId);
    if (institution) {
      setRatingDialog({
        isOpen: true,
        institutionId,
        institutionName: institution.name,
      });
    }
  };

  const handleRatingSubmitted = () => {
    fetchInstitutions(true); // Refresh to get updated ratings
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters({ ...newFilters, type: activeType });
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages && !loadingMore) {
      fetchInstitutions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  EduDirectory
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Find & Rate Educational Institutions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/add-institution">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Institution
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Toggle Section */}
        <div className="mb-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Discover Quality Education
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                Explore schools and colleges across India. Find the perfect institution for your educational journey.
              </p>
            </div>

            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
              {[
                { type: 'School' as const, icon: School, label: 'Schools' },
                { type: 'College' as const, icon: GraduationCap, label: 'Colleges' },
              ].map(({ type, icon: Icon, label }) => (
                <motion.button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all relative overflow-hidden ${
                    activeType === type
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeType === type && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{label}</span>
                </motion.button>
              ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {activeType === 'School' ? (
                      <School className="w-5 h-5" />
                    ) : (
                      <GraduationCap className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total {activeType}s</p>
                    <p className="text-2xl font-bold">{pagination.total}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Cities Covered</p>
                    <p className="text-2xl font-bold">{filterOptions.cities?.length || 0}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">States Covered</p>
                    <p className="text-2xl font-bold">{filterOptions.states?.length || 0}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            type={activeType}
            cities={filterOptions.cities || []}
            states={filterOptions.states || []}
            patterns={filterOptions.patterns || []}
            fields={filterOptions.fields || []}
          />
        </div>

        {/* Institutions Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <LoadingSpinner size="lg" />
            </motion.div>
          ) : institutions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">
                {activeType === 'School' ? '🏫' : '🎓'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No {activeType}s Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                We couldn't find any {activeType.toLowerCase()}s matching your criteria. 
                Try adjusting your filters or be the first to add one!
              </p>
              <Link href="/add-institution">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add {activeType}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="institutions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeType}s
                  </h3>
                  <Badge variant="secondary" className="px-3 py-1">
                    {pagination.total} found
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {institutions.map((institution, index) => (
                  <motion.div
                    key={institution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InstitutionCard
                      institution={institution}
                      onRate={handleRate}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              {pagination.page < pagination.totalPages && (
                <div className="text-center pt-8">
                  <Button
                    onClick={loadMore}
                    disabled={loadingMore}
                    variant="outline"
                    className="px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {loadingMore ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      `Load More ${activeType}s`
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
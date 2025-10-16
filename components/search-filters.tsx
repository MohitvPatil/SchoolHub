'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterOptions } from '@/lib/types';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  type: 'School' | 'College';
  cities: string[];
  states: string[];
  patterns?: string[];
  fields?: string[];
}

export function SearchFilters({
  filters,
  onFiltersChange,
  type,
  cities,
  states,
  patterns = [],
  fields = [],
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  useEffect(() => {
    const debounce = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchValue });
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchValue]);

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({ type });
  };

  const removeFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder={`Search ${type.toLowerCase()}s...`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-4 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {Object.entries(filters).map(([key, value]) => {
              if (!value || key === 'type') return null;
              return (
                <Badge
                  key={key}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {key}: {value}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeFilter(key as keyof FilterOptions)}
                  />
                </Badge>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* City Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City</label>
                    <Select
                      value={filters.city || ''}
                      onValueChange={(value) =>
                        onFiltersChange({ ...filters, city: value || undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All cities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All cities</SelectItem>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* State Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <Select
                      value={filters.state || ''}
                      onValueChange={(value) =>
                        onFiltersChange({ ...filters, state: value || undefined })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All states" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All states</SelectItem>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pattern Filter (Schools) */}
                  {type === 'School' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pattern</label>
                      <Select
                        value={filters.pattern || ''}
                        onValueChange={(value) =>
                          onFiltersChange({ ...filters, pattern: value || undefined })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All patterns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All patterns</SelectItem>
                          {patterns.map((pattern) => (
                            <SelectItem key={pattern} value={pattern}>
                              {pattern}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Fields Filter (Colleges) */}
                  {type === 'College' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Field</label>
                      <Select
                        value={filters.fields || ''}
                        onValueChange={(value) =>
                          onFiltersChange({ ...filters, fields: value || undefined })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All fields" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All fields</SelectItem>
                          {fields.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rating</label>
                    <Select
                      value={filters.rating?.toString() || ''}
                      onValueChange={(value) =>
                        onFiltersChange({
                          ...filters,
                          rating: value ? parseInt(value) : undefined,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any rating</SelectItem>
                        <SelectItem value="1">1+ stars</SelectItem>
                        <SelectItem value="2">2+ stars</SelectItem>
                        <SelectItem value="3">3+ stars</SelectItem>
                        <SelectItem value="4">4+ stars</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
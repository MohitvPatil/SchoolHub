import { z } from 'zod';

export const schoolSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contact_number: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid contact number'),
  email: z.string().email('Please enter a valid email address'),
  standards_offered: z.string().min(1, 'Please specify standards offered'),
  pattern: z.enum(['CBSE', 'ICSE', 'State', 'IB', 'Other'], {
    required_error: 'Please select a pattern',
  }),
  medium: z.string().min(1, 'Please specify medium of instruction'),
  total_strength: z.number().positive().optional().or(z.literal('')),
  principal_name: z.string().optional().or(z.literal('')),
});

export const collegeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  contact_number: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Please enter a valid contact number'),
  email: z.string().email('Please enter a valid email address'),
  fields: z.string().min(1, 'Please specify the field'),
  subfields: z.string().optional().or(z.literal('')),
  university_type: z.enum(['Autonomous', 'Affiliated'], {
    required_error: 'Please select university type',
  }),
  university_name: z.string().min(1, 'University name is required'),
  course_duration: z.string().optional().or(z.literal('')),
  dean_name: z.string().optional().or(z.literal('')),
});

export const ratingSchema = z.object({
  institution_id: z.number().positive(),
  stars: z.number().min(1).max(5),
});

export type SchoolFormData = z.infer<typeof schoolSchema>;
export type CollegeFormData = z.infer<typeof collegeSchema>;
export type RatingFormData = z.infer<typeof ratingSchema>;
export interface Institution {
  id: number;
  name: string;
  type: 'School' | 'College';
  image_url?: string;
  city: string;
  state: string;
  address?: string;
  contact_number?: string;
  email?: string;
  rating: number;
  created_at: string;
}

export interface SchoolDetails {
  id?: number;
  institution_id: number;
  standards_offered: string;
  pattern: 'CBSE' | 'ICSE' | 'State' | 'IB' | 'Other';
  medium: string;
  total_strength?: number;
  principal_name?: string;
}

export interface CollegeDetails {
  id?: number;
  institution_id: number;
  fields: string;
  subfields?: string;
  university_type: 'Autonomous' | 'Affiliated';
  university_name?: string;
  course_duration?: string;
  dean_name?: string;
}

export interface Rating {
  id?: number;
  institution_id: number;
  stars: number;
  user_ip?: string;
  created_at?: string;
}

export interface InstitutionWithDetails extends Institution {
  school_details?: SchoolDetails;
  college_details?: CollegeDetails;
}

export interface FilterOptions {
  type?: 'School' | 'College';
  city?: string;
  state?: string;
  pattern?: string;
  fields?: string;
  rating?: number;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
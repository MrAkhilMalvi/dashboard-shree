// For metric sections
export interface DashboardStats {
  total_student: number;
  total_school: number;
  total_student_down: number;
  total_school_down: number;
  total_school_pen: number;
  total_student_pen: number;
  total_ao: number;
  down_ao: number;
  pen_ao: number;
}

// For dashboard cards metadata
export interface MetricField {
  label: string;
  color: string;
  icon: string;
  category: 'primary' | 'success' | 'warning' | 'info' | 'secondary';
   percentageOf?: string;
  percentageLabel?: string;
}

export interface DashboardSection {
  id: string;
  label: string;
  url: string;
  color: string;
}

// For metric fetch response
export interface ApiResponse {
  status: 'loading' | 'success' | 'error';
  data?: DashboardStats;
  error?: string;
}

//For table rows
export interface TableRow {
  dist_id:number;
  code: string;
  name: string;
  dist_name: string;
  mobileno: string;
  pdf_count: number;
}

 //For table fetch response
export interface TableApiResponse {
  status: 'loading' | 'success' | 'error';
  data?: TableRow[];
  error?: string;
}

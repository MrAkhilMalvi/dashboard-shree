import { Users, Building2, Download, Clock,  UserCheck } from 'lucide-react';
import { MetricField, DashboardSection } from '../types/dashboard';

export const fieldMap: Record<string, MetricField & { iconComponent: any }> = {
  total_student: { 
    label: 'Total Students', 
    color: '#10b981', 
    icon: 'users', 
    category: 'success',
    iconComponent: Users
  },
  total_student_down: { 
    label: 'Downloaded Students', 
    color: '#6366f1', 
    icon: 'download', 
    category: 'success',
    iconComponent: Download
  },
  total_student_pen: { 
    label: 'Pending Students', 
    color: '#f59e0b', 
    icon: 'clock', 
    category: 'success',
    iconComponent: Clock
  },
  // total_ht: { 
  //   label: 'Total HTs', 
  //   color: '#22d3ee', 
  //   icon: 'users-round', 
  //   category: 'info',
  //   iconComponent: UsersRound
  // },
  total_school: { 
    label: 'Total Schools', 
    color: '#10b981', 
    icon: 'building2', 
    category: 'info',
    iconComponent: Building2
  },
  total_school_down: { 
    label: 'Downloaded Schools', 
    color: '#3b82f6', 
    icon: 'download', 
    category: 'info',
    iconComponent: Download
  },
  total_school_pen: { 
    label: 'Pending Schools', 
    color: '#f59e0b', 
    icon: 'clock', 
    category: 'info',
    iconComponent: Clock
  },
  // down_ht: { 
  //   label: 'Downloaded HTs', 
  //   color: '#4f46e5', 
  //   icon: 'cloud-done', 
  //   category: 'primary',
  //   iconComponent: CloudDone
  // },
  total_ao: { 
    label: 'Total AOs', 
    color: '#14b8a6', 
    icon: 'user-check', 
    category: 'warning',
    iconComponent: UserCheck
  },
  down_ao: { 
    label: 'Downloaded AOs', 
    color: '#3b82f6', 
    icon: 'check-circle', 
    category: 'warning',
    iconComponent: Download
  },
  pen_ao: { 
    label: 'Pending AOs', 
    color: '#f59e0b', 
    icon: 'clock', 
    category: 'warning',
    iconComponent: Clock
  },
  // pen_ht: { 
  //   label: 'Pending HTs', 
  //   color: '#f87171', 
  //   icon: 'watch', 
  //   category: 'warning',
  //   iconComponent: WatchIcon
  // },
};

export const sections: DashboardSection[] = [
  { 
    id: 'general', 
    label: 'GENERAL', 
    url: 'http://192.168.0.58:3000/dashboard/gen',
    color: '#3b82f6'
  },
  { 
    id: 'science', 
    label: 'SCIENCE', 
    url: 'http://192.168.0.58:3000/dashboard/sci',
    color: '#10b981'
  },
  { 
    id: 'ssc', 
    label: 'SSC', 
    url: 'http://192.168.0.58:3000/dashboard/ssc',
    color: '#f59e0b'
  },
  {
    id: 'general-table',
    label: 'General School List',
    url: 'http://192.168.0.58:3000/gen/school_not_down_ls',
    color: '#3b82f6',
  },
  {
    id: 'science-table',
    label: 'Science School List',
    url: 'http://192.168.0.58:3000/sci/school_not_down_ls',
    color: '#10b981',
  },
  {
    id: 'ssc-table',
    label: 'SSC School List',
    url: 'http://192.168.0.58:3000/ssc/school_not_down_ls',
    color: '#f59e0b',
  },
];
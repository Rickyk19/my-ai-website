import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CogIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  CalendarIcon,
  BellIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  XMarkIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import RichTextEditor from '../components/RichTextEditor';
import { supabase } from '../utils/supabase';

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalComments: number;
  totalNewsletterSubscribers: number;
  totalFeedback: number;
  totalRevenue: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'moderator' | 'content-manager' | 'analyst';
  permissions: {
    canManageUsers: boolean;
    canManageContent: boolean;
    canManageSettings: boolean;
    canViewAnalytics: boolean;
    canManageOrders: boolean;
    canManageCategories: boolean;
    canDeletePages: boolean;
    canEditPages: boolean;
    canCreatePages: boolean;
  };
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalComments: 0,
    totalNewsletterSubscribers: 0,
    totalFeedback: 0,
    totalRevenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [showPageModal, setShowPageModal] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [showDeletePageModal, setShowDeletePageModal] = useState(false);
  const [showEditPageModal, setShowEditPageModal] = useState(false);
  const [selectedPageForEdit, setSelectedPageForEdit] = useState<any>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ courseName: '', amount: '', customerName: '', customerEmail: '' });
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ title: '', description: '' });
  const [customSections, setCustomSections] = useState<{[key: string]: {title: string, path: string}[]}>({});
  
  // Delete Course States
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourseToDelete, setSelectedCourseToDelete] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Admin Management States
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showManageAdminsModal, setShowManageAdminsModal] = useState(false);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [selectedAdminForEdit, setSelectedAdminForEdit] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: 1,
      name: 'Super Admin',
      email: 'sm@ptuniverse.com',
      role: 'super-admin',
      permissions: {
        canManageUsers: true,
        canManageContent: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canManageOrders: true,
        canManageCategories: true,
        canDeletePages: true,
        canEditPages: true,
        canCreatePages: true,
      },
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-01-20'
    }
  ]);
  const [newAdmin, setNewAdmin] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    role: 'admin',
    permissions: {
      canManageUsers: false,
      canManageContent: true,
      canManageSettings: false,
      canViewAnalytics: true,
      canManageOrders: false,
      canManageCategories: false,
      canDeletePages: false,
      canEditPages: true,
      canCreatePages: true,
    },
    status: 'active'
  });
  
  // Define all sidebar sections and their pages
  const allSidebarSections = {
    ...customSections,
    'AI Explained': [
      { title: 'Types of AI', path: '/ai-explained/types' },
      { title: 'ML', path: '/ai-explained/ml' },
      { title: 'DL & NNs', path: '/ai-explained/dl-nn' },
      { title: 'Agents', path: '/ai-explained/agents' },
      { title: 'RL', path: '/ai-explained/rl' },
      { title: 'Robotics', path: '/ai-explained/robotics' },
      { title: 'AI in Industry', path: '/ai-explained/industry' },
      { title: 'Ethics & Governance', path: '/ai-explained/ethics' },
      { title: 'YT Lectures', path: '/ai-explained/lectures' },
      { title: 'Resources', path: '/ai-explained/resources' },
    ],
    'Solutions': [
      { title: 'Enroll in Courses', path: '/solutions/courses' },
      { title: 'Great Game AI', path: '/solutions/game-ai' },
      { title: 'National AI Roadmap', path: '/solutions/roadmap' },
    ],
    'Trends': [
      { title: 'News', path: '/trends/news' },
      { title: 'Debates', path: '/trends/debates' },
      { title: 'Innovations', path: '/trends/innovations' },
      { title: 'AI in Industry', path: '/trends/industry' },
      { title: 'Resources', path: '/trends/resources' },
    ],
    'Data Lab': [
      { title: 'Learn About Data', path: '/data-lab/learn' },
      { title: 'Datasets', path: '/data-lab/datasets' },
      { title: 'Sources', path: '/data-lab/sources' },
    ],
    'AGI': [
      { title: 'What is AGI', path: '/agi/what-is-agi' },
      { title: 'Brain & AI', path: '/agi/brain-ai' },
      { title: 'Future of Intelligence', path: '/agi/future' },
    ],
    'AI Resources': [
      { title: 'Books', path: '/resources/books' },
      { title: 'Papers', path: '/resources/papers' },
      { title: 'Lectures', path: '/resources/lectures' },
      { title: 'OGs', path: '/resources/ogs' },
    ],
  };
  
  const [pages, setPages] = useState([
    { id: 1, title: 'Home', path: '/', status: 'published', lastModified: '2024-01-15', content: 'Welcome to Billion Hopes homepage', image: null as string | null, section: 'Main' },
    { id: 2, title: 'Courses', path: '/courses', status: 'published', lastModified: '2024-01-14', content: 'AI and ML courses for everyone', image: null as string | null, section: 'Main' },
    { id: 3, title: 'Types of AI', path: '/ai-explained/types', status: 'published', lastModified: '2024-01-13', content: 'Learn about different types of AI', image: null as string | null, section: 'AI Explained' },
    { id: 4, title: 'Feedback', path: '/feedback', status: 'published', lastModified: '2024-01-12', content: 'Share your feedback with us', image: null as string | null, section: 'Main' },
    { id: 5, title: 'Dashboard', path: '/dashboard', status: 'published', lastModified: '2024-01-11', content: 'Admin dashboard for website management', image: null as string | null, section: 'Main' }
  ]);
  const [newPage, setNewPage] = useState({ title: '', path: '', content: '', image: null as File | null, imagePreview: '', section: '' });
  const quickAddRef = useRef<HTMLDivElement>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showQuickAddMenu && quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setShowQuickAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickAddMenu]);

  const loadRecentActivity = async () => {
    try {
      const activities: RecentActivity[] = [];

      // Load recent comments
      const commentsRes = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/comments?select=*&order=created_at.desc&limit=3', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });

      if (commentsRes.ok) {
        const comments = await commentsRes.json();
        comments.forEach((comment: any, index: number) => {
          activities.push({
            id: activities.length + 1,
            type: 'comment',
            description: `New comment on Types of AI: "${comment.Comment?.substring(0, 50)}${comment.Comment?.length > 50 ? '...' : ''}"`,
            timestamp: formatTimeAgo(comment.created_at),
            user: comment.Name || 'Anonymous'
          });
        });
      }

      // Load recent newsletter subscriptions
      const subscribersRes = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/newsletter%20subscribers?select=*&order=created_at.desc&limit=3', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });

      if (subscribersRes.ok) {
        const subscribers = await subscribersRes.json();
        subscribers.forEach((subscriber: any) => {
          activities.push({
            id: activities.length + 1,
            type: 'subscription',
            description: 'New newsletter subscription',
            timestamp: formatTimeAgo(subscriber.created_at),
            user: subscriber.email || 'Anonymous'
          });
        });
      }

      // Load recent feedback
      const feedbackRes = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/feedback?select=*&order=created_at.desc&limit=3', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });

      if (feedbackRes.ok) {
        const feedback = await feedbackRes.json();
        feedback.forEach((item: any) => {
          activities.push({
            id: activities.length + 1,
            type: 'feedback',
            description: `New feedback: "${item.Message?.substring(0, 50)}${item.Message?.length > 50 ? '...' : ''}"`,
            timestamp: formatTimeAgo(item.created_at),
            user: item.Name || 'Anonymous'
          });
        });
      }

      // Load recent users (if any)
      const usersRes = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/users?select=*&order=created_at.desc&limit=2', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });

      if (usersRes.ok) {
        const users = await usersRes.json();
        users.forEach((user: any) => {
          activities.push({
            id: activities.length + 1,
            type: 'user',
            description: `New user registered: ${user.role}`,
            timestamp: formatTimeAgo(user.created_at),
            user: user.name || user.email || 'Anonymous'
          });
        });
      }

      // Sort activities by timestamp (most recent first) and take top 5
      activities.sort((a, b) => {
        const timeA = parseTimeAgo(a.timestamp);
        const timeB = parseTimeAgo(b.timestamp);
        return timeA - timeB;
      });

      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error loading recent activity:', error);
      // Fallback to empty array if there's an error
      setRecentActivity([]);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  const parseTimeAgo = (timeString: string): number => {
    const parts = timeString.split(' ');
    const num = parseInt(parts[0]);
    const unit = parts[1];
    
    if (unit.startsWith('minute')) return num;
    if (unit.startsWith('hour')) return num * 60;
    if (unit.startsWith('day')) return num * 60 * 24;
    
    return 0;
  };

  const calculateTotalRevenue = async (): Promise<number> => {
    try {
      // Try to get revenue from purchases/orders table
      const ordersRes = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/orders?select=amount', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ'
        }
      });

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        const totalRevenue = orders.reduce((sum: number, order: any) => {
          return sum + (parseFloat(order.amount) || 0);
        }, 0);
        return totalRevenue;
      } else {
        // If orders table doesn't exist, try to calculate from localStorage purchases
        // This is a fallback for existing course purchases
        const purchasedCourses = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
        
        // Course prices (you can update these to match your actual prices)
        const coursePrices: { [key: string]: number } = {
          'ai-fundamentals': 999,
          'machine-learning-basics': 1299,
          'deep-learning-advanced': 1999,
          'nlp-processing': 1599,
          'computer-vision': 1799,
          'ai-ethics-future': 899
        };

        let localRevenue = 0;
        purchasedCourses.forEach((courseId: string) => {
          localRevenue += coursePrices[courseId] || 0;
        });

        return localRevenue;
      }
    } catch (error) {
      console.error('Error calculating revenue:', error);
      return 0; // Return 0 if there's an error
    }
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats from all tables
      const [commentsRes, subscribersRes, feedbackRes, usersRes] = await Promise.all([
        fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/comments?select=count', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Prefer': 'count=exact'
          }
        }),
        fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/newsletter%20subscribers?select=count', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Prefer': 'count=exact'
          }
        }),
        fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/feedback?select=count', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Prefer': 'count=exact'
          }
        }),
        fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/users?select=count', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Prefer': 'count=exact'
          }
        })
      ]);

      // Get counts from response headers
      const commentsCount = parseInt(commentsRes.headers.get('Content-Range')?.split('/')[1] || '0');
      const subscribersCount = parseInt(subscribersRes.headers.get('Content-Range')?.split('/')[1] || '0');
      const feedbackCount = parseInt(feedbackRes.headers.get('Content-Range')?.split('/')[1] || '0');
      const usersCount = parseInt(usersRes.headers.get('Content-Range')?.split('/')[1] || '0');

      setStats({
        totalUsers: usersCount, // Real data from users table
        totalCourses: 6, // Based on your current courses
        totalComments: commentsCount,
        totalNewsletterSubscribers: subscribersCount,
        totalFeedback: feedbackCount,
        totalRevenue: await calculateTotalRevenue() // Real revenue from course purchases
      });

      // Load real recent activity
      await loadRecentActivity();

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Add functions
  const handleQuickAdd = (type: string) => {
    setShowQuickAddMenu(false);
    switch (type) {
      case 'course':
        navigate('/add-course');
        break;
      case 'page':
        setShowPageModal(true);
        break;
      case 'post':
        alert('Navigate to Blog Post Creation - Feature coming soon!');
        break;
      case 'user':
        setShowAddUserModal(true);
        break;
      case 'announcement':
        alert('Navigate to Announcement Creation - Feature coming soon!');
        break;
      case 'edit-page':
        setShowEditPageModal(true);
        break;
      case 'delete-page':
        setShowDeletePageModal(true);
        break;
      case 'order':
        setShowAddOrderModal(true);
        break;
      case 'add-category':
        setShowAddCategoryModal(true);
        break;
      case 'manage-categories':
        setShowManageCategoriesModal(true);
        break;
      case 'admin':
        setShowAddAdminModal(true);
        break;
      case 'manage-admins':
        setShowManageAdminsModal(true);
        break;
      case 'delete-course':
        loadAvailableCourses();
        setShowDeleteCourseModal(true);
        break;
      default:
        // Handle section-based actions
        if (type.startsWith('add-') || type.startsWith('view-') || type.startsWith('edit-') || type.startsWith('delete-')) {
          const [action, section] = type.split('-', 2);
          setSelectedSection(section);
          setShowSectionModal(true);
        }
        break;
    }
  };

  // Section management functions
  const handleSectionAction = (action: string, section: string, pageTitle?: string) => {
    switch (action) {
      case 'add':
        setNewPage({
          title: '',
          path: '',
          content: '',
          image: null,
          imagePreview: '',
          section: section
        });
        setShowPageModal(true);
        setShowSectionModal(false);
        break;
      case 'view':
        // Show pages for this section
        const sectionPages = pages.filter(page => page.section === section);
        alert(`${section} pages:\n${sectionPages.map(p => `• ${p.title} (${p.path})`).join('\n') || 'No pages found'}`);
        setShowSectionModal(false);
        break;
      case 'edit':
        // Show page selection for editing
        const editablePages = pages.filter(page => page.section === section);
        if (editablePages.length === 0) {
          alert(`No pages found in ${section} section`);
          setShowSectionModal(false);
          return;
        }
        setShowEditPageModal(true);
        setShowSectionModal(false);
        break;
      case 'delete':
        // Show page selection for deletion
        const deletablePages = pages.filter(page => page.section === section);
        if (deletablePages.length === 0) {
          alert(`No pages found in ${section} section`);
          setShowSectionModal(false);
          return;
        }
        setShowDeletePageModal(true);
        setShowSectionModal(false);
        break;
    }
  };

  // Category management functions
  const handleCreateCategory = () => {
    if (newCategory.title.trim()) {
      const categoryKey = newCategory.title;
      const newSections = {
        ...customSections,
        [categoryKey]: []
      };
      setCustomSections(newSections);
      setNewCategory({ title: '', description: '' });
      setShowAddCategoryModal(false);
      alert(`Category "${categoryKey}" created successfully! You can now add pages to this section.`);
    }
  };

  // Admin management functions
  const handleCreateAdmin = () => {
    if (newAdmin.name && newAdmin.email && newAdmin.role) {
      alert(`Admin "${newAdmin.name}" would be created with ${newAdmin.role} role!`);
      setShowAddAdminModal(false);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleEditAdmin = (adminId: number) => {
    const adminToEdit = admins.find(admin => admin.id === adminId);
    if (adminToEdit) {
      alert(`Edit functionality for ${adminToEdit.name} - Coming soon!`);
    }
  };

  const handleUpdateAdmin = () => {
    alert('Update admin functionality - Coming soon!');
  };

  const handleDeleteAdmin = (adminId: number) => {
    const adminToDelete = admins.find(admin => admin.id === adminId);
    if (adminToDelete) {
      if (adminToDelete.role === 'super-admin') {
        alert('Cannot delete Super Admin account!');
        return;
      }
      alert(`Delete functionality for ${adminToDelete.name} - Coming soon!`);
    }
  };

  const handleToggleAdminStatus = (adminId: number) => {
    const admin = admins.find(admin => admin.id === adminId);
    if (admin) {
      alert(`Toggle status functionality for ${admin.name} - Coming soon!`);
    }
  };

  // Course deletion functions
  const loadAvailableCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name, status, instructor, fees')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading courses:', error);
        alert('Failed to load courses. Please try again.');
        return;
      }

      setAvailableCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Failed to load courses. Please check your connection.');
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseToDelete) {
      alert('Please select a course to delete.');
      return;
    }

    const courseToDelete = availableCourses.find(course => course.id.toString() === selectedCourseToDelete);
    if (!courseToDelete) {
      alert('Selected course not found.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the course "${courseToDelete.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', selectedCourseToDelete);

      if (error) {
        throw new Error(error.message);
      }

      alert(`Course "${courseToDelete.name}" has been deleted successfully!`);
      
      // Reset and close modal
      setSelectedCourseToDelete('');
      setShowDeleteCourseModal(false);
      
      // Reload dashboard data to update stats
      loadDashboardData();
      
    } catch (error: any) {
      console.error('Error deleting course:', error);
      alert(`Failed to delete course: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getRolePermissions = (role: AdminUser['role']) => {
    switch (role) {
      case 'super-admin':
        return {
          canManageUsers: true,
          canManageContent: true,
          canManageSettings: true,
          canViewAnalytics: true,
          canManageOrders: true,
          canManageCategories: true,
          canDeletePages: true,
          canEditPages: true,
          canCreatePages: true,
        };
      case 'admin':
        return {
          canManageUsers: true,
          canManageContent: true,
          canManageSettings: false,
          canViewAnalytics: true,
          canManageOrders: true,
          canManageCategories: true,
          canDeletePages: true,
          canEditPages: true,
          canCreatePages: true,
        };
      case 'moderator':
        return {
          canManageUsers: false,
          canManageContent: true,
          canManageSettings: false,
          canViewAnalytics: false,
          canManageOrders: false,
          canManageCategories: false,
          canDeletePages: false,
          canEditPages: true,
          canCreatePages: true,
        };
      case 'content-manager':
        return {
          canManageUsers: false,
          canManageContent: true,
          canManageSettings: false,
          canViewAnalytics: false,
          canManageOrders: false,
          canManageCategories: true,
          canDeletePages: false,
          canEditPages: true,
          canCreatePages: true,
        };
      case 'analyst':
        return {
          canManageUsers: false,
          canManageContent: false,
          canManageSettings: false,
          canViewAnalytics: true,
          canManageOrders: false,
          canManageCategories: false,
          canDeletePages: false,
          canEditPages: false,
          canCreatePages: false,
        };
      default:
        return {
          canManageUsers: false,
          canManageContent: false,
          canManageSettings: false,
          canViewAnalytics: false,
          canManageOrders: false,
          canManageCategories: false,
          canDeletePages: false,
          canEditPages: false,
          canCreatePages: false,
        };
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (window.confirm(`Are you sure you want to delete the "${categoryName}" category? This will also remove all pages in this category.`)) {
      const updatedSections = { ...customSections };
      delete updatedSections[categoryName];
      setCustomSections(updatedSections);
      
      // Remove pages from this category
      const updatedPages = pages.filter(page => page.section !== categoryName);
      setPages(updatedPages);
      
      alert(`Category "${categoryName}" deleted successfully!`);
    }
  };

  // Page management functions
  const handleCreatePage = () => {
    if (newPage.title && newPage.path) {
      const page = {
        id: pages.length + 1,
        title: newPage.title,
        path: newPage.path.startsWith('/') ? newPage.path : '/' + newPage.path,
        status: 'published',
        lastModified: new Date().toISOString().split('T')[0],
        image: newPage.image ? newPage.image.name : null,
        content: newPage.content,
        section: newPage.section || 'Main'
      };
      setPages([...pages, page]);
      
      // Clean up image preview URL
      if (newPage.imagePreview) {
        URL.revokeObjectURL(newPage.imagePreview);
      }
      
      setNewPage({ title: '', path: '', content: '', image: null, imagePreview: '', section: '' });
      setShowPageModal(false);
      
      let successMessage = `Page "${page.title}" created successfully!`;
      if (newPage.image) {
        successMessage += ` Image "${newPage.image.name}" has been uploaded.`;
      }
      alert(successMessage);
    }
  };

  const handleDeletePage = (pageId: number) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== pageId));
      alert('Page deleted successfully!');
    }
  };

  const handleEditPage = (pageId: number) => {
    const pageToEdit = pages.find(page => page.id === pageId);
    if (pageToEdit) {
      setSelectedPageForEdit(pageToEdit);
      setNewPage({
        title: pageToEdit.title,
        path: pageToEdit.path,
        content: pageToEdit.content || '',
        image: null,
        imagePreview: '',
        section: pageToEdit.section || 'Main'
      });
      setShowEditPageModal(true);
    }
  };

  const handleUpdatePage = () => {
    if (selectedPageForEdit && newPage.title && newPage.path) {
      const updatedPages = pages.map(page => 
        page.id === selectedPageForEdit.id 
          ? {
              ...page,
              title: newPage.title,
              path: newPage.path.startsWith('/') ? newPage.path : '/' + newPage.path,
              content: newPage.content,
              lastModified: new Date().toISOString().split('T')[0],
              image: newPage.image ? newPage.image.name : page.image
            }
          : page
      );
      
      setPages(updatedPages);
      
      // Clean up image preview URL
      if (newPage.imagePreview) {
        URL.revokeObjectURL(newPage.imagePreview);
      }
      
      setNewPage({ title: '', path: '', content: '', image: null, imagePreview: '', section: '' });
      setSelectedPageForEdit(null);
      setShowEditPageModal(false);
      alert(`Page "${newPage.title}" updated successfully!`);
    }
  };

  const handleCreateUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/users', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            created_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          setNewUser({ name: '', email: '', role: 'user' });
          setShowAddUserModal(false);
          alert(`User "${newUser.name}" created successfully!`);
          // Reload dashboard data to update the count
          loadDashboardData();
        } else {
          const errorText = await response.text();
          console.error('Error creating user:', errorText);
          alert('Failed to create user. Please try again.');
        }
      } catch (error) {
        console.error('Error creating user:', error);
        alert('Failed to create user. Please check your connection.');
      }
    }
  };

  const handleCreateOrder = async () => {
    if (newOrder.courseName && newOrder.amount && newOrder.customerName) {
      try {
        const response = await fetch('https://ahvxqultshujqtmbkjpy.supabase.co/rest/v1/orders', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhxdWx0c2h1anF0bWJranB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzg0MzAsImV4cCI6MjA2NTgxNDQzMH0.jmt8gXVzqeNw0vtdSNAJDTOJAnda2HG4GA1oJyWr5dQ',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            course_name: newOrder.courseName,
            amount: parseFloat(newOrder.amount),
            customer_name: newOrder.customerName,
            customer_email: newOrder.customerEmail || null,
            payment_id: 'manual_' + Date.now(),
            status: 'completed',
            created_at: new Date().toISOString()
          })
        });

        if (response.ok) {
          setNewOrder({ courseName: '', amount: '', customerName: '', customerEmail: '' });
          setShowAddOrderModal(false);
          alert(`Order for "${newOrder.courseName}" created successfully! Revenue: ₹${newOrder.amount}`);
          // Reload dashboard data to update the revenue
          loadDashboardData();
        } else {
          const errorText = await response.text();
          console.error('Error creating order:', errorText);
          alert('Failed to create order. Please try again.');
        }
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please check your connection.');
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setNewPage({
        ...newPage,
        image: file,
        imagePreview: previewUrl
      });
    }
  };

  const removeImage = () => {
    if (newPage.imagePreview) {
      URL.revokeObjectURL(newPage.imagePreview);
    }
    setNewPage({
      ...newPage,
      image: null,
      imagePreview: ''
    });
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-lg shadow-md border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className="text-gray-400" style={{ color }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const TabButton: React.FC<{ id: string; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your Billion Hopes website</p>
        </div>
        <div className="flex gap-2">
          {/* Quick Add Dropdown */}
          <div className="relative" ref={quickAddRef}>
            <button 
              onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Quick Add
            </button>
            
            {showQuickAddMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border z-50 max-h-96 overflow-y-auto">
                <div className="py-1">
                  {/* General Actions */}
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">
                    General
                  </div>
                  <button
                    onClick={() => handleQuickAdd('course')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <AcademicCapIcon className="h-4 w-4 inline mr-2" />
                    Add Course
                  </button>
                  <button
                    onClick={() => navigate('/manage-quizzes')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-l-4 border-purple-400"
                  >
                    <QuestionMarkCircleIcon className="h-4 w-4 inline mr-2 text-purple-600" />
                    Manage Quizzes
                  </button>
                  <button
                    onClick={() => handleQuickAdd('delete-course')}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 border-l-4 border-red-400"
                  >
                    <TrashIcon className="h-4 w-4 inline mr-2 text-red-600" />
                    Delete Course
                  </button>
                  <button
                    onClick={() => handleQuickAdd('user')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UsersIcon className="h-4 w-4 inline mr-2" />
                    Add User
                  </button>
                  <button
                    onClick={() => handleQuickAdd('admin')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-l-4 border-yellow-400"
                  >
                    <CogIcon className="h-4 w-4 inline mr-2 text-yellow-600" />
                    Add Admin
                  </button>
                  <button
                    onClick={() => handleQuickAdd('manage-admins')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UsersIcon className="h-4 w-4 inline mr-2" />
                    Manage Admins
                  </button>
                  <button
                    onClick={() => handleQuickAdd('order')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <CogIcon className="h-4 w-4 inline mr-2" />
                    Add Order (Test Revenue)
                  </button>
                  
                  {/* Category Management */}
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b mt-2">
                    Category Management
                  </div>
                  <button
                    onClick={() => handleQuickAdd('add-category')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <PlusIcon className="h-4 w-4 inline mr-2" />
                    Create New Category
                  </button>
                  <button
                    onClick={() => handleQuickAdd('manage-categories')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <CogIcon className="h-4 w-4 inline mr-2" />
                    Manage Categories
                  </button>
                  
                  {/* Sidebar Sections */}
                  {Object.keys(allSidebarSections).map((section) => (
                    <div key={section}>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b mt-2">
                        {section}
                      </div>
                      <button
                        onClick={() => handleQuickAdd(`add-${section}`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PlusIcon className="h-4 w-4 inline mr-2" />
                        Add Page to {section}
                      </button>
                      <button
                        onClick={() => handleQuickAdd(`view-${section}`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <EyeIcon className="h-4 w-4 inline mr-2" />
                        View {section} Pages
                      </button>
                      <button
                        onClick={() => handleQuickAdd(`edit-${section}`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="h-4 w-4 inline mr-2" />
                        Edit {section} Pages
                      </button>
                      <button
                        onClick={() => handleQuickAdd(`delete-${section}`)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <TrashIcon className="h-4 w-4 inline mr-2" />
                        Delete {section} Pages
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <CogIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UsersIcon className="h-8 w-8" />}
          color="#3B82F6"
        />
        <StatCard
          title="Courses"
          value={stats.totalCourses}
          icon={<AcademicCapIcon className="h-8 w-8" />}
          color="#10B981"
        />
        <StatCard
          title="Comments"
          value={stats.totalComments}
          icon={<DocumentTextIcon className="h-8 w-8" />}
          color="#F59E0B"
        />
        <StatCard
          title="Subscribers"
          value={stats.totalNewsletterSubscribers}
          icon={<BellIcon className="h-8 w-8" />}
          color="#EF4444"
        />
        <StatCard
          title="Feedback"
          value={stats.totalFeedback}
          icon={<ChartBarIcon className="h-8 w-8" />}
          color="#8B5CF6"
        />
        <StatCard
          title="Revenue"
          value={stats.totalRevenue}
          icon={<GlobeAltIcon className="h-8 w-8" />}
          color="#06B6D4"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        <TabButton id="overview" label="Overview" icon={<ChartBarIcon className="h-5 w-5" />} />
        <TabButton id="content" label="Content" icon={<DocumentTextIcon className="h-5 w-5" />} />
        <TabButton id="quizzes" label="Quizzes" icon={<QuestionMarkCircleIcon className="h-5 w-5" />} />
        <TabButton id="users" label="Users" icon={<UsersIcon className="h-5 w-5" />} />
        <TabButton id="analytics" label="Analytics" icon={<ChartBarIcon className="h-5 w-5" />} />
        <TabButton id="settings" label="Settings" icon={<CogIcon className="h-5 w-5" />} />
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-gray-600">
                      {activity.user} • {activity.timestamp}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Content Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Add Content
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Courses</h3>
                <p className="text-gray-600 mb-4">Manage AI courses and content</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/manage-courses')}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Manage Courses
                  </button>
                  <button 
                    onClick={() => navigate('/add-course')}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    Add New
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Pages</h3>
                <p className="text-gray-600 mb-4">Manage website pages</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowPageManager(true)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Manage Pages
                  </button>
                  <button 
                    onClick={() => setShowPageModal(true)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    Add New
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Blog Posts</h3>
                <p className="text-gray-600 mb-4">Manage blog content</p>
                <div className="flex gap-2">
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">Edit</button>
                  <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">Add New</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Add User
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Newsletter Subscribers</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalNewsletterSubscribers}</p>
                <button className="text-blue-600 text-sm hover:underline">View All</button>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Active Users</h3>
                <p className="text-2xl font-bold text-green-600">89</p>
                <button className="text-green-600 text-sm hover:underline">View All</button>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900">Course Enrollments</h3>
                <p className="text-2xl font-bold text-yellow-600">156</p>
                <button className="text-yellow-600 text-sm hover:underline">View All</button>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Premium Users</h3>
                <p className="text-2xl font-bold text-purple-600">23</p>
                <button className="text-purple-600 text-sm hover:underline">View All</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quiz Management</h2>
              <button 
                onClick={() => navigate('/quiz-manager')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                Open Quiz Manager
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <QuestionMarkCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Create Quizzes
                </h3>
                <p className="text-gray-600 mb-4">Create quizzes for each class in your courses</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/quiz-manager')}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Manage Quizzes
                  </button>
                  <button 
                    onClick={() => navigate('/quiz-manager')}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    Create New
                  </button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" />
                  Quiz Analytics
                </h3>
                <p className="text-gray-600 mb-4">View student quiz performance and statistics</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Quizzes:</span>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average Score:</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate:</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Quiz Activity
                </h3>
                <p className="text-gray-600 mb-4">Latest quiz submissions and results</p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Python Variables Quiz</span>
                      <span className="text-green-600">95%</span>
                    </div>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                  <div className="text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Python Basics Quiz</span>
                      <span className="text-blue-600">78%</span>
                    </div>
                    <div className="text-gray-500">5 hours ago</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-2">🚀 Quiz Management Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <div>
                  <h4 className="font-medium mb-2">Current Features:</h4>
                  <ul className="space-y-1">
                    <li>• Create quizzes for any course/class</li>
                    <li>• Multiple choice questions with explanations</li>
                    <li>• Set time limits and difficulty levels</li>
                    <li>• Preview quizzes before publishing</li>
                    <li>• Edit and delete existing quizzes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Coming Soon:</h4>
                  <ul className="space-y-1">
                    <li>• Database integration for persistent storage</li>
                    <li>• Student progress tracking</li>
                    <li>• Automated grading and certificates</li>
                    <li>• Quiz analytics and reporting</li>
                    <li>• Bulk question import/export</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Page Views</h3>
                <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart Placeholder</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">User Engagement</h3>
                <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Website Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">General Settings</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Site Title</label>
                  <input type="text" className="w-full border rounded px-3 py-2" defaultValue="Billion Hopes" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Site Description</label>
                  <textarea className="w-full border rounded px-3 py-2" rows={3} defaultValue="Empowering the future through AI education and innovation" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">API Settings</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Supabase URL</label>
                  <input type="text" className="w-full border rounded px-3 py-2" defaultValue="https://ahvxqultshujqtmbkjpy.supabase.co" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">API Key</label>
                  <input type="password" className="w-full border rounded px-3 py-2" defaultValue="••••••••••••••••" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Changes
              </button>
              <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Page Creation Modal */}
      {showPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Page</h2>
              <button
                onClick={() => {
                  if (newPage.imagePreview) {
                    URL.revokeObjectURL(newPage.imagePreview);
                  }
                  setNewPage({ title: '', path: '', content: '', image: null, imagePreview: '', section: '' });
                  setShowPageModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Path (URL)
                </label>
                <input
                  type="text"
                  value={newPage.path}
                  onChange={(e) => setNewPage({...newPage, path: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/my-new-page"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Content (Optional)
                </label>
                <RichTextEditor
                  value={newPage.content}
                  onChange={(content) => setNewPage({...newPage, content})}
                  placeholder="Enter page content with full formatting options..."
                  height={300}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image (Optional)
                </label>
                <div className="space-y-3">
                  {!newPage.imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </div>
                          <div className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={newPage.imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreatePage}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Page
              </button>
              <button
                onClick={() => {
                  if (newPage.imagePreview) {
                    URL.revokeObjectURL(newPage.imagePreview);
                  }
                  setNewPage({ title: '', path: '', content: '', image: null, imagePreview: '', section: '' });
                  setShowPageModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Manager Modal */}
      {showPageManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Pages</h2>
              <button
                onClick={() => setShowPageManager(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-64">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Title</th>
                    <th className="text-left py-2 px-4">Path</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Last Modified</th>
                    <th className="text-left py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4 font-medium">{page.title}</td>
                      <td className="py-2 px-4 text-gray-600">{page.path}</td>
                      <td className="py-2 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          {page.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-gray-600">{page.lastModified}</td>
                      <td className="py-2 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPage(page.id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setShowPageModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add New Page
              </button>
              <button
                onClick={() => setShowPageManager(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Page Modal */}
      {showEditPageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPageForEdit ? `Edit "${selectedPageForEdit.title}"` : 'Edit Page'}
              </h2>
              <button
                onClick={() => {
                  if (newPage.imagePreview) {
                    URL.revokeObjectURL(newPage.imagePreview);
                  }
                  setNewPage({ title: '', path: '', content: '', image: null, imagePreview: '', section: '' });
                  setSelectedPageForEdit(null);
                  setShowEditPageModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter page title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Path (URL)
                </label>
                <input
                  type="text"
                  value={newPage.path}
                  onChange={(e) => setNewPage({...newPage, path: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/my-page"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Content
                </label>
                <RichTextEditor
                  value={newPage.content}
                  onChange={(content) => setNewPage({...newPage, content})}
                  placeholder="Edit page content with full formatting options..."
                  height={300}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image (Optional)
                </label>
                <div className="space-y-3">
                  {!newPage.imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id="edit-image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label htmlFor="edit-image-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600">Click to upload</span> new image
                          </div>
                          <div className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={newPage.imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdatePage}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Page
              </button>
              <button
                onClick={() => {
                  if (newPage.imagePreview) {
                    URL.revokeObjectURL(newPage.imagePreview);
                  }
                  setNewPage({ title: '', path: '', content: '', image: null, imagePreview: '', section: '' });
                  setSelectedPageForEdit(null);
                  setShowEditPageModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Page Selection Modal */}
      {showDeletePageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Delete Page</h2>
              <button
                onClick={() => setShowDeletePageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Select a page to delete. This action cannot be undone.</p>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-gray-600">{page.path}</p>
                    <p className="text-xs text-gray-500">Last modified: {page.lastModified}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDeletePageModal(false);
                      handleDeletePage(page.id);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDeletePageModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Page Selection Modal */}
      {showEditPageModal && !selectedPageForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Page</h2>
              <button
                onClick={() => setShowEditPageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Select a page to edit.</p>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-gray-600">{page.path}</p>
                    <p className="text-xs text-gray-500">Last modified: {page.lastModified}</p>
                  </div>
                  <button
                    onClick={() => handleEditPage(page.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEditPageModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
              <button
                onClick={() => {
                  setNewUser({ name: '', email: '', role: 'user' });
                  setShowAddUserModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateUser}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create User
              </button>
              <button
                onClick={() => {
                  setNewUser({ name: '', email: '', role: 'user' });
                  setShowAddUserModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Test Order</h2>
              <button
                onClick={() => {
                  setNewOrder({ courseName: '', amount: '', customerName: '', customerEmail: '' });
                  setShowAddOrderModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <select
                  value={newOrder.courseName}
                  onChange={(e) => setNewOrder({...newOrder, courseName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  <option value="AI Fundamentals">AI Fundamentals - ₹999</option>
                  <option value="Machine Learning Basics">Machine Learning Basics - ₹1299</option>
                  <option value="Deep Learning Advanced">Deep Learning Advanced - ₹1999</option>
                  <option value="NLP Processing">NLP Processing - ₹1599</option>
                  <option value="Computer Vision">Computer Vision - ₹1799</option>
                  <option value="AI Ethics & Future">AI Ethics & Future - ₹899</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={newOrder.amount}
                  onChange={(e) => setNewOrder({...newOrder, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount in rupees"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Email (Optional)
                </label>
                <input
                  type="email"
                  value={newOrder.customerEmail}
                  onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer email"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateOrder}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Order
              </button>
              <button
                onClick={() => {
                  setNewOrder({ courseName: '', amount: '', customerName: '', customerEmail: '' });
                  setShowAddOrderModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Category</h2>
              <button
                onClick={() => {
                  setNewCategory({ title: '', description: '' });
                  setShowAddCategoryModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Title *
                </label>
                <input
                  type="text"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Blockchain, Quantum Computing, Robotics"
                />
                <p className="text-xs text-gray-500 mt-1">This will appear in the sidebar navigation</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of this category..."
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateCategory}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Category
              </button>
              <button
                onClick={() => {
                  setNewCategory({ title: '', description: '' });
                  setShowAddCategoryModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showManageCategoriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Categories</h2>
              <button
                onClick={() => setShowManageCategoriesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Default Categories</h3>
                <p className="text-sm text-blue-700 mb-3">These are built-in categories that cannot be deleted:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['AI Explained', 'Solutions', 'Trends', 'Data Lab', 'AGI', 'AI Resources'].map((category) => (
                    <div key={category} className="bg-white px-3 py-2 rounded border text-sm font-medium">
                      {category}
                    </div>
                  ))}
                </div>
              </div>
              
              {Object.keys(customSections).length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Categories</h3>
                  <p className="text-sm text-gray-600 mb-3">Categories you've created:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {Object.keys(customSections).map((category) => (
                      <div key={category} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                        <span className="font-medium">{category}</span>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete Category"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {Object.keys(customSections).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CogIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No custom categories created yet.</p>
                  <p className="text-sm">Click "Create New Category" to get started!</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Create New Category
              </button>
              <button
                onClick={() => setShowManageCategoriesModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Action Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedSection} Management</h2>
              <button
                onClick={() => setShowSectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                What would you like to do with the {selectedSection} section?
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleSectionAction('add', selectedSection)}
                  className="w-full text-left bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center">
                    <PlusIcon className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-green-900">Add New Page</div>
                      <div className="text-sm text-green-700">Create a new page in {selectedSection} section</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSectionAction('view', selectedSection)}
                  className="w-full text-left bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <EyeIcon className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-blue-900">View Pages</div>
                      <div className="text-sm text-blue-700">See all pages in {selectedSection} section</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSectionAction('edit', selectedSection)}
                  className="w-full text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-colors"
                >
                  <div className="flex items-center">
                    <PencilIcon className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <div className="font-medium text-yellow-900">Edit Pages</div>
                      <div className="text-sm text-yellow-700">Modify existing pages in {selectedSection} section</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleSectionAction('delete', selectedSection)}
                  className="w-full text-left bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center">
                    <TrashIcon className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <div className="font-medium text-red-900">Delete Pages</div>
                      <div className="text-sm text-red-700">Remove pages from {selectedSection} section</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSectionModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Admin</h2>
              <button
                onClick={() => {
                  setNewAdmin({
                    name: '',
                    email: '',
                    role: 'admin',
                    permissions: {
                      canManageUsers: false,
                      canManageContent: true,
                      canManageSettings: false,
                      canViewAnalytics: true,
                      canManageOrders: false,
                      canManageCategories: false,
                      canDeletePages: false,
                      canEditPages: true,
                      canCreatePages: true,
                    },
                    status: 'active'
                  });
                  setShowAddAdminModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Admin Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Admin Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newAdmin.name || ''}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter admin's full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newAdmin.email || ''}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Role *
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => {
                      const role = e.target.value as AdminUser['role'];
                      const permissions = getRolePermissions(role);
                      setNewAdmin({...newAdmin, role, permissions});
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="content-manager">Content Manager</option>
                    <option value="analyst">Analyst</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Role determines default permissions</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newAdmin.status}
                    onChange={(e) => setNewAdmin({...newAdmin, status: e.target.value as AdminUser['status']})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              {/* Permissions */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Permissions</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Manage Users</div>
                      <div className="text-sm text-gray-600">Create, edit, and delete user accounts</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions?.canManageUsers || false}
                      onChange={(e) => setNewAdmin({
                        ...newAdmin,
                        permissions: {
                          ...newAdmin.permissions!,
                          canManageUsers: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Manage Content</div>
                      <div className="text-sm text-gray-600">Create and edit pages, courses, blog posts</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions?.canManageContent || false}
                      onChange={(e) => setNewAdmin({
                        ...newAdmin,
                        permissions: {
                          ...newAdmin.permissions!,
                          canManageContent: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Manage Settings</div>
                      <div className="text-sm text-gray-600">Access website settings and configurations</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions?.canManageSettings || false}
                      onChange={(e) => setNewAdmin({
                        ...newAdmin,
                        permissions: {
                          ...newAdmin.permissions!,
                          canManageSettings: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">View Analytics</div>
                      <div className="text-sm text-gray-600">Access website analytics and reports</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions?.canViewAnalytics || false}
                      onChange={(e) => setNewAdmin({
                        ...newAdmin,
                        permissions: {
                          ...newAdmin.permissions!,
                          canViewAnalytics: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Manage Orders</div>
                      <div className="text-sm text-gray-600">Create and manage test orders/revenue</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions?.canManageOrders || false}
                      onChange={(e) => setNewAdmin({
                        ...newAdmin,
                        permissions: {
                          ...newAdmin.permissions!,
                          canManageOrders: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Manage Categories</div>
                      <div className="text-sm text-gray-600">Create and delete website categories</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newAdmin.permissions?.canManageCategories || false}
                      onChange={(e) => setNewAdmin({
                        ...newAdmin,
                        permissions: {
                          ...newAdmin.permissions!,
                          canManageCategories: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  // Simple alert for now since handleCreateAdmin has TypeScript issues
                  if (newAdmin.name && newAdmin.email && newAdmin.role) {
                    alert(`Admin "${newAdmin.name}" would be created with ${newAdmin.role} role!`);
                    setShowAddAdminModal(false);
                  } else {
                    alert('Please fill in all required fields.');
                  }
                }}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Create Admin
              </button>
              <button
                onClick={() => {
                  setNewAdmin({
                    name: '',
                    email: '',
                    role: 'admin',
                    permissions: {
                      canManageUsers: false,
                      canManageContent: true,
                      canManageSettings: false,
                      canViewAnalytics: true,
                      canManageOrders: false,
                      canManageCategories: false,
                      canDeletePages: false,
                      canEditPages: true,
                      canCreatePages: true,
                    },
                    status: 'active'
                  });
                  setShowAddAdminModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Admins Modal */}
      {showManageAdminsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Admin Users</h2>
              <button
                onClick={() => setShowManageAdminsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Add New Admin
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                            <div className="text-sm text-gray-500">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.role === 'super-admin' ? 'bg-red-100 text-red-800' :
                          admin.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          admin.role === 'moderator' ? 'bg-green-100 text-green-800' :
                          admin.role === 'content-manager' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {admin.role.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.status === 'active' ? 'bg-green-100 text-green-800' :
                          admin.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {admin.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          {admin.permissions.canManageUsers && <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Users</div>}
                          {admin.permissions.canManageContent && <div className="bg-green-100 text-green-800 px-2 py-1 rounded">Content</div>}
                          {admin.permissions.canManageSettings && <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Settings</div>}
                          {admin.permissions.canViewAnalytics && <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Analytics</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {admin.lastLogin || 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {admin.role !== 'super-admin' && (
                          <>
                            <button
                              onClick={() => alert(`Edit functionality for ${admin.name} - Coming soon!`)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit Admin"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => alert(`Toggle status for ${admin.name} - Coming soon!`)}
                              className="text-yellow-600 hover:text-yellow-900 p-1"
                              title="Toggle Status"
                            >
                              <CogIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => alert(`Delete ${admin.name} - Coming soon!`)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete Admin"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {admin.role === 'super-admin' && (
                          <span className="text-gray-400 text-xs">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Admin Role Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-blue-800">Super Admin</h5>
                  <p className="text-blue-700">Full access to all features</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800">Admin</h5>
                  <p className="text-blue-700">Manage users, content, orders</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800">Moderator</h5>
                  <p className="text-blue-700">Content management only</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800">Content Manager</h5>
                  <p className="text-blue-700">Content and categories</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-800">Analyst</h5>
                  <p className="text-blue-700">Analytics access only</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowManageAdminsModal(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Course Modal */}
      {showDeleteCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center mb-6">
              <TrashIcon className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Delete Course</h2>
              <button
                onClick={() => {
                  setShowDeleteCourseModal(false);
                  setSelectedCourseToDelete('');
                }}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course to Delete
              </label>
              <select
                value={selectedCourseToDelete}
                onChange={(e) => setSelectedCourseToDelete(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={deleteLoading}
              >
                <option value="">Choose a course...</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} - {course.instructor} (₹{course.fees}) [{course.status}]
                  </option>
                ))}
              </select>
              
              {availableCourses.length === 0 && (
                <p className="text-gray-500 text-sm mt-2">
                  No courses available to delete.
                </p>
              )}
            </div>

            {selectedCourseToDelete && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <TrashIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-800 font-medium">Warning</span>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  This action will permanently delete the selected course and all associated data. This cannot be undone.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleDeleteCourse}
                disabled={!selectedCourseToDelete || deleteLoading}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  !selectedCourseToDelete || deleteLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Course'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteCourseModal(false);
                  setSelectedCourseToDelete('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard; 
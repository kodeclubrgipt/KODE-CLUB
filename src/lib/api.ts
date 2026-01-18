// Get API base URL from environment variable
// IMPORTANT: In production (Vercel), you MUST set NEXT_PUBLIC_API_URL
// Example: https://backend-95ve.onrender.com/api

// Debug: Log environment variable (only in browser)
if (typeof window !== 'undefined') {
  console.log('🔍 Environment check:');
  console.log('  NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
  console.log('  Window location:', window.location.href);
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Warn if using localhost in production
if (typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1' &&
    API_BASE_URL.includes('localhost')) {
  console.error('❌ CRITICAL: Using localhost API URL in production!');
  console.error('   Current API URL:', API_BASE_URL);
  console.error('   NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
  console.error('   Fix: Set NEXT_PUBLIC_API_URL=https://backend-95ve.onrender.com/api in Vercel');
  console.error('   Then redeploy your Vercel app');
}

// Helper function to get Google OAuth URL
export const getGoogleAuthUrl = (): string => {
  // Get API base URL from environment variable
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  // Remove trailing slash if present
  apiUrl = apiUrl.replace(/\/$/, '');
  
  // Remove /api suffix if present (to avoid double /api/api)
  // This handles cases where NEXT_PUBLIC_API_URL already includes /api
  let baseUrl = apiUrl.replace(/\/api$/, '');
  
  // If we're in production and no env var is set, log warning
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1' &&
      !process.env.NEXT_PUBLIC_API_URL) {
    console.error('⚠️ NEXT_PUBLIC_API_URL is not set! Please configure it in Vercel environment variables.');
  }
  
  // Construct Google OAuth URL: baseUrl + /api/auth/google
  // Example: https://backend-95ve.onrender.com/api/auth/google
  return `${baseUrl}/api/auth/google`;
};

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
  users?: any[];
  quizzes?: any[];
  quiz?: any;
  results?: any;
  token?: string;
  errors?: any[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'email' | 'google';
  isAdmin?: boolean;
  memberSince: string;
  totalSolved?: number;
  currentStreak?: number;
  globalRank?: number;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer?: number;
}

export interface Quiz {
  id?: string;
  _id?: string;
  heading: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  isActive?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  details: Array<{
    questionIndex: number;
    question: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    options: string[];
  }>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Log API URL in development or if using localhost
    if (typeof window !== 'undefined') {
      if (baseURL.includes('localhost') && window.location.hostname !== 'localhost') {
        console.error('⚠️ API Client is using localhost URL in production!');
        console.error('Current API URL:', baseURL);
        console.error('Please set NEXT_PUBLIC_API_URL=https://backend-95ve.onrender.com/api in Vercel');
      } else {
        console.log('✅ API Client initialized with URL:', baseURL);
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log(`API Request: ${options.method || 'GET'} ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error(`Invalid response format: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        console.error(`API Error [${response.status}]:`, errorMessage, data);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      // Enhanced error logging
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error('Network error - Check if backend is running and CORS is configured');
        console.error('API Base URL:', this.baseURL);
        console.error('Full error:', error);
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(data: { name?: string; avatar?: string }): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const res = await this.request<{ users: User[]; count: number }>('/admin/users');
    return { ...res, users: res.users } as ApiResponse<User[]>;
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUser(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadQuiz(quiz: { heading: string; description?: string; questions: Question[] }): Promise<ApiResponse<Quiz>> {
    const res = await this.request<{ quiz: Quiz }>('/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
    return { ...res, quiz: res.quiz } as ApiResponse<Quiz>;
  }

  async getAllQuizzes(): Promise<ApiResponse<Quiz[]>> {
    const res = await this.request<{ quizzes: Quiz[]; count: number }>('/admin/quizzes');
    return { ...res, quizzes: res.quizzes } as ApiResponse<Quiz[]>;
  }

  async deleteQuiz(quizId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/quizzes/${quizId}`, {
      method: 'DELETE',
    });
  }

  async toggleQuizStatus(quizId: string): Promise<ApiResponse<Quiz>> {
    const res = await this.request<{ quiz: Quiz }>(`/admin/quizzes/${quizId}/toggle-status`, {
      method: 'PATCH',
    });
    return { ...res, quiz: res.quiz } as ApiResponse<Quiz>;
  }

  // Quiz endpoints (public)
  async getQuizzes(): Promise<ApiResponse<Quiz[]>> {
    const res = await this.request<{ quizzes: Quiz[]; count: number }>('/quiz');
    return { ...res, quizzes: res.quizzes } as ApiResponse<Quiz[]>;
  }

  async getQuiz(quizId: string): Promise<ApiResponse<Quiz>> {
    const res = await this.request<{ quiz: Quiz }>(`/quiz/${quizId}`);
    return { ...res, quiz: res.quiz } as ApiResponse<Quiz>;
  }

  async submitQuiz(quizId: string, answers: number[]): Promise<ApiResponse<QuizResult>> {
    const res = await this.request<{ results: QuizResult }>(`/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
    return { ...res, results: res.results } as ApiResponse<QuizResult>;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

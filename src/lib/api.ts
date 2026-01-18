const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
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

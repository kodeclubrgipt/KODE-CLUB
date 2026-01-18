// Get API base URL from environment variable
// IMPORTANT: In production (Vercel), you MUST set NEXT_PUBLIC_API_URL
// Example: https://backend-95ve.onrender.com/api

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Runtime check and warning (only in browser)
if (typeof window !== 'undefined') {
  const isProduction = window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProduction && API_BASE_URL.includes('localhost')) {
    console.error('❌❌❌ CRITICAL ERROR ❌❌❌');
    console.error('Frontend is trying to use localhost API in production!');
    console.error('');
    console.error('Current API URL:', API_BASE_URL);
    console.error('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'NOT SET');
    console.error('Window location:', window.location.href);
    console.error('');
    console.error('🔧 FIX STEPS:');
    console.error('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.error('2. Add: NEXT_PUBLIC_API_URL = https://backend-95ve.onrender.com/api');
    console.error('3. Make sure it\'s set for "Production" environment');
    console.error('4. Go to Deployments → Click "Redeploy" on latest deployment');
    console.error('5. Wait for rebuild to complete');
    console.error('');
    console.error('⚠️  The app MUST be rebuilt after setting the variable!');
  } else {
    console.log('✅ API Configuration:');
    console.log('  API URL:', API_BASE_URL);
    console.log('  Environment:', isProduction ? 'Production' : 'Development');
  }
}

// Helper function to get Google OAuth URL
export const getGoogleAuthUrl = () => {
  // Get API base URL from environment variable
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

class ApiClient {
  constructor(baseURL) {
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

  async request(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
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
    } catch (error) {
      // Enhanced error logging
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
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
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(data) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin endpoints
  async getAllUsers() {
    const res = await this.request('/admin/users');
    return { ...res, users: res.users };
  }

  async deleteUser(userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async updateUser(userId, data) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadQuiz(quiz) {
    const res = await this.request('/admin/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz),
    });
    return { ...res, quiz: res.quiz };
  }

  async getAllQuizzes() {
    const res = await this.request('/admin/quizzes');
    return { ...res, quizzes: res.quizzes };
  }

  async deleteQuiz(quizId) {
    return this.request(`/admin/quizzes/${quizId}`, {
      method: 'DELETE',
    });
  }

  async toggleQuizStatus(quizId) {
    const res = await this.request(`/admin/quizzes/${quizId}/toggle-status`, {
      method: 'PATCH',
    });
    return { ...res, quiz: res.quiz };
  }

  // Quiz endpoints (public)
  async getQuizzes() {
    const res = await this.request('/quiz');
    return { ...res, quizzes: res.quizzes };
  }

  async getQuiz(quizId) {
    const res = await this.request(`/quiz/${quizId}`);
    return { ...res, quiz: res.quiz };
  }

  async submitQuiz(quizId, answers) {
    const res = await this.request(`/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
    return { ...res, results: res.results };
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

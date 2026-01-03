# Psychage Backend Integration - Separate Frontend Guide

**How to connect a NEW frontend application to the existing Psychage backend.**

> **SECURITY WARNING**: This document contains production credentials. Keep it secure and never commit to public repositories.

---

## Your Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              YOUR SETUP                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────┐              ┌─────────────────────────────────┐  │
│   │   YOUR NEW FRONTEND │              │    EXISTING BACKEND             │  │
│   │   (Separate App)    │    HTTP      │    (main_backend)               │  │
│   │                     │ ──────────▶  │                                 │  │
│   │   Port: 5173        │   API        │    Port: 3000                   │  │
│   │   (or any port)     │   Calls      │    (or deployed URL)            │  │
│   ├─────────────────────┤              ├─────────────────────────────────┤  │
│   │                     │              │                                 │  │
│   │ • Your own design   │              │ • /api/auth/* (login, signup)   │  │
│   │ • Your own pages    │              │ • /api/user/* (profile, 2FA)    │  │
│   │ • Your own UI       │              │ • /api/clarity-score/*          │  │
│   │ • Your own stack    │              │ • /api/mood/*                   │  │
│   │   (React, Vue,      │              │ • /api/sleep/*                  │  │
│   │    Svelte, etc.)    │              │ • /api/providers/*              │  │
│   │                     │              │ • /api/articles/*               │  │
│   └─────────────────────┘              │ • /api/symptom-checker/*        │  │
│                                        │                                 │  │
│                                        │ ✓ Same Database                 │  │
│                                        │ ✓ Same Auth System              │  │
│                                        │ ✓ Same API Logic                │  │
│                                        └─────────────────────────────────┘  │
│                                                       │                      │
│                                                       ▼                      │
│                                        ┌─────────────────────────────────┐  │
│                                        │      SHARED SERVICES            │  │
│                                        │  • Supabase (PostgreSQL + Auth) │  │
│                                        │  • Sanity CMS (Articles)        │  │
│                                        │  • Google Gemini (AI Chat)      │  │
│                                        │  • Resend (Emails)              │  │
│                                        └─────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Table of Contents

1. [Step 1: Set Up the Backend](#step-1-set-up-the-backend)
2. [Step 2: Create Your New Frontend](#step-2-create-your-new-frontend)
3. [Step 3: Configure CORS](#step-3-configure-cors)
4. [Step 4: Connect to the API](#step-4-connect-to-the-api)
5. [Complete API Reference](#complete-api-reference)
6. [Authentication System](#authentication-system)
7. [All Credentials & Keys](#all-credentials--keys)
8. [Direct Database Access (Optional)](#direct-database-access-optional)
9. [Deployment](#deployment)

---

## Step 1: Set Up the Backend

The backend must be running for your frontend to connect to it.

### Option A: Run Locally (Development)

```bash
# Navigate to the backend folder
cd "/Users/raiyanabdullah/Desktop/Project Psychage V1/main_backend"

# Install dependencies (first time only)
npm install

# Create .env.local if it doesn't exist (see credentials section below)

# Start the backend server
npm run dev

# Backend now running at: http://localhost:3000
# API available at: http://localhost:3000/api/*
```

### Option B: Deploy to Vercel (Production)

```bash
# In the main_backend folder
cd "/Users/raiyanabdullah/Desktop/Project Psychage V1/main_backend"

# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
# Your API will be at: https://your-app.vercel.app/api/*
```

### Backend Environment File

Create `main_backend/.env.local`:

```bash
# ============================================================================
# SUPABASE (Database + Authentication)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://ozourhqyqtpppvpbhphw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b3VyaHF5cXRwcHB2cGJocGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTc3NDQsImV4cCI6MjA3ODg5Mzc0NH0.frxFMgcvbXKJBmiRPboGPPyL57P_qJ30wYueoAspKR0
SUPABASE_SERVICE_ROLE_KEY=sb_secret_5E4KRGhF8MInskH5xYZnYg_cLdy3giw

# ============================================================================
# SANITY.IO (Content Management System)
# ============================================================================
NEXT_PUBLIC_SANITY_PROJECT_ID=w1sh63w6
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skMc7aKLhvegBBz2UXnTZPYt6oK3jXiMWVYNPBg2dVZk83XBmbuyqxqV0dXsXUPb1yc1Zz8TEYNzl1P0bYZhmAqYFOo5tKDpmwm6pinhBUrceoHae7AWs6pi0o6mkUws11vGXetmN8h4xUpyfGqQK2Ssh8yD7DQqT5E7v9KrAIeNpatUleDp

# ============================================================================
# GEMINI AI (Symptom Checker)
# ============================================================================
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAFnxpTZN2kWOJ9A-L4C9PPkJ5BHxkomCA

# ============================================================================
# APPLICATION URLs - IMPORTANT: Update FRONTEND_URL for your new frontend!
# ============================================================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Multiple frontends? Add them here:
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001,https://your-frontend.vercel.app
```

---

## Step 2: Create Your New Frontend

Choose your preferred framework and create a new project:

### Option A: Vite + React (Recommended)

```bash
# Create new Vite project
npm create vite@latest my-psychage-frontend -- --template react-ts

cd my-psychage-frontend
npm install

# Install useful packages
npm install axios zustand @tanstack/react-query
```

### Option B: Next.js (if you prefer)

```bash
npx create-next-app@latest my-psychage-frontend --typescript --tailwind
cd my-psychage-frontend
```

### Option C: Any Other Framework

Vue, Svelte, Angular, or even vanilla JS - anything that can make HTTP requests will work.

### Frontend Environment File

Create `.env` (or `.env.local`) in your new frontend:

```bash
# API URL - points to the backend
VITE_API_URL=http://localhost:3000/api

# For production, update to:
# VITE_API_URL=https://your-backend.vercel.app/api

# Optional: Direct Supabase access (if you want to bypass the API for some things)
VITE_SUPABASE_URL=https://ozourhqyqtpppvpbhphw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b3VyaHF5cXRwcHB2cGJocGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTc3NDQsImV4cCI6MjA3ODg5Mzc0NH0.frxFMgcvbXKJBmiRPboGPPyL57P_qJ30wYueoAspKR0
```

---

## Step 3: Configure CORS

The backend needs to know your frontend's URL to allow cross-origin requests.

### In Backend `.env.local`:

```bash
# Single frontend
FRONTEND_URL=http://localhost:5173

# OR multiple frontends
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001,https://my-app.vercel.app
```

### Restart the backend after changing environment variables:

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

---

## Step 4: Connect to the API

### Complete API Client (Copy this to your frontend)

Create `src/lib/api.ts` in your frontend:

```typescript
/**
 * Psychage API Client
 *
 * Complete API client for connecting to the Psychage backend.
 * Copy this file to your frontend project.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

function getAccessToken(): string | null {
  return localStorage.getItem('psychage_access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('psychage_refresh_token');
}

function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('psychage_access_token', accessToken);
  localStorage.setItem('psychage_refresh_token', refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem('psychage_access_token');
  localStorage.removeItem('psychage_refresh_token');
}

// ============================================================================
// BASE REQUEST FUNCTION
// ============================================================================

interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Handle token refresh on 401
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the original request
      return request<T>(endpoint, options);
    }
    // Refresh failed, clear tokens
    clearTokens();
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return data;
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.data.session.access_token, data.data.session.refresh_token);
      return true;
    }
  } catch {
    // Refresh failed
  }

  return false;
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

export const auth = {
  /**
   * Sign up a new user
   */
  async signup(email: string, password: string, name: string, role: 'patient' | 'provider' = 'patient') {
    const response = await request<{
      user: { id: string; email: string; name: string; role: string };
      session: { access_token: string; refresh_token: string; expires_at: number };
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });

    if (response.data?.session) {
      setTokens(response.data.session.access_token, response.data.session.refresh_token);
    }

    return response;
  },

  /**
   * Log in an existing user
   */
  async login(email: string, password: string) {
    const response = await request<{
      user: { id: string; email: string; name: string; role: string };
      session: { access_token: string; refresh_token: string; expires_at: number };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.session) {
      setTokens(response.data.session.access_token, response.data.session.refresh_token);
    }

    return response;
  },

  /**
   * Log out the current user
   */
  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser() {
    return request<{
      user: { id: string; email: string; name: string; role: string };
    }>('/auth/me');
  },

  /**
   * Request password reset email
   */
  async resetPassword(email: string) {
    return request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Update password with reset token
   */
  async updatePassword(password: string, token: string) {
    return request('/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ password, token }),
    });
  },

  /**
   * Verify 2FA code during login
   */
  async verify2FA(code: string) {
    return request('/auth/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!getAccessToken();
  },
};

// ============================================================================
// USER PROFILE & SETTINGS
// ============================================================================

export const user = {
  /**
   * Get user account details
   */
  async getAccount() {
    return request('/user/account');
  },

  /**
   * Update user account
   */
  async updateAccount(data: { name?: string; email?: string }) {
    return request('/user/account', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string) {
    return request('/user/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /**
   * Update display name
   */
  async updateDisplayName(displayName: string) {
    return request('/user/display-name', {
      method: 'PUT',
      body: JSON.stringify({ displayName }),
    });
  },

  /**
   * Get user preferences
   */
  async getPreferences() {
    return request('/user/preferences');
  },

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Record<string, unknown>) {
    return request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  /**
   * Get privacy settings
   */
  async getPrivacySettings() {
    return request('/user/privacy');
  },

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(settings: Record<string, unknown>) {
    return request('/user/privacy', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  /**
   * Setup 2FA
   */
  async setup2FA() {
    return request('/user/2fa', { method: 'POST' });
  },

  /**
   * Verify 2FA setup
   */
  async verify2FASetup(code: string) {
    return request('/user/2fa/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },

  /**
   * Get backup codes
   */
  async getBackupCodes() {
    return request('/user/backup-codes');
  },

  /**
   * Request account deletion
   */
  async requestDeletion() {
    return request('/user/account', { method: 'POST' });
  },

  /**
   * Cancel account deletion
   */
  async cancelDeletion() {
    return request('/user/account/cancel-deletion', { method: 'POST' });
  },

  /**
   * Request data export
   */
  async requestDataExport() {
    return request('/user/data-export', { method: 'POST' });
  },
};

// ============================================================================
// CLARITY SCORE (Mental Health Assessment)
// ============================================================================

export const clarityScore = {
  /**
   * Get assessment questions
   */
  async getQuestions() {
    return request('/assessment/questions');
  },

  /**
   * Save assessment score
   */
  async saveScore(data: {
    score: number;
    answers: Record<string, number>;
    duration_seconds: number;
    anonymous_id?: string;
  }) {
    return request('/clarity-score', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get score history
   */
  async getHistory(limit = 10) {
    return request(`/clarity-score?limit=${limit}`);
  },

  /**
   * Get score statistics
   */
  async getStats() {
    return request('/clarity-score/stats');
  },

  /**
   * Delete a specific score
   */
  async deleteScore(scoreId: string) {
    return request(`/clarity-score/${scoreId}`, { method: 'DELETE' });
  },

  /**
   * Link anonymous score to account
   */
  async linkScore(anonymousId: string) {
    return request('/clarity-score/link', {
      method: 'POST',
      body: JSON.stringify({ anonymousId }),
    });
  },
};

// ============================================================================
// MOOD TRACKING
// ============================================================================

export const mood = {
  /**
   * Get mood history
   */
  async getHistory(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const query = params.toString();
    return request(`/mood${query ? `?${query}` : ''}`);
  },

  /**
   * Create mood entry
   */
  async create(data: {
    mood_level: number; // 1-5
    energy_level: number; // 1-5
    notes?: string;
  }) {
    return request('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// SLEEP TRACKING
// ============================================================================

export const sleep = {
  /**
   * Get sleep history
   */
  async getHistory(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const query = params.toString();
    return request(`/sleep${query ? `?${query}` : ''}`);
  },

  /**
   * Create sleep entry
   */
  async create(data: {
    sleep_duration: number;
    sleep_quality: number; // 1-5
    bed_time?: string;
    wake_time?: string;
    notes?: string;
  }) {
    return request('/sleep', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get sleep averages
   */
  async getAverages() {
    return request('/sleep/averages');
  },
};

// ============================================================================
// SYMPTOM CHECKER (AI Chat)
// ============================================================================

export const symptomChecker = {
  /**
   * Get conversation history
   */
  async getConversations() {
    return request('/symptom-checker/conversations');
  },

  /**
   * Get a specific conversation
   */
  async getConversation(id: string) {
    return request(`/symptom-checker/conversations/${id}`);
  },

  /**
   * Save conversation
   */
  async saveConversation(data: {
    title?: string;
    messages: Array<{ role: string; content: string }>;
  }) {
    return request('/symptom-checker/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// PROVIDER DIRECTORY
// ============================================================================

export const providers = {
  /**
   * Search providers
   */
  async search(params: {
    query?: string;
    specialization?: string;
    insurance?: string;
    location?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    const query = searchParams.toString();
    return request(`/providers${query ? `?${query}` : ''}`);
  },

  /**
   * Get provider details
   */
  async getById(id: string) {
    return request(`/providers/${id}`);
  },

  /**
   * Track profile view
   */
  async trackView(id: string) {
    return request(`/providers/${id}/view`, { method: 'POST' });
  },

  /**
   * Submit contact request
   */
  async contact(id: string, message: string) {
    return request(`/providers/${id}/contact`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Report a provider
   */
  async report(id: string, reason: string, details?: string) {
    return request(`/providers/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details }),
    });
  },

  /**
   * Get provider reviews
   */
  async getReviews(id: string) {
    return request(`/providers/${id}/reviews`);
  },

  /**
   * Submit a review
   */
  async submitReview(id: string, data: { rating: number; comment: string }) {
    return request(`/providers/${id}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user's favorite providers
   */
  async getFavorites() {
    return request('/providers/favorites');
  },

  /**
   * Toggle favorite
   */
  async toggleFavorite(providerId: string) {
    return request('/providers/favorites', {
      method: 'POST',
      body: JSON.stringify({ providerId }),
    });
  },
};

// ============================================================================
// ARTICLES (Content)
// ============================================================================

export const articles = {
  /**
   * Get articles
   */
  async getAll(category?: string) {
    const query = category ? `?category=${category}` : '';
    return request(`/articles${query}`);
  },

  /**
   * Get user's bookmarks
   */
  async getBookmarks() {
    return request('/articles/bookmarks');
  },

  /**
   * Toggle bookmark
   */
  async toggleBookmark(articleId: string) {
    return request(`/articles/${articleId}/bookmark`, { method: 'POST' });
  },
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export const api = {
  auth,
  user,
  clarityScore,
  mood,
  sleep,
  symptomChecker,
  providers,
  articles,
};

export default api;
```

---

## Step 5: Use the API in Your Frontend

### Example: Login Page

```tsx
// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.auth.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      {error && <div className="error">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example: Auth Context Provider

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'provider' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      if (api.auth.isLoggedIn()) {
        try {
          const response = await api.auth.getCurrentUser();
          setUser(response.data?.user || null);
        } catch {
          // Token invalid, user will need to login again
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    const response = await api.auth.login(email, password);
    setUser(response.data?.user || null);
  }

  async function signup(email: string, password: string, name: string) {
    const response = await api.auth.signup(email, password, name);
    setUser(response.data?.user || null);
  }

  async function logout() {
    await api.auth.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Example: Dashboard with Data Fetching

```tsx
// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [sleepHistory, setSleepHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moodRes, sleepRes] = await Promise.all([
          api.mood.getHistory(),
          api.sleep.getHistory(),
        ]);
        setMoodHistory(moodRes.data || []);
        setSleepHistory(sleepRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>

      <section>
        <h2>Recent Mood Entries</h2>
        {moodHistory.map((entry: any) => (
          <div key={entry.id}>
            Mood: {entry.mood_level}/5 | Energy: {entry.energy_level}/5
          </div>
        ))}
      </section>

      <section>
        <h2>Recent Sleep</h2>
        {sleepHistory.map((entry: any) => (
          <div key={entry.id}>
            {entry.sleep_duration} hours | Quality: {entry.sleep_quality}/5
          </div>
        ))}
      </section>
    </div>
  );
}
```

---

## Complete API Reference

### Authentication (`/api/auth/*`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Create account | No |
| POST | `/auth/login` | Sign in | No |
| POST | `/auth/logout` | Sign out | Yes |
| POST | `/auth/refresh` | Refresh token | Refresh token |
| POST | `/auth/reset-password` | Request reset | No |
| POST | `/auth/update-password` | Set new password | Reset token |
| GET | `/auth/me` | Current user | Yes |
| POST | `/auth/2fa/verify` | Verify 2FA | Yes |

### User (`/api/user/*`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user/account` | Get account | Yes |
| PUT | `/user/account` | Update account | Yes |
| POST | `/user/account` | Request deletion | Yes |
| POST | `/user/account/cancel-deletion` | Cancel deletion | Yes |
| POST | `/user/password` | Change password | Yes |
| POST | `/user/email` | Change email | Yes |
| PUT | `/user/display-name` | Update name | Yes |
| GET/PUT | `/user/preferences` | Preferences | Yes |
| GET/PUT | `/user/privacy` | Privacy settings | Yes |
| POST | `/user/photo` | Upload photo | Yes |
| GET/POST | `/user/2fa` | 2FA setup | Yes |
| POST | `/user/2fa/verify` | Verify 2FA setup | Yes |
| GET | `/user/backup-codes` | Backup codes | Yes |
| GET/DELETE | `/user/trusted-devices` | Manage devices | Yes |
| GET/POST | `/user/data-export` | Data export | Yes |

### Clarity Score (`/api/clarity-score/*`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/assessment/questions` | Get questions | No |
| GET | `/clarity-score` | Get history | Yes |
| POST | `/clarity-score` | Save score | Optional |
| GET | `/clarity-score/stats` | Statistics | Yes |
| POST | `/clarity-score/link` | Link anon score | Yes |
| GET | `/clarity-score/[id]` | Get specific | Yes |
| DELETE | `/clarity-score/[id]` | Delete score | Yes |

### Mood & Sleep

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/mood` | Get mood history | Yes |
| POST | `/mood` | Create entry | Yes |
| GET | `/sleep` | Get sleep history | Yes |
| POST | `/sleep` | Create entry | Yes |
| GET | `/sleep/averages` | Get averages | Yes |

### Symptom Checker

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/symptom-checker/conversations` | List chats | Yes |
| POST | `/symptom-checker/conversations` | Save chat | Yes |
| GET | `/symptom-checker/conversations/[id]` | Get chat | Yes |

### Providers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/providers` | Search | No |
| GET | `/providers/[id]` | Get details | No |
| POST | `/providers/[id]/view` | Track view | No |
| POST | `/providers/[id]/contact` | Contact | Yes |
| POST | `/providers/[id]/report` | Report | Yes |
| GET | `/providers/[id]/reviews` | Get reviews | No |
| POST | `/providers/[id]/reviews` | Add review | Yes |
| GET | `/providers/favorites` | Get favorites | Yes |
| POST | `/providers/favorites` | Toggle favorite | Yes |

### Articles

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/articles` | Get articles | No |
| GET | `/articles/bookmarks` | Get bookmarks | Yes |
| POST | `/articles/[id]/bookmark` | Toggle bookmark | Yes |

---

## Authentication System

### How Auth Works

1. **Login**: POST to `/api/auth/login` returns `access_token` + `refresh_token`
2. **Store Tokens**: Save in localStorage
3. **Authenticated Requests**: Add `Authorization: Bearer <access_token>` header
4. **Token Expires**: Use refresh token to get new access token
5. **Logout**: Clear tokens from localStorage

### Token Lifecycle

```
┌─────────────────┐
│     LOGIN       │
│  email/password │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend Auth   │
│  (Supabase)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Returns:       │
│  - access_token │  (expires in 1 hour)
│  - refresh_token│  (long-lived)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Store in       │
│  localStorage   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  All API calls  │
│  include:       │
│  Authorization: │
│  Bearer <token> │
└─────────────────┘
```

### User Roles

| Role | Description | Access |
|------|-------------|--------|
| `patient` | Regular user | Assessments, tracking, provider directory |
| `provider` | Healthcare provider | + Profile management, dashboard |
| `admin` | Administrator | Full access to everything |

---

## All Credentials & Keys

### Supabase (Database + Auth)

```
URL: https://ozourhqyqtpppvpbhphw.supabase.co
Dashboard: https://supabase.com/dashboard/project/ozourhqyqtpppvpbhphw

Anon Key (safe for frontend):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b3VyaHF5cXRwcHB2cGJocGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTc3NDQsImV4cCI6MjA3ODg5Mzc0NH0.frxFMgcvbXKJBmiRPboGPPyL57P_qJ30wYueoAspKR0

Service Role Key (BACKEND ONLY - NEVER EXPOSE):
sb_secret_5E4KRGhF8MInskH5xYZnYg_cLdy3giw
```

### Sanity CMS (Content)

```
Project ID: w1sh63w6
Dataset: production
Dashboard: https://www.sanity.io/manage/personal/project/w1sh63w6

API Token (BACKEND ONLY):
skMc7aKLhvegBBz2UXnTZPYt6oK3jXiMWVYNPBg2dVZk83XBmbuyqxqV0dXsXUPb1yc1Zz8TEYNzl1P0bYZhmAqYFOo5tKDpmwm6pinhBUrceoHae7AWs6pi0o6mkUws11vGXetmN8h4xUpyfGqQK2Ssh8yD7DQqT5E7v9KrAIeNpatUleDp
```

### Google Gemini (AI)

```
API Key: AIzaSyAFnxpTZN2kWOJ9A-L4C9PPkJ5BHxkomCA
Console: https://aistudio.google.com/app/apikey
```

---

## Direct Database Access (Optional)

If you want to query the database directly from your frontend (bypassing the API), you can use the Supabase client:

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Create Supabase Client

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozourhqyqtpppvpbhphw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96b3VyaHF5cXRwcHB2cGJocGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTc3NDQsImV4cCI6MjA3ODg5Mzc0NH0.frxFMgcvbXKJBmiRPboGPPyL57P_qJ30wYueoAspKR0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Direct Auth Example

```typescript
// Sign up directly with Supabase
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { name: 'John Doe', role: 'patient' }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign out
await supabase.auth.signOut();
```

### Direct Database Query Example

```typescript
// Get mood entries
const { data, error } = await supabase
  .from('mood_entries')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

**Note**: Direct Supabase access is subject to Row Level Security (RLS) policies. The API routes have additional business logic that direct access may bypass.

---

## Deployment

### Backend Deployment (Vercel)

```bash
cd main_backend
npx vercel

# Set environment variables in Vercel dashboard
# Get your deployment URL: https://your-app.vercel.app
```

### Frontend Deployment

```bash
cd my-psychage-frontend

# Build
npm run build

# Deploy to Vercel
npx vercel

# OR deploy to Netlify, etc.
```

### Production Environment Variables

**Backend** (Vercel Environment Variables):
```
NEXT_PUBLIC_SUPABASE_URL=https://ozourhqyqtpppvpbhphw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_SANITY_PROJECT_ID=w1sh63w6
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=skMc7a...
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_BASE_URL=https://your-backend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend** (`.env.production`):
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## Quick Reference

### Running Development

```bash
# Terminal 1: Backend
cd main_backend && npm run dev
# → http://localhost:3000

# Terminal 2: Frontend
cd my-frontend && npm run dev
# → http://localhost:5173
```

### API Base URL

```
Development: http://localhost:3000/api
Production: https://your-backend.vercel.app/api
```

### Auth Header

```
Authorization: Bearer <access_token>
```

### User Roles

```
patient | provider | admin
```

---

**Document Version**: 1.0
**Created**: December 30, 2025
**Purpose**: Connect a separate frontend to the Psychage backend

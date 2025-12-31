/**
 * API Client for Elite Athletics Performance System
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============ AUTH ============
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(data: { email: string; password: string; name: string; role?: string }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  // ============ ATHLETES ============
  async getAthletes(params?: { page?: number; limit?: number; search?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/athletes${query ? `?${query}` : ''}`);
  }

  async getAthlete(id: string) {
    return this.request<any>(`/athletes/${id}`);
  }

  async getAthleteProfile(id: string) {
    return this.request<any>(`/athletes/${id}/profile`);
  }

  async createAthlete(data: any) {
    return this.request<any>('/athletes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAthlete(id: string, data: any) {
    return this.request<any>(`/athletes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAthleteStats(id: string) {
    return this.request<any>(`/athletes/${id}/stats`);
  }

  // ============ WELLNESS ============
  async submitWellness(data: any) {
    return this.request<any>('/wellness', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWellnessHistory(athleteId: string, params?: { startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/wellness/athlete/${athleteId}${query ? `?${query}` : ''}`);
  }

  async getTodayWellness(athleteId: string) {
    return this.request<any>(`/wellness/athlete/${athleteId}/today`);
  }

  async getReadinessScore(athleteId: string) {
    return this.request<any>(`/wellness/athlete/${athleteId}/readiness`);
  }

  async getWellnessTrends(athleteId: string, days?: number) {
    return this.request<any>(`/wellness/athlete/${athleteId}/trends${days ? `?days=${days}` : ''}`);
  }

  // ============ SESSIONS ============
  async getSessions(athleteId: string, params?: { status?: string; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<any>(`/sessions/athlete/${athleteId}${query ? `?${query}` : ''}`);
  }

  async getSession(id: string) {
    return this.request<any>(`/sessions/${id}`);
  }

  async createSession(data: any) {
    return this.request<any>('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completeSession(id: string, data: any) {
    return this.request<any>(`/sessions/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTodaySessions(athleteId: string) {
    return this.request<any>(`/sessions/athlete/${athleteId}/today`);
  }

  // ============ LOAD MONITORING ============
  async getLoadMetrics(athleteId: string) {
    return this.request<any>(`/load/${athleteId}/metrics`);
  }

  async getLoadHistory(athleteId: string, days?: number) {
    return this.request<any>(`/load/${athleteId}/history${days ? `?days=${days}` : ''}`);
  }

  async recordLoad(athleteId: string, data: any) {
    return this.request<any>(`/load/${athleteId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ============ PLANNING ============
  async getMacrocycles(athleteId: string) {
    return this.request<any>(`/planning/macrocycle/athlete/${athleteId}`);
  }

  async createMacrocycle(data: any) {
    return this.request<any>('/planning/macrocycle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentMesocycle(athleteId: string) {
    return this.request<any>(`/planning/mesocycle/athlete/${athleteId}/current`);
  }

  async getCompetitions(athleteId: string) {
    return this.request<any>(`/planning/competition/athlete/${athleteId}`);
  }

  async getUpcomingCompetitions(athleteId: string) {
    return this.request<any>(`/planning/competition/athlete/${athleteId}/upcoming`);
  }

  // ============ REPORTS ============
  async getPerformanceReport(athleteId: string, period?: string) {
    return this.request<any>(`/reports/performance/${athleteId}${period ? `?period=${period}` : ''}`);
  }

  async getLoadReport(athleteId: string) {
    return this.request<any>(`/reports/load/${athleteId}`);
  }

  async getWellnessReport(athleteId: string) {
    return this.request<any>(`/reports/wellness/${athleteId}`);
  }

  async getCoachSummary() {
    return this.request<any>('/reports/coach-summary');
  }

  // ============ ALERTS ============
  async getAlerts(athleteId?: string) {
    return this.request<any>(`/alerts${athleteId ? `?athleteId=${athleteId}` : ''}`);
  }

  async acknowledgeAlert(id: string) {
    return this.request<any>(`/alerts/${id}/acknowledge`, {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
export default api;

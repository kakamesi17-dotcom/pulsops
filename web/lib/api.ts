// API Client for PulsOps Web Frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface UserSession {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'SUPER_ADMIN' | 'GYM_ADMIN' | 'TRAINER' | 'MEMBER';
    gymId?: string;
    gymName?: string;
  };
}

export const getStoredSession = (): UserSession | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('pulsops_session');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setStoredSession = (session: UserSession): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pulsops_session', JSON.stringify(session));
  }
};

export const clearStoredSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pulsops_session');
  }
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = getStoredSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status = 500, errors = {}, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

export async function api(path, opts = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE + path, {
    credentials: 'include',
    ...opts,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.message || 'Request failed',
      res.status,
      data.errors || {},
      data
    );
  }

  return data;
}

export const authApi = {
  async register(payload) {
    return api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async login(payload) {
    return api('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  async getMe() {
    return api('/auth/me');
  },
  async logout() {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('token');
  },
  async updateProfile(profile) {
    return api('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    });
  }
};

export const img = (u) => {
  if (!u) return '/media/hanger-1.jpg';
  if (u.startsWith('http')) return u;
  if (u.startsWith('/uploads')) {
    return (import.meta.env.VITE_API_ORIGIN || 'http://localhost:5000') + u;
  }
  return u;
};

export async function uploadFiles(files) {
  const token = localStorage.getItem('token');
  const fd = new FormData();
  [...files].forEach(f => fd.append('files', f));
  const res = await fetch(BASE + '/uploads', {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(data.message || 'Upload failed', res.status, data.errors, data);
  return data.files;
}

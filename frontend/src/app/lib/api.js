"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(error.error || 'Error en la solicitud');
  }
  return response.json();
};

export const auth = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(response);
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const expedientes = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/expedientes?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/expedientes/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/expedientes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/expedientes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  submitForReview: async (id) => {
    const response = await fetch(`${API_URL}/expedientes/${id}/revision`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const indicios = {
  getByExpediente: async (expedienteId) => {
    const response = await fetch(`${API_URL}/expedientes/${expedienteId}/indicios`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (expedienteId, data) => {
    const response = await fetch(`${API_URL}/expedientes/${expedienteId}/indicios`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/expedientes/indicios/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/expedientes/indicios/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const revision = {
  getPending: async () => {
    const response = await fetch(`${API_URL}/revision/pendientes`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  approve: async (id) => {
    const response = await fetch(`${API_URL}/revision/${id}/aprobar`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  reject: async (id, justificacion) => {
    const response = await fetch(`${API_URL}/revision/${id}/rechazar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ justificacion }),
    });
    return handleResponse(response);
  },
};

export const reportes = {
  getRegistros: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/reportes/registros?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getEstadisticas: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/reportes/estadisticas?${params}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

const API_BASE = import.meta?.env?.VITE_API_BASE || 'https://moody-mood-journal-app-version-2.onrender.com';
export const getAuthToken = () => {
  try {
    return localStorage.getItem('token') || '';
  } catch {
    return '';
  }
};

const buildHeaders = (headers = {}, includeJson = true) => {
  const token = getAuthToken();
  const baseHeaders = includeJson ? { 'Content-Type': 'application/json' } : {};
  if (token) {
    baseHeaders['Authorization'] = `Bearer ${token}`;
  }
  return { ...baseHeaders, ...headers };
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();
  if (!response.ok) {
    const message = isJson && data && data.message ? data.message : 'Request failed';
    throw new Error(message);
  }
  return data;
};

export const apiGet = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: buildHeaders(options.headers, false),
    ...options,
  }).then(handleResponse);
};

export const apiPost = (path, body, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(options.headers, true),
    body: JSON.stringify(body ?? {}),
    ...options,
  }).then(handleResponse);
};

export const apiDelete = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(options.headers, false),
    ...options,
  }).then(handleResponse);
};

// New high-level API helpers
export const sendAnonymousMessage = (message, conversationHistory = []) =>
  apiPost('/api/chat/anonymous', { message, conversationHistory });

export const createVentEntry = ({ text }) =>
  apiPost('/api/vent', { text });

export const listVentEntries = () =>
  apiGet('/api/vent');

export const translateForIndianParent = (text) =>
  apiPost('/api/translate/indian-parent', { text });



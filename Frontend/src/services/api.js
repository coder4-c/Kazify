const API_BASE_URL = 'http://localhost:4000/api';

// Helper function for API calls
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getMe: () => fetchAPI('/auth/me'),
};

// Jobs API
export const jobsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/jobs${query ? `?${query}` : ''}`);
  },
  
  create: (jobData) => fetchAPI('/jobs', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),
};

// Internships API
export const internshipsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/internships${query ? `?${query}` : ''}`);
  },
  
  create: (internshipData) => fetchAPI('/internships', {
    method: 'POST',
    body: JSON.stringify(internshipData),
  }),
};

// Scholarships API
export const scholarshipsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/scholarships${query ? `?${query}` : ''}`);
  },
  
  create: (scholarshipData) => fetchAPI('/scholarships', {
    method: 'POST',
    body: JSON.stringify(scholarshipData),
  }),
};

// Training API
export const trainingAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/training${query ? `?${query}` : ''}`);
  },
  
  create: (trainingData) => fetchAPI('/training', {
    method: 'POST',
    body: JSON.stringify(trainingData),
  }),
};

// Marketplace API
export const marketplaceAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/marketplace${query ? `?${query}` : ''}`);
  },
  
  submit: (productData) => fetchAPI('/marketplace', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  getMyProducts: () => fetchAPI('/marketplace/my'),
  
  // Admin functions
  getPending: () => fetchAPI('/admin/marketplace/pending'),
  
  verify: (id, status, rejectionReason) => fetchAPI(`/admin/marketplace/${id}/verify`, {
    method: 'PUT',
    body: JSON.stringify({ status, rejectionReason }),
  }),
};

// Helper to save token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper to remove token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Helper to get token
export const getToken = () => {
  return localStorage.getItem('token');
};

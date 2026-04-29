/**
 * API Service untuk autentikasi customer
 * Dapat diintegrasikan ke dalam context atau hook React
 */

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Helper function untuk extract error message dari API response
const getErrorMessage = (result: any): string => {
  let errorMessage = result.message || 'Request failed';
  
  if (result.errors && typeof result.errors === 'object') {
    const fieldErrors = Object.entries(result.errors)
      .map(([field, messages]: [string, any]) => {
        if (Array.isArray(messages)) {
          return messages.join(', ');
        }
        return String(messages);
      })
      .filter(msg => msg.length > 0);
    
    if (fieldErrors.length > 0) {
      errorMessage = fieldErrors.join(' | ');
    }
  }
  
  return errorMessage;
};

export const authService = {
  /**
   * Register Customer Baru
   */
  register: async (data) => {
    try {
      const response = await fetch(`${API_URL}/customer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        const errorMessage = getErrorMessage(result);
        throw new Error(errorMessage);
      }

      // Normalize response: API returns 'user' not 'customer'
      const userData = result.user || result.customer;
      if (!userData) {
        throw new Error('Invalid response: no user data found');
      }

      // Normalize customer data sesuai dengan API response
      const normalizedCustomer = {
        id: userData.id,
        fullName: userData.name || userData.fullName || '',
        email: userData.email || '',
        phone_number: userData.phone_number || userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        province: userData.province || '',
        postalCode: userData.postalCode || userData.postal_code || '',
      };

      // Simpan token ke localStorage
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('customer', JSON.stringify(normalizedCustomer));
      }

      // Return normalized response
      return {
        success: true,
        message: result.message,
        token: result.token,
        customer: normalizedCustomer,
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  /**
   * Login Customer
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        const errorMessage = getErrorMessage(result);
        throw new Error(errorMessage);
      }

      // Normalize response: API returns 'user' not 'customer'
      const userData = result.user || result.customer;
      if (!userData) {
        throw new Error('Invalid response: no user data found');
      }

      // Normalize customer data sesuai dengan API response
      const normalizedCustomer = {
        id: userData.id,
        fullName: userData.name || userData.fullName || '',
        email: userData.email || '',
        phone_number: userData.phone_number || userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        province: userData.province || '',
        postalCode: userData.postalCode || userData.postal_code || '',
      };

      // Simpan token ke localStorage
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('customer', JSON.stringify(normalizedCustomer));
      }

      // Return normalized response
      return {
        success: true,
        message: result.message,
        token: result.token,
        customer: normalizedCustomer,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Get Current User Profile
   */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/customer/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        const errorMessage = getErrorMessage(result);
        throw new Error(errorMessage);
      }

      // Normalize response: API returns 'user' not 'customer'
      const userData = result.user || result.customer || result.data;
      if (userData) {
        const normalizedCustomer = {
          id: userData.id,
          fullName: userData.name || userData.fullName || '',
          email: userData.email || '',
          phone_number: userData.phone_number || userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          province: userData.province || '',
          postalCode: userData.postalCode || userData.postal_code || '',
        };

        return {
          success: true,
          customer: normalizedCustomer,
        };
      }

      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Update Customer Profile
   */
  updateProfile: async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URL}/customer/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        const errorMessage = getErrorMessage(result);
        throw new Error(errorMessage);
      }

      // Normalize response
      const userData = result.user || result.customer || result.data;
      if (userData) {
        const normalizedCustomer = {
          id: userData.id,
          fullName: userData.name || userData.fullName || '',
          email: userData.email || '',
          phone_number: userData.phone_number || userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          province: userData.province || '',
          postalCode: userData.postalCode || userData.postal_code || '',
        };

        // Update customer data di localStorage
        localStorage.setItem('customer', JSON.stringify(normalizedCustomer));

        return {
          success: true,
          message: result.message,
          customer: normalizedCustomer,
        };
      }

      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Logout Customer
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
  },

  /**
   * Get Token
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Get Stored Customer Data
   */
  getStoredCustomer: () => {
    try {
      const customer = localStorage.getItem('customer');
      // Handle invalid localStorage values
      if (!customer || customer === 'undefined' || customer === 'null') {
        return null;
      }
      return JSON.parse(customer);
    } catch (error) {
      console.error('Error parsing stored customer:', error);
      // Clear corrupted data
      localStorage.removeItem('customer');
      return null;
    }
  },

  /**
   * Is User Authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

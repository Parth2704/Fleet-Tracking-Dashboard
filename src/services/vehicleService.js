import axios from 'axios';

const BASE_URL = 'https://case-study-26cf.onrender.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await apiClient.get('/api/vehicles');
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to fetch vehicles. Please try again.');
    }
  },

  getVehicleById: async (id) => {
    try {
      const response = await apiClient.get(`/api/vehicles/${id}`);
      return response.data.data || {};
    } catch (error) {
      console.error(`Error fetching vehicle ${id}:`, error);
      throw new Error(`Failed to fetch vehicle details. Please try again.`);
    }
  },

  getVehiclesByStatus: async (status) => {
    try {
      const response = await apiClient.get(`/api/vehicles/status/${status}`);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error(`Error fetching vehicles with status ${status}:`, error);
      throw new Error('Failed to fetch filtered vehicles. Please try again.');
    }
  },

  getStatistics: async () => {
    try {
      const response = await apiClient.get('/api/statistics');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch fleet statistics. Please try again.');
    }
  },
};

export const vehicleUtils = {
  formatStatus: (status) => {
    if (!status) return 'Unknown';
    return status.replace('_', ' ').toUpperCase();
  },

  getStatusColor: (status) => {
    const statusColors = {
      delivered: {bg:'#ebfcf4',text:'#008f60'},
      idle: {bg:'#f2f3f6',text:'#424c5b'},
      en_route: {bg:'#f0f5ff',text:'#407fe2'},
      moving: {bg:'#f0f5ff',text:'#407fe2'},
    };
    return statusColors[status?.toLowerCase()] || 'default';
  },

  formatSpeed: (speed) => {
    return `${speed || 0} mph`;
  },

  formatCoordinates: (lat, lng) => {
    if (!lat || !lng) return 'N/A';
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  },

formatAgo(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  } else {
    return `${Math.floor(seconds / 60)}m`;
  }
}
};
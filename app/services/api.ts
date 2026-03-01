import axios from 'axios';
import { Vehicle, Employee, InspectionData } from '../types';

const API_BASE_URL = 'https://fleet-manager-ebrose1.replit.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Fetch all vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const response = await api.get('/vehicles');
    return response.data;
  },

  // Fetch all employees
  async getEmployees(): Promise<Employee[]> {
    const response = await api.get('/employees');
    return response.data;
  },

  // Get last odometer reading for a vehicle
  async getLastOdometer(vehicleId: string): Promise<number | null> {
    try {
      const response = await api.get(`/mileage-logs?vehicleId=${vehicleId}&limit=1`);
      if (response.data && response.data.length > 0) {
        return response.data[0].odometer;
      }
      return null;
    } catch (error) {
      console.error('Error fetching last odometer:', error);
      return null;
    }
  },

  // Submit inspection report
  async submitInspection(data: InspectionData): Promise<any> {
    const response = await api.post('/inspection-reports', data);
    return response.data;
  },

  // Check if server is reachable
  async healthCheck(): Promise<boolean> {
    try {
      await api.get('/version');
      return true;
    } catch (error) {
      return false;
    }
  },
};

export default apiService;
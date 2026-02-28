/**
 * api.js — Axios client and API helper functions for HRMS Lite.
 *
 * The base URL defaults to localhost for development and can be overridden
 * via the VITE_API_URL environment variable for production deployments.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

// Shared Axios instance with default headers
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ── Employee endpoints ────────────────────────────────────────────────────────
export const getEmployees = () => api.get('employees/');
export const addEmployee = (data) => api.post('employees/', data);
export const deleteEmployee = (id) => api.delete(`employees/${id}/`);

// ── Attendance endpoints ──────────────────────────────────────────────────────
// params: { employee_id?, start_date?, end_date? }
export const getAttendance = (params = {}) => api.get('attendance/', { params });
export const markAttendance = (data) => api.post('attendance/', data);
export const updateAttendance = (id, data) => api.patch(`attendance/${id}/`, data);
export const deleteAttendance = (id) => api.delete(`attendance/${id}/`);

// ── Statistics & Dashboard ────────────────────────────────────────────────────
// Same filter params supported as getAttendance
export const getAttendanceStatistics = (params = {}) => api.get('attendance/statistics/', { params });
export const getDashboardStats = () => api.get('attendance/dashboard_stats/');

export default api;

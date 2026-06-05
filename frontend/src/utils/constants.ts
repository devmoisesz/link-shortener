export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ENDPOINTS = {
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  REFRESH: '/users/refresh',
  SHORTEN: '/shortener/api/shorten',
  GET_URLS: '/shortener/api/urls',
  DELETE_URL: '/shortener/api/:shortCode',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000;

export const DEFAULT_PAGE_LIMIT = 10;

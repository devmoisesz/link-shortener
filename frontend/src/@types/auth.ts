export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface ShortUrl {
  _id: string;
  shortCode: string;
  longUrl: string;
  createdAt: string;
  userId: string;
}

export interface GetUrlsResponse {
  urls: ShortUrl[];
  total: number;
  page: number;
  limit: number;
}

export interface ShortenUrlResponse {
  shortCode?: string;
  schortCode?: string;
  shortUrl?: string;
  longUrl?: string;
  createdAt?: string;
  userId: string;
}

export type ApiError = {
  message: string;
  statusCode?: number;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

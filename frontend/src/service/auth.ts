import { ENDPOINTS } from '../utils/constants';
import { apiCall } from './api';

async function login(email: string, password: string): Promise<Response> {
  return apiCall(ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

async function register(
  name: string,
  email: string,
  password: string,
): Promise<Response> {
  return apiCall(ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

async function refreshAccessToken(refreshToken: string): Promise<Response> {
  return apiCall(ENDPOINTS.REFRESH, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export { login, refreshAccessToken, register };

export default {
  login,
  register,
  refreshAccessToken,
};

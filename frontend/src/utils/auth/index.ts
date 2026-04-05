import { authAPI, type RegisterData, type LoginData, type AuthResponse } from './api';
import { tokenStorage } from './storage';

export const auth = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authAPI.register(data);
    tokenStorage.setTokens(response.tokens.access, response.tokens.refresh);
    tokenStorage.setUser(response.user);
    return response;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await authAPI.login(data);
    tokenStorage.setTokens(response.tokens.access, response.tokens.refresh);
    tokenStorage.setUser(response.user);
    return response;
  },

  logout: () => {
    tokenStorage.clearTokens();
  },

  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },

  getUser: () => {
    return tokenStorage.getUser();
  },

  refreshToken: async (): Promise<string> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await authAPI.refreshToken(refreshToken);
    tokenStorage.setTokens(response.access, refreshToken);
    return response.access;
  },
};

export * from './api';
export * from './storage';

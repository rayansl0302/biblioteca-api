import api from './api';
import type { User } from '../types';

export interface LoginResponse {
  token: string;
  user: User;
}

export function login(email: string, password: string) {
  return api.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data);
}

export function register(name: string, email: string, password: string) {
  return api.post<User>('/auth/register', { name, email, password }).then((r) => r.data);
}

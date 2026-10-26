import api from './api';
import type { User } from '../types';

export function listUsers() {
  return api.get<User[]>('/users').then((r) => r.data);
}

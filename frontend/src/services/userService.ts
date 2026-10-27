import api from './api';
import type { User, Role } from '../types';

export function listUsers() {
  return api.get<User[]>('/users').then((r) => r.data);
}

export function getUser(id: number) {
  return api.get<User>(`/users/${id}`).then((r) => r.data);
}

export function createUser(data: { name: string; email: string; password: string; role: Role }) {
  return api.post<User>('/users', data).then((r) => r.data);
}

export function updateUser(id: number, data: { name: string; email: string; role: Role }) {
  return api.put<User>(`/users/${id}`, data).then((r) => r.data);
}

export function deleteUser(id: number) {
  return api.delete(`/users/${id}`);
}

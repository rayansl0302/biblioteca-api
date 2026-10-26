import api from './api';
import type { Book } from '../types';

export interface BookFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export function listBooks(filters: BookFilters = {}) {
  return api.get<Book[]>('/books', { params: filters }).then((r) => r.data);
}

export function getBook(id: number) {
  return api.get<Book>(`/books/${id}`).then((r) => r.data);
}

export interface BookInput {
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  total_copies: number;
  available_copies?: number;
}

export function createBook(data: BookInput) {
  return api.post<Book>('/books', data).then((r) => r.data);
}

export function updateBook(id: number, data: BookInput) {
  return api.put<Book>(`/books/${id}`, data).then((r) => r.data);
}

export function deleteBook(id: number) {
  return api.delete(`/books/${id}`);
}

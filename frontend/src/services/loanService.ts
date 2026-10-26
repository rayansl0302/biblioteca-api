import api from './api';
import type { Loan } from '../types';

export function listLoans(status?: string) {
  return api.get<Loan[]>('/loans', { params: status ? { status } : {} }).then((r) => r.data);
}

export function createLoan(bookId: number) {
  return api.post<Loan>('/loans', { bookId }).then((r) => r.data);
}

export function returnLoan(id: number) {
  return api.put<Loan>(`/loans/${id}/return`).then((r) => r.data);
}

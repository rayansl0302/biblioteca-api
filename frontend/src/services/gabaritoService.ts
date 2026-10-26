import api from './api';
import type { Gabarito } from '../types';

export function getGabarito() {
  return api.get<Gabarito>('/gabarito').then((r) => r.data);
}

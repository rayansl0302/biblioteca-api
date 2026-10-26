import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

export function ProtectedRoute({ children, requireRole }: { children: ReactNode; requireRole?: Role }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="center-message">Carregando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/" replace />;

  return <>{children}</>;
}

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="container page"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname, message: 'Please login before continuing.' }} replace />;
  return children;
}

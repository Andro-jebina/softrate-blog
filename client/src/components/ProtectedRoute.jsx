import { Navigate } from 'react-router-dom';
import { getToken } from '../services/api.js';

// Sends visitors without a token to the login page.
// (The backend also checks the token on every admin API call.)
export default function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

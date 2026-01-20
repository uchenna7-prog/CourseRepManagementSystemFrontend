import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

const PublicRoute = ({ children }) => {
  const { accessToken, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;

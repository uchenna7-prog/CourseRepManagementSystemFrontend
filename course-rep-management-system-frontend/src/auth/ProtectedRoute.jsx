import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { accessToken, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // you can replace with a spinner
  }

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

import { useAuthContext } from "./AuthContext";
import { login, logout } from "./authService";

export const useAuth = () => {
  const { accessToken, setAccessToken, user, setUser } = useAuthContext();

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logoutUser = async () => {
    await logout();
    setAccessToken(null);
    setUser(null);
  };

  return {
    accessToken,
    user,
    loginUser,
    logoutUser,
    isAuthenticated: !!accessToken,
  };
};

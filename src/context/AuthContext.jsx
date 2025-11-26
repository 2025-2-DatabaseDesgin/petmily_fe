import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 초기 인증 상태 확인
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("인증 초기화 실패:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 로그인
  const login = useCallback(async (loginIdentifier, password) => {
    const response = await authAPI.login({ loginIdentifier, password });
    const { accessToken, refreshToken } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // 프로필 정보도 가져오기
    const profileResponse = await authAPI.getProfile();
    setUser(profileResponse.data);
    setIsAuthenticated(true);

    return response;
  }, []);

  // 회원가입
  const register = useCallback(async (data) => {
    const response = await authAPI.register(data);
    const { accessToken, refreshToken, user: newUser } = response.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(newUser);
    setIsAuthenticated(true);

    return response;
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // 프로필 새로고침
  const refreshProfile = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("프로필 새로고침 실패:", error);
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내에서 사용해야 합니다");
  }
  return context;
};

export default AuthContext;

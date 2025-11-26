import api from "./index";

export const authAPI = {
  // 회원가입
  register: (data) => api.post("/auth/register", data),

  // 로그인
  login: (data) => api.post("/auth/login", data),

  // 토큰 갱신
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),

  // 로그아웃
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),

  // 현재 사용자 정보 조회 (간단)
  getMe: () => api.get("/auth/me"),

  // 프로필 조회 (상세)
  getProfile: () => api.get("/auth/profile"),
};

export default authAPI;

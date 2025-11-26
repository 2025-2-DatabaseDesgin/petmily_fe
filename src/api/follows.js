import api from './index';

export const followsAPI = {
  // 팔로우
  follow: (userId) => api.post(`/follows/${userId}`),

  // 언팔로우
  unfollow: (userId) => api.delete(`/follows/${userId}`),

  // 팔로우 상태 조회
  getStatus: (userId) => api.get(`/follows/${userId}/status`),

  // 팔로워 목록 조회
  getFollowers: (userId, params = {}) => 
    api.get(`/follows/${userId}/followers`, { params }),

  // 팔로잉 목록 조회
  getFollowing: (userId, params = {}) => 
    api.get(`/follows/${userId}/following`, { params }),

  // 팔로우 통계 조회
  getStats: (userId) => api.get(`/follows/${userId}/stats`),
};

export default followsAPI;


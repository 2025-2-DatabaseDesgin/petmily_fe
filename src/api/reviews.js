import api from './index';

export const reviewsAPI = {
  // 후기 작성
  create: (data) => api.post('/reviews', data),

  // 후기 상세 조회
  getById: (id) => api.get(`/reviews/${id}`),

  // 후기 수정
  update: (id, data) => api.patch(`/reviews/${id}`, data),

  // 후기 삭제
  delete: (id) => api.delete(`/reviews/${id}`),

  // 세션의 후기 목록 조회
  getBySessionId: (sessionId) => api.get(`/reviews/sessions/${sessionId}`),

  // 산책로의 후기 목록 조회
  getByRouteId: (routeId, params = {}) => 
    api.get(`/reviews/routes/${routeId}`, { params }),

  // 사용자의 후기 목록 조회
  getByUserId: (userId, params = {}) => 
    api.get(`/reviews/users/${userId}`, { params }),
};

export default reviewsAPI;


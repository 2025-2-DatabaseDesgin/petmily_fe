import api from './index';

export const sessionsAPI = {
  // 산책 세션 목록 조회
  getAll: (params = {}) => api.get('/sessions', { params }),

  // 산책 세션 시작 (호스트)
  start: (mateId) => api.post('/sessions', { mateId }),

  // 산책 세션 상세 조회
  getById: (id) => api.get(`/sessions/${id}`),

  // 산책 세션 종료 (호스트)
  end: (id, data = {}) => api.patch(`/sessions/${id}/end`, data),
};

export default sessionsAPI;


import api from './index';

export const routesAPI = {
  // 산책로 목록 조회
  getAll: (params = {}) => api.get('/routes', { params }),

  // 산책로 생성
  create: (data) => api.post('/routes', data),

  // 산책로 상세 조회
  getById: (id) => api.get(`/routes/${id}`),

  // 산책로 수정
  update: (id, data) => api.patch(`/routes/${id}`, data),

  // 산책로 삭제
  delete: (id) => api.delete(`/routes/${id}`),

  // 산책로 주변 시설 조회
  getFacilities: (id) => api.get(`/routes/${id}/facilities`),
};

export default routesAPI;


import api from './index';

export const facilitiesAPI = {
  // 시설 목록 조회
  getAll: (params = {}) => api.get('/facilities', { params }),

  // 시설 생성 (관리자)
  create: (data) => api.post('/facilities', data),

  // 시설 상세 조회
  getById: (id) => api.get(`/facilities/${id}`),

  // 시설 수정 (관리자)
  update: (id, data) => api.patch(`/facilities/${id}`, data),

  // 시설 삭제 (관리자)
  delete: (id) => api.delete(`/facilities/${id}`),
};

export default facilitiesAPI;


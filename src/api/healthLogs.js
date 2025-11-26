import api from './index';

export const healthLogsAPI = {
  // 건강 로그 생성
  create: (data) => api.post('/health-logs', data),

  // 건강 로그 상세 조회
  getById: (id) => api.get(`/health-logs/${id}`),

  // 건강 로그 수정
  update: (id, data) => api.patch(`/health-logs/${id}`, data),

  // 건강 로그 삭제
  delete: (id) => api.delete(`/health-logs/${id}`),

  // 반려동물의 건강 로그 목록 조회
  getByPetId: (petId, params = {}) => 
    api.get(`/health-logs/pets/${petId}`, { params }),
};

export default healthLogsAPI;


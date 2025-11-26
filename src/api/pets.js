import api from './index';

export const petsAPI = {
  // 반려동물 등록
  create: (data) => api.post('/pets', data),

  // 내 반려동물 목록 조회
  getMyPets: () => api.get('/pets'),

  // 반려동물 상세 조회
  getById: (id) => api.get(`/pets/${id}`),

  // 반려동물 정보 수정
  update: (id, data) => api.patch(`/pets/${id}`, data),

  // 반려동물 삭제
  delete: (id) => api.delete(`/pets/${id}`),

  // 반려동물 친구 요청
  sendFriendRequest: (petId, targetPetId) => 
    api.post(`/pets/${petId}/friends`, { targetPetId }),

  // 반려동물 친구 목록 조회
  getFriends: (petId) => api.get(`/pets/${petId}/friends`),

  // 받은 친구 요청 목록 조회
  getFriendRequests: () => api.get('/pets/friends/requests'),

  // 친구 요청 승인/거절
  respondToFriendRequest: (requestId, accept) => 
    api.patch(`/pets/friends/${requestId}`, { accept }),
};

export default petsAPI;


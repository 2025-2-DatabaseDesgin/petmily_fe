import api from "./index";

export const walkingMatesAPI = {
  // 산책 메이트 목록 조회
  getAll: (params = {}) => api.get("/walking-mates", { params }),

  // 산책 메이트 모집 생성
  create: (data) => api.post("/walking-mates", data),

  // 산책 메이트 상세 조회
  getById: (id) => api.get(`/walking-mates/${id}`),

  // 산책 메이트 수정
  update: (id, data) => api.patch(`/walking-mates/${id}`, data),

  // 산책 메이트 삭제
  delete: (id) => api.delete(`/walking-mates/${id}`),

  // 산책 메이트 참가 신청
  join: (id, petIds) => api.post(`/walking-mates/${id}/join`, { petIds }),

  // 산책 메이트 참가 취소
  leave: (id) => api.delete(`/walking-mates/${id}/leave`),

  // 참가 승인 (호스트)
  approveParticipant: (participantId) =>
    api.patch(`/walking-mates/participants/${participantId}/approve`),

  // 참가 거절 (호스트)
  rejectParticipant: (participantId) =>
    api.patch(`/walking-mates/participants/${participantId}/reject`),

  // 대기 취소
  cancelWaitlist: (waitlistId) =>
    api.delete(`/walking-mates/waitlist/${waitlistId}`),
};

export default walkingMatesAPI;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Badge, Modal, Input, Loading, Avatar } from "../components/common";
import walkingMatesAPI from "../api/walkingMates";
import styles from "./WalkingMates.module.css";

const WalkingMates = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mates, setMates] = useState([]);
  const [filter, setFilter] = useState("OPEN");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    walkingDate: "",
    walkingTime: "",
    location: "",
    duration: 60,
    maxParticipants: 5,
    petSizeFilter: "ALL",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMates();
  }, [filter]);

  const fetchMates = async () => {
    try {
      const params = { limit: 20 };
      if (filter) params.status = filter;
      const response = await walkingMatesAPI.getAll(params);
      setMates(response.data?.mates || []);
    } catch (err) {
      console.error("산책 메이트 목록 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.walkingDate || !formData.walkingTime || !formData.location) {
      setError("필수 항목을 입력해주세요");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const walkingDate = new Date(`${formData.walkingDate}T${formData.walkingTime}`).toISOString();
      await walkingMatesAPI.create({
        walkingDate,
        location: formData.location,
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
        petSizeFilter: formData.petSizeFilter,
        description: formData.description,
      });
      setShowCreateModal(false);
      setFormData({
        walkingDate: "",
        walkingTime: "",
        location: "",
        duration: 60,
        maxParticipants: 5,
        petSizeFilter: "ALL",
        description: "",
      });
      fetchMates();
    } catch (err) {
      setError(err.message || "생성에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSizeLabel = (size) => {
    const labels = { ALL: "모든 크기", SMALL: "소형", MEDIUM: "중형", LARGE: "대형" };
    return labels[size] || size;
  };

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  return (
    <div className={styles.page}>
      {/* Filter Tabs */}
      <div className={styles.tabs}>
        {[
          { value: "OPEN", label: "모집중" },
          { value: "FULL", label: "마감" },
          { value: "", label: "전체" },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${filter === tab.value ? styles.active : ""}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mate List */}
      <div className={styles.list}>
        {mates.length > 0 ? (
          mates.map((mate) => (
            <Card
              key={mate.id}
              className={styles.mateCard}
              onClick={() => navigate(`/walking-mates/${mate.id}`)}
            >
              <div className={styles.mateHeader}>
                <div className={styles.mateBadges}>
                  <Badge variant={mate.status === "OPEN" ? "success" : "default"} size="sm">
                    {mate.status === "OPEN" ? "모집중" : "마감"}
                  </Badge>
                  <Badge variant="primary" size="sm">
                    {getSizeLabel(mate.petSizeFilter)}
                  </Badge>
                </div>
                <span className={styles.mateParticipants}>
                  👥 {mate.currentParticipants || 0}/{mate.maxParticipants}
                </span>
              </div>
              <h3 className={styles.mateLocation}>{mate.location}</h3>
              <div className={styles.mateDateTime}>
                <span>📅 {formatDate(mate.walkingDate)}</span>
                <span>⏰ {formatTime(mate.walkingDate)}</span>
                {mate.duration && <span>⏱️ {mate.duration}분</span>}
              </div>
              {mate.description && (
                <p className={styles.mateDescription}>{mate.description}</p>
              )}
              <div className={styles.mateHost}>
                <Avatar src={mate.hostUser?.profileImage} name={mate.hostUser?.name} size="xs" />
                <span>{mate.hostUser?.name}</span>
              </div>
            </Card>
          ))
        ) : (
          <Card className={styles.emptyCard}>
            <span className={styles.emptyIcon}>🐾</span>
            <p>모집 중인 산책이 없어요</p>
            {isAuthenticated && (
              <Button variant="secondary" size="sm" onClick={() => setShowCreateModal(true)}>
                산책 모집하기
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* FAB */}
      {isAuthenticated && (
        <button className={styles.fab} onClick={() => setShowCreateModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="산책 모집하기"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formRow}>
            <Input
              type="date"
              label="날짜"
              name="walkingDate"
              value={formData.walkingDate}
              onChange={handleChange}
              required
              fullWidth
            />
            <Input
              type="time"
              label="시간"
              name="walkingTime"
              value={formData.walkingTime}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>

          <Input
            label="장소"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="만남 장소"
            required
            fullWidth
          />

          <div className={styles.formRow}>
            <div className={styles.selectWrapper}>
              <label>예상 시간</label>
              <select name="duration" value={formData.duration} onChange={handleChange}>
                <option value="30">30분</option>
                <option value="60">1시간</option>
                <option value="90">1시간 30분</option>
                <option value="120">2시간</option>
              </select>
            </div>
            <div className={styles.selectWrapper}>
              <label>최대 인원</label>
              <select name="maxParticipants" value={formData.maxParticipants} onChange={handleChange}>
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n}명</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.selectWrapper}>
            <label>반려동물 크기</label>
            <select name="petSizeFilter" value={formData.petSizeFilter} onChange={handleChange}>
              <option value="ALL">모든 크기</option>
              <option value="SMALL">소형</option>
              <option value="MEDIUM">중형</option>
              <option value="LARGE">대형</option>
            </select>
          </div>

          <div className={styles.textareaWrapper}>
            <label>설명 (선택)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="산책에 대해 설명해주세요"
              rows={3}
            />
          </div>

          <Button type="submit" fullWidth loading={submitting}>
            모집하기
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default WalkingMates;

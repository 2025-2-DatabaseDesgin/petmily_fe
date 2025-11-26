import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Card,
  Badge,
  Modal,
  Input,
  Loading,
  Avatar,
} from "../components/common";
import walkingMatesAPI from "../api/walkingMates";
import routesAPI from "../api/routes";
import styles from "./WalkingMates.module.css";

const WalkingMates = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mates, setMates] = useState([]);
  const [filter, setFilter] = useState("OPEN");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);
  const [formData, setFormData] = useState({
    routeId: "",
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

  const fetchRoutes = async () => {
    setRoutesLoading(true);
    try {
      const response = await routesAPI.getAll({ limit: 50 });
      setRoutes(response.data?.routes || []);
    } catch (err) {
      console.error("산책로 목록 로딩 실패:", err);
    } finally {
      setRoutesLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    fetchRoutes();
    setShowCreateModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 산책로 선택 시 location 자동 설정
    if (name === "routeId" && value) {
      const selectedRoute = routes.find((r) => r.id === value);
      if (selectedRoute) {
        setFormData((prev) => ({
          ...prev,
          routeId: value,
          location: selectedRoute.name,
        }));
      }
    }
  };

  const handleRouteSelect = (route) => {
    setFormData((prev) => ({
      ...prev,
      routeId: route.id,
      location: route.name,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.routeId) {
      setError("산책로를 선택해주세요");
      return;
    }
    if (!formData.location) {
      setError("제목을 입력해주세요");
      return;
    }
    if (!formData.walkingDate || !formData.walkingTime) {
      setError("날짜와 시간을 입력해주세요");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const walkingDate = new Date(
        `${formData.walkingDate}T${formData.walkingTime}`
      ).toISOString();
      await walkingMatesAPI.create({
        routeId: formData.routeId,
        walkingDate,
        location: formData.location,
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
        petSizeFilter: formData.petSizeFilter,
        description: formData.description || undefined,
      });
      setShowCreateModal(false);
      setFormData({
        routeId: "",
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
    const labels = {
      ALL: "모든 크기",
      SMALL: "소형",
      MEDIUM: "중형",
      LARGE: "대형",
    };
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
            className={`${styles.tab} ${
              filter === tab.value ? styles.active : ""
            }`}
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
                  <Badge
                    variant={mate.status === "OPEN" ? "success" : "default"}
                    size="sm"
                  >
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
                <Avatar
                  src={mate.hostUser?.profileImage}
                  name={mate.hostUser?.name}
                  size="xs"
                />
                <span>{mate.hostUser?.name}</span>
              </div>
            </Card>
          ))
        ) : (
          <Card className={styles.emptyCard}>
            <span className={styles.emptyIcon}>🐾</span>
            <p>모집 중인 산책이 없어요</p>
            {isAuthenticated && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenCreateModal}
              >
                산책 모집하기
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* FAB */}
      {isAuthenticated && (
        <button className={styles.fab} onClick={handleOpenCreateModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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

          {/* 산책로 선택 */}
          <div className={styles.routeSection}>
            <label className={styles.routeLabel}>산책로 선택</label>
            {routesLoading ? (
              <div className={styles.routeLoading}>산책로 불러오는 중...</div>
            ) : routes.length > 0 ? (
              <div className={styles.routeList}>
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`${styles.routeItem} ${
                      formData.routeId === route.id ? styles.selected : ""
                    }`}
                    onClick={() => handleRouteSelect(route)}
                  >
                    <div className={styles.routeIcon}>🗺️</div>
                    <div className={styles.routeInfo}>
                      <span className={styles.routeName}>{route.name}</span>
                      <span className={styles.routeMeta}>
                        {route.distance && `${route.distance}km`}
                        {route.estimatedTime && ` · ${route.estimatedTime}분`}
                        {route.region && ` · ${route.region}`}
                      </span>
                    </div>
                    {formData.routeId === route.id && (
                      <span className={styles.routeCheck}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noRoutes}>
                <p>등록된 산책로가 없어요</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/routes")}
                >
                  산책로 보기
                </Button>
              </div>
            )}
          </div>

          <Input
            label="제목"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="예: 한강공원 산책 같이해요"
            required
            fullWidth
          />

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

          <div className={styles.formRow}>
            <div className={styles.selectWrapper}>
              <label>예상 시간</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="30">30분</option>
                <option value="60">1시간</option>
                <option value="90">1시간 30분</option>
                <option value="120">2시간</option>
              </select>
            </div>
            <div className={styles.selectWrapper}>
              <label>최대 인원</label>
              <select
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
              >
                {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.selectWrapper}>
            <label>반려동물 크기</label>
            <select
              name="petSizeFilter"
              value={formData.petSizeFilter}
              onChange={handleChange}
            >
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

          <Button
            type="submit"
            fullWidth
            loading={submitting}
            disabled={!formData.routeId}
          >
            모집하기
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default WalkingMates;

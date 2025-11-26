import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Badge, Modal, Loading, Avatar } from "../components/common";
import walkingMatesAPI from "../api/walkingMates";
import petsAPI from "../api/pets";
import styles from "./WalkingMateDetail.module.css";

const WalkingMateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mate, setMate] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedPets, setSelectedPets] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMate();
    if (isAuthenticated) {
      fetchMyPets();
    }
  }, [id, isAuthenticated]);

  const fetchMate = async () => {
    try {
      const response = await walkingMatesAPI.getById(id);
      setMate(response.data);
    } catch (err) {
      console.error("산책 메이트 로딩 실패:", err);
      navigate("/walking-mates");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPets = async () => {
    try {
      const response = await petsAPI.getMyPets();
      setMyPets(response.data || []);
    } catch (err) {
      console.error("반려동물 목록 로딩 실패:", err);
    }
  };

  const handleJoin = async () => {
    if (selectedPets.length === 0) {
      setError("참가할 반려동물을 선택해주세요");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await walkingMatesAPI.join(id, selectedPets);
      setShowJoinModal(false);
      fetchMate();
    } catch (err) {
      setError(err.message || "참가 신청에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("참가를 취소하시겠습니까?")) return;
    try {
      await walkingMatesAPI.leave(id);
      fetchMate();
    } catch (err) {
      alert(err.message || "참가 취소에 실패했습니다");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await walkingMatesAPI.delete(id);
      navigate("/walking-mates");
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다");
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSizeLabel = (size) => {
    const labels = { ALL: "모든 크기", SMALL: "소형", MEDIUM: "중형", LARGE: "대형" };
    return labels[size] || size;
  };

  const isHost = user?.id === mate?.hostId || user?.id === mate?.hostUser?.id;
  const isParticipant = mate?.participants?.some(
    (p) => p.user?.id === user?.id && p.status === "ACCEPTED"
  );

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  if (!mate) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Header Card */}
      <Card className={styles.headerCard}>
        <div className={styles.badges}>
          <Badge variant={mate.status === "OPEN" ? "success" : "default"} size="lg">
            {mate.status === "OPEN" ? "모집중" : "마감"}
          </Badge>
          <Badge variant="primary" size="lg">
            {getSizeLabel(mate.petSizeFilter)}
          </Badge>
        </div>
        <h1 className={styles.location}>{mate.location}</h1>
        <p className={styles.dateTime}>📅 {formatDateTime(mate.walkingDate)}</p>
        <div className={styles.infoRow}>
          {mate.duration && <span>⏱️ {mate.duration}분</span>}
          <span>👥 {mate.currentParticipants || 0}/{mate.maxParticipants}명</span>
        </div>
      </Card>

      {/* Host Info */}
      <Card className={styles.hostCard}>
        <div className={styles.hostInfo}>
          <Avatar src={mate.hostUser?.profileImage} name={mate.hostUser?.name} size="lg" />
          <div>
            <span className={styles.hostLabel}>주최자</span>
            <span className={styles.hostName}>{mate.hostUser?.name}</span>
          </div>
        </div>
      </Card>

      {/* Description */}
      {mate.description && (
        <Card className={styles.descCard}>
          <h3>설명</h3>
          <p>{mate.description}</p>
        </Card>
      )}

      {/* Participants */}
      {mate.participants && mate.participants.length > 0 && (
        <Card className={styles.participantsCard}>
          <h3>참가자 ({mate.participants.length})</h3>
          <div className={styles.participantList}>
            {mate.participants.map((p) => (
              <div key={p.id} className={styles.participant}>
                <Avatar src={p.user?.profileImage} name={p.user?.name} size="sm" />
                <span>{p.user?.name}</span>
                <Badge variant={p.status === "ACCEPTED" ? "success" : "warning"} size="sm">
                  {p.status === "ACCEPTED" ? "승인" : "대기"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        {isHost ? (
          <Button variant="outline" fullWidth onClick={handleDelete}>
            삭제하기
          </Button>
        ) : isAuthenticated && mate.status === "OPEN" && (
          isParticipant ? (
            <Button variant="outline" fullWidth onClick={handleLeave}>
              참가 취소
            </Button>
          ) : (
            <Button fullWidth onClick={() => setShowJoinModal(true)}>
              참가 신청
            </Button>
          )
        )}
      </div>

      {/* Join Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="참가 신청"
        size="sm"
      >
        <div className={styles.joinModal}>
          {error && <div className={styles.error}>{error}</div>}
          <p className={styles.joinText}>참가할 반려동물을 선택해주세요</p>
          {myPets.length > 0 ? (
            <div className={styles.petList}>
              {myPets.map((pet) => (
                <label key={pet.id} className={styles.petOption}>
                  <input
                    type="checkbox"
                    checked={selectedPets.includes(pet.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPets([...selectedPets, pet.id]);
                      } else {
                        setSelectedPets(selectedPets.filter((i) => i !== pet.id));
                      }
                    }}
                  />
                  <span className={styles.petCheckmark}>
                    {selectedPets.includes(pet.id) && "✓"}
                  </span>
                  <span>{pet.species === "DOG" ? "🐕" : "🐱"} {pet.petName}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className={styles.noPets}>
              <p>등록된 반려동물이 없어요</p>
              <Button variant="outline" size="sm" onClick={() => navigate("/pets")}>
                등록하기
              </Button>
            </div>
          )}
          <Button fullWidth onClick={handleJoin} loading={submitting} disabled={myPets.length === 0}>
            신청하기
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default WalkingMateDetail;

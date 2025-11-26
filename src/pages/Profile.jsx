import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Badge, Loading, Avatar } from "../components/common";
import followsAPI from "../api/follows";
import petsAPI from "../api/pets";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshProfile, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ followerCount: 0, followingCount: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      await refreshProfile();
      const [petsResponse, statsResponse] = await Promise.all([
        petsAPI.getMyPets(),
        user?.id ? followsAPI.getStats(user.id) : Promise.resolve({ data: {} }),
      ]);
      setPets(petsResponse.data || []);
      setStats(statsResponse.data || { followerCount: 0, followingCount: 0 });
    } catch (err) {
      console.error("프로필 데이터 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    await logout();
    navigate("/login");
  };

  const getSpeciesEmoji = (species) => {
    const emojis = { DOG: "🐕", CAT: "🐱", OTHER: "🐾" };
    return emojis[species] || "🐾";
  };

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  return (
    <div className={styles.page}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <Avatar src={user?.profileImage} name={user?.name} size="xxl" />
        <h2 className={styles.userName}>{user?.name}</h2>
        <p className={styles.userHandle}>@{user?.username}</p>
        <Badge variant={user?.status === "ACTIVE" ? "success" : "default"}>
          {user?.status === "ACTIVE" ? "활성" : user?.status}
        </Badge>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.followerCount}</span>
          <span className={styles.statLabel}>팔로워</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.followingCount}</span>
          <span className={styles.statLabel}>팔로잉</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.stat}>
          <span className={styles.statValue}>{pets.length}</span>
          <span className={styles.statLabel}>반려동물</span>
        </div>
      </div>

      {/* Info Section */}
      <Card className={styles.infoCard}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>✉️</span>
            <div>
              <span className={styles.infoLabel}>이메일</span>
              <span className={styles.infoValue}>{user?.email}</span>
            </div>
          </div>
          {user?.phone && (
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📞</span>
              <div>
                <span className={styles.infoLabel}>전화번호</span>
                <span className={styles.infoValue}>{user.phone}</span>
              </div>
            </div>
          )}
          {user?.region && (
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>📍</span>
              <div>
                <span className={styles.infoLabel}>지역</span>
                <span className={styles.infoValue}>{user.region}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Pets Section */}
      <Card className={styles.petsCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>내 반려동물</h3>
          <button className={styles.viewAllButton} onClick={() => navigate("/pets")}>
            관리
          </button>
        </div>
        {pets.length > 0 ? (
          <div className={styles.petList}>
            {pets.map((pet) => (
              <div key={pet.id} className={styles.petItem}>
                <Avatar src={pet.profileImage} name={pet.petName} size="md" />
                <div className={styles.petInfo}>
                  <span className={styles.petName}>
                    {getSpeciesEmoji(pet.species)} {pet.petName}
                  </span>
                  <span className={styles.petBreed}>{pet.breed || "품종 미상"}</span>
                </div>
              </div>
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
      </Card>

      {/* Logout Button */}
      <Button variant="outline" fullWidth onClick={handleLogout} className={styles.logoutButton}>
        로그아웃
      </Button>
    </div>
  );
};

export default Profile;

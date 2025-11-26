import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Card, Badge, Avatar, Loading } from "../components/common";
import walkingMatesAPI from "../api/walkingMates";
import routesAPI from "../api/routes";
import facilitiesAPI from "../api/facilities";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [walkingMates, setWalkingMates] = useState([]);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matesRes, facilitiesRes] = await Promise.all([
          walkingMatesAPI.getAll({ limit: 3, status: "OPEN" }),
          facilitiesAPI.getAll({ limit: 4, isSponsor: true }),
        ]);
        setWalkingMates(matesRes.data?.mates || []);
        setFacilities(facilitiesRes.data?.facilities || []);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const getFacilityIcon = (type) => {
    const icons = {
      CAFE: "☕",
      SHOP: "🛒",
      HOSPITAL: "🏥",
      PARK: "🌳",
      OTHER: "📍",
    };
    return icons[type] || "📍";
  };

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  return (
    <div className={styles.page}>
      {/* Welcome Section */}
      {isAuthenticated ? (
        <section className={styles.welcome}>
          <div className={styles.welcomeText}>
            <p className={styles.greeting}>안녕하세요 👋</p>
            <h2 className={styles.userName}>{user?.name}님</h2>
          </div>
          <Avatar src={user?.profileImage} name={user?.name} size="lg" />
        </section>
      ) : (
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.heroPaw}>🐾</span>
            <h2>함께하는 산책이<br />더 즐거워요</h2>
            <p>주변의 산책 메이트를 찾아보세요</p>
          </div>
          <div className={styles.heroActions}>
            <Button fullWidth onClick={() => navigate("/register")}>
              시작하기
            </Button>
            <Button fullWidth variant="outline" onClick={() => navigate("/login")}>
              로그인
            </Button>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <button className={styles.quickAction} onClick={() => navigate("/walking-mates")}>
          <span className={styles.actionIcon}>🤝</span>
          <span>산책 메이트</span>
        </button>
        <button className={styles.quickAction} onClick={() => navigate("/routes")}>
          <span className={styles.actionIcon}>🗺️</span>
          <span>산책로</span>
        </button>
        <button className={styles.quickAction} onClick={() => navigate("/facilities")}>
          <span className={styles.actionIcon}>📍</span>
          <span>시설</span>
        </button>
        <button className={styles.quickAction} onClick={() => navigate("/pets")}>
          <span className={styles.actionIcon}>🐕</span>
          <span>내 반려동물</span>
        </button>
      </section>

      {/* Walking Mates Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>모집 중인 산책 🐕</h3>
          <Link to="/walking-mates" className={styles.viewAll}>
            더보기
          </Link>
        </div>
        {walkingMates.length > 0 ? (
          <div className={styles.mateList}>
            {walkingMates.map((mate) => (
              <Card
                key={mate.id}
                className={styles.mateCard}
                onClick={() => navigate(`/walking-mates/${mate.id}`)}
              >
                <div className={styles.mateContent}>
                  <div className={styles.mateInfo}>
                    <Badge variant="success" size="sm">모집중</Badge>
                    <h4>{mate.location}</h4>
                    <p className={styles.mateDateTime}>
                      {formatDate(mate.walkingDate)} · {formatTime(mate.walkingDate)}
                    </p>
                  </div>
                  <div className={styles.mateRight}>
                    <span className={styles.mateParticipants}>
                      👥 {mate.currentParticipants || 0}/{mate.maxParticipants}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className={styles.emptyCard}>
            <p>모집 중인 산책이 없어요</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/walking-mates")}>
              산책 모집하기
            </Button>
          </Card>
        )}
      </section>

      {/* Facilities Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>추천 시설 📍</h3>
          <Link to="/facilities" className={styles.viewAll}>
            더보기
          </Link>
        </div>
        {facilities.length > 0 ? (
          <div className={styles.facilityGrid}>
            {facilities.map((facility) => (
              <Card
                key={facility.id}
                className={styles.facilityCard}
                onClick={() => navigate(`/facilities/${facility.id}`)}
              >
                <span className={styles.facilityIcon}>
                  {getFacilityIcon(facility.type)}
                </span>
                <h4>{facility.name}</h4>
                {facility.discountInfo && (
                  <p className={styles.discount}>🎁 {facility.discountInfo}</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className={styles.emptyCard}>
            <p>등록된 시설이 없어요</p>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Home;

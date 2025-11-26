import { useState, useEffect } from "react";
import { Card, Badge, Loading } from "../components/common";
import routesAPI from "../api/routes";
import styles from "./Routes.module.css";

const Routes = () => {
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, [filter]);

  const fetchRoutes = async () => {
    try {
      const params = { limit: 20 };
      if (filter) params.difficulty = filter;
      const response = await routesAPI.getAll(params);
      setRoutes(response.data?.routes || []);
    } catch (err) {
      console.error("산책로 목록 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyInfo = (difficulty) => {
    const info = {
      EASY: { variant: "success", label: "쉬움", icon: "🌱" },
      MODERATE: { variant: "warning", label: "보통", icon: "🌿" },
      HARD: { variant: "error", label: "어려움", icon: "🌲" },
    };
    return info[difficulty] || { variant: "default", label: difficulty, icon: "🚶" };
  };

  const tabs = [
    { value: "", label: "전체" },
    { value: "EASY", label: "쉬움" },
    { value: "MODERATE", label: "보통" },
    { value: "HARD", label: "어려움" },
  ];

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  return (
    <div className={styles.page}>
      {/* Filter Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${filter === tab.value ? styles.active : ""}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Route List */}
      <div className={styles.list}>
        {routes.length > 0 ? (
          routes.map((route) => {
            const difficultyInfo = getDifficultyInfo(route.difficulty);
            return (
              <Card key={route.id} className={styles.routeCard}>
                <div className={styles.routeHeader}>
                  <span className={styles.routeIcon}>{difficultyInfo.icon}</span>
                  <Badge variant={difficultyInfo.variant} size="sm">
                    {difficultyInfo.label}
                  </Badge>
                </div>
                <h3 className={styles.routeName}>{route.routeName}</h3>
                <p className={styles.routeRegion}>{route.region}</p>
                <div className={styles.routeStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{route.distance || "-"}</span>
                    <span className={styles.statLabel}>km</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{route.duration || "-"}</span>
                    <span className={styles.statLabel}>분</span>
                  </div>
                </div>
                {route.description && (
                  <p className={styles.routeDescription}>{route.description}</p>
                )}
              </Card>
            );
          })
        ) : (
          <Card className={styles.emptyCard}>
            <span className={styles.emptyIcon}>🗺️</span>
            <p>등록된 산책로가 없어요</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Routes;

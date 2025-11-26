import { useState, useEffect } from "react";
import { Card, Badge, Loading } from "../components/common";
import facilitiesAPI from "../api/facilities";
import styles from "./Facilities.module.css";

const Facilities = () => {
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, [filter]);

  const fetchFacilities = async () => {
    try {
      const params = { limit: 20 };
      if (filter) params.type = filter;
      const response = await facilitiesAPI.getAll(params);
      setFacilities(response.data?.facilities || []);
    } catch (err) {
      console.error("시설 목록 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
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

  const getTypeLabel = (type) => {
    const labels = {
      CAFE: "카페",
      SHOP: "펫샵",
      HOSPITAL: "병원",
      PARK: "공원",
      OTHER: "기타",
    };
    return labels[type] || type;
  };

  const tabs = [
    { value: "", label: "전체", icon: "🏠" },
    { value: "CAFE", label: "카페", icon: "☕" },
    { value: "SHOP", label: "펫샵", icon: "🛒" },
    { value: "HOSPITAL", label: "병원", icon: "🏥" },
    { value: "PARK", label: "공원", icon: "🌳" },
  ];

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  return (
    <div className={styles.page}>
      {/* Category Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${filter === tab.value ? styles.active : ""}`}
            onClick={() => setFilter(tab.value)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Facility List */}
      <div className={styles.list}>
        {facilities.length > 0 ? (
          facilities.map((facility) => (
            <Card key={facility.id} className={styles.facilityCard}>
              <div className={styles.facilityHeader}>
                <span className={styles.facilityIcon}>
                  {getFacilityIcon(facility.type)}
                </span>
                <div className={styles.facilityBadges}>
                  <Badge variant="primary" size="sm">
                    {getTypeLabel(facility.type)}
                  </Badge>
                  {facility.isSponsor && (
                    <Badge variant="warning" size="sm">스폰서</Badge>
                  )}
                </div>
              </div>
              <h3 className={styles.facilityName}>{facility.name}</h3>
              <p className={styles.facilityAddress}>{facility.address}</p>
              {facility.phone && (
                <p className={styles.facilityInfo}>📞 {facility.phone}</p>
              )}
              {facility.openingHours && (
                <p className={styles.facilityInfo}>🕐 {facility.openingHours}</p>
              )}
              {facility.discountInfo && (
                <div className={styles.discount}>
                  🎁 {facility.discountInfo}
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className={styles.emptyCard}>
            <span className={styles.emptyIcon}>📍</span>
            <p>등록된 시설이 없어요</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Facilities;

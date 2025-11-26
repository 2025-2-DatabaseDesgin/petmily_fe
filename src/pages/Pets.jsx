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
import petsAPI from "../api/pets";
import styles from "./Pets.module.css";

const Pets = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    petName: "",
    species: "DOG",
    breed: "",
    age: "",
    gender: "",
    size: "",
    weight: "",
    personality: "",
    healthStatus: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchPets();
  }, [isAuthenticated, authLoading, navigate]);

  const fetchPets = async () => {
    try {
      const response = await petsAPI.getMyPets();
      setPets(response.data?.pets || []);
    } catch (err) {
      console.error("반려동물 목록 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        petName: pet.petName,
        species: pet.species || "DOG",
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        size: pet.size,
        weight: pet.weight,
        personality: pet.personality,
        healthStatus: pet.healthStatus,
      });
    } else {
      setEditingPet(null);
      setFormData({
        petName: "",
        species: "DOG",
        breed: "",
        age: "",
        gender: "",
        size: "",
        weight: "",
        personality: "",
        healthStatus: "",
      });
    }
    setShowModal(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.petName) {
      setError("이름을 입력해주세요");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // 빈 값 제거
      const data = Object.fromEntries(
        Object.entries({
          petName: formData.petName,
          species: formData.species,
          breed: formData.breed,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          size: formData.size,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          personality: formData.personality,
          healthStatus: formData.healthStatus,
        }).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined
        )
      );

      if (editingPet) {
        await petsAPI.update(editingPet.id, data);
      } else {
        await petsAPI.create(data);
      }
      setShowModal(false);
      fetchPets();
    } catch (err) {
      setError(err.message || "저장에 실패했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (petId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await petsAPI.delete(petId);
      fetchPets();
    } catch (err) {
      alert(err.message || "삭제에 실패했습니다");
    }
  };

  const getSpeciesEmoji = (species) => {
    const emojis = { DOG: "🐕", CAT: "🐱", OTHER: "🐾" };
    return emojis[species] || "🐾";
  };

  const getSpeciesLabel = (species) => {
    const labels = { DOG: "강아지", CAT: "고양이", OTHER: "기타" };
    return labels[species] || species;
  };

  const getSizeLabel = (size) => {
    const labels = { SMALL: "소형", MEDIUM: "중형", LARGE: "대형" };
    return labels[size] || size;
  };

  const getGenderLabel = (gender) => {
    const labels = { MALE: "수컷", FEMALE: "암컷" };
    return labels[gender] || gender;
  };

  if (loading) {
    return <Loading fullScreen text="불러오는 중..." />;
  }

  return (
    <div className={styles.page}>
      {pets.length > 0 ? (
        <div className={styles.petList}>
          {pets.map((pet) => (
            <Card key={pet.id} className={styles.petCard}>
              <div className={styles.petHeader}>
                <Avatar src={pet.profileImage} name={pet.petName} size="xl" />
                <div className={styles.petInfo}>
                  <h3>
                    {getSpeciesEmoji(pet.species)} {pet.petName}
                  </h3>
                  <div className={styles.petBadges}>
                    <Badge variant="primary" size="sm">
                      {getSpeciesLabel(pet.species)}
                    </Badge>
                    {pet.size && (
                      <Badge size="sm">{getSizeLabel(pet.size)}</Badge>
                    )}
                    {pet.gender && (
                      <Badge size="sm">{getGenderLabel(pet.gender)}</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.petDetails}>
                {pet.breed && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>품종</span>
                    <span>{pet.breed}</span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>나이</span>
                  <span>{pet.age ? `${pet.age}살` : "-"}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>체중</span>
                  <span>{pet.weight ? `${pet.weight}kg` : "-"}</span>
                </div>
              </div>

              {pet.personality && (
                <p className={styles.petPersonality}>{pet.personality}</p>
              )}

              <div className={styles.petActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(pet)}
                >
                  수정
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pet.id)}
                >
                  삭제
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className={styles.emptyCard}>
          <span className={styles.emptyIcon}>🐾</span>
          <h3>등록된 반려동물이 없어요</h3>
          <p>소중한 반려동물을 등록해보세요</p>
          <Button onClick={() => handleOpenModal()}>반려동물 등록하기</Button>
        </Card>
      )}

      {/* FAB */}
      {pets.length > 0 && (
        <button className={styles.fab} onClick={() => handleOpenModal()}>
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

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPet ? "반려동물 수정" : "반려동물 등록"}
        size="md"
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <Input
            label="이름"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            placeholder="반려동물 이름"
            required
            fullWidth
          />

          <div className={styles.formRow}>
            <div className={styles.selectWrapper}>
              <label>종류</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
              >
                <option value="DOG">강아지</option>
                <option value="CAT">고양이</option>
                <option value="OTHER">기타</option>
              </select>
            </div>
            <Input
              label="품종"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="품종"
              fullWidth
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.selectWrapper}>
              <label>성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">선택안함</option>
                <option value="MALE">수컷</option>
                <option value="FEMALE">암컷</option>
              </select>
            </div>
            <div className={styles.selectWrapper}>
              <label>크기</label>
              <select name="size" value={formData.size} onChange={handleChange}>
                <option value="">선택안함</option>
                <option value="SMALL">소형</option>
                <option value="MEDIUM">중형</option>
                <option value="LARGE">대형</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <Input
              type="number"
              label="나이"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="나이"
              fullWidth
            />
            <Input
              type="number"
              label="체중 (kg)"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="체중"
              fullWidth
            />
          </div>

          <Input
            label="성격"
            name="personality"
            value={formData.personality}
            onChange={handleChange}
            placeholder="성격을 설명해주세요"
            fullWidth
          />

          <Button type="submit" fullWidth loading={submitting}>
            {editingPet ? "수정하기" : "등록하기"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Pets;

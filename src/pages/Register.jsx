import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/common";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    region: "",
    isPetOwner: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "아이디를 입력해주세요";
    if (!formData.email) newErrors.email = "이메일을 입력해주세요";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "올바른 이메일 형식이 아닙니다";
    if (!formData.password) newErrors.password = "비밀번호를 입력해주세요";
    else if (formData.password.length < 8)
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "이름을 입력해주세요";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
        region: formData.region || undefined,
        isPetOwner: formData.isPetOwner,
      });
      navigate("/");
    } catch (err) {
      setErrors({ submit: err.message || "회원가입에 실패했습니다" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>회원가입</h1>
        <p>Petmily와 함께 시작하세요</p>
      </div>

      <div className={styles.steps}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
          <span>1</span>
        </div>
        <div className={styles.stepLine} />
        <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
          <span>2</span>
        </div>
      </div>
      <div className={styles.stepLabels}>
        <span className={step >= 1 ? styles.activeLabel : ""}>계정 정보</span>
        <span className={step >= 2 ? styles.activeLabel : ""}>개인 정보</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {errors.submit && <div className={styles.error}>{errors.submit}</div>}

        {step === 1 && (
          <>
            <Input
              label="아이디"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              error={errors.username}
              required
              fullWidth
            />
            <Input
              type="email"
              label="이메일"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              error={errors.email}
              required
              fullWidth
            />
            <Input
              type="password"
              label="비밀번호"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              error={errors.password}
              helperText="8자 이상 입력해주세요"
              required
              fullWidth
            />
            <Input
              type="password"
              label="비밀번호 확인"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.confirmPassword}
              required
              fullWidth
            />
            <Button type="button" onClick={handleNextStep} fullWidth size="lg">
              다음
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              error={errors.name}
              required
              fullWidth
            />
            <Input
              label="전화번호"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              fullWidth
            />
            <Input
              label="지역"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="예: 서울특별시 강남구"
              fullWidth
            />
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="isPetOwner"
                checked={formData.isPetOwner}
                onChange={handleChange}
              />
              <span className={styles.checkmark}>
                {formData.isPetOwner && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span>반려동물을 키우고 있어요 🐾</span>
            </label>
            <div className={styles.buttonGroup}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                이전
              </Button>
              <Button type="submit" loading={loading} fullWidth>
                가입하기
              </Button>
            </div>
          </>
        )}
      </form>

      <div className={styles.footer}>
        <p>
          이미 계정이 있으신가요?{" "}
          <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

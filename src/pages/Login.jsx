import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Input } from "../components/common";
import logo from "../assets/logo.png";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData.loginIdentifier, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.brand}>
        <img src={logo} alt="Petmily" className={styles.logo} />
        <h1 className={styles.title}>Petmily</h1>
        <p className={styles.subtitle}>반려동물과 함께하는 행복한 산책</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}

        <Input
          label="아이디 또는 이메일"
          name="loginIdentifier"
          value={formData.loginIdentifier}
          onChange={handleChange}
          placeholder="아이디 또는 이메일을 입력하세요"
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
          required
          fullWidth
        />

        <Button type="submit" fullWidth loading={loading} size="lg">
          로그인
        </Button>
      </form>

      <div className={styles.footer}>
        <p>
          아직 계정이 없으신가요?{" "}
          <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

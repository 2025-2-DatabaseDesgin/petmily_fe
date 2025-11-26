import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== "default";

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => canGoBack ? navigate(-1) : navigate("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className={styles.headerCenter}>
          <img src={logo} alt="Petmily" className={styles.logo} />
        </div>
        <div className={styles.headerRight} />
      </header>

      {/* Content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;

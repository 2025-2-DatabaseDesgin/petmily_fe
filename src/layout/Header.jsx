import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar, Button } from '../components/common';
import logo from '../assets/logo.png';
import styles from './Header.module.css';

const Header = ({ onMenuClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button className={styles.menuButton} onClick={onMenuClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Petmily" />
            <span>Petmily</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <Link to="/walking-mates" className={styles.navLink}>산책 메이트</Link>
          <Link to="/routes" className={styles.navLink}>산책로</Link>
          <Link to="/facilities" className={styles.navLink}>시설</Link>
        </nav>

        <div className={styles.right}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Avatar
                  src={user?.profileImage}
                  name={user?.name}
                  size="sm"
                />
                <span className={styles.userName}>{user?.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.chevron}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {showDropdown && (
                <>
                  <div
                    className={styles.overlay}
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className={styles.dropdown}>
                    <Link
                      to="/profile"
                      className={styles.dropdownItem}
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      내 프로필
                    </Link>
                    <Link
                      to="/pets"
                      className={styles.dropdownItem}
                      onClick={() => setShowDropdown(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
                        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
                        <path d="M8 14v.5" />
                        <path d="M16 14v.5" />
                        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
                        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
                      </svg>
                      내 반려동물
                    </Link>
                    <div className={styles.dropdownDivider} />
                    <button
                      className={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      로그아웃
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                로그인
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.css';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>🐾 Petmily</span>
            <p>반려동물과 함께하는 행복한 산책</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerSection}>
              <h4>서비스</h4>
              <a href="/walking-mates">산책 메이트</a>
              <a href="/routes">산책로</a>
              <a href="/facilities">시설</a>
            </div>
            <div className={styles.footerSection}>
              <h4>지원</h4>
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
              <a href="#">고객센터</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 Petmily. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;


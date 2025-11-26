import styles from './Loading.module.css';

const Loading = ({ size = 'md', fullScreen = false, text = '' }) => {
  const containerClass = fullScreen ? styles.fullScreen : styles.container;

  return (
    <div className={containerClass}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.paw}>🐾</div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default Loading;


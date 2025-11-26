import styles from './Badge.module.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};

export default Badge;


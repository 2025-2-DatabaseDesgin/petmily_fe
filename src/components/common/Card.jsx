import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    hover ? styles.hover : '',
    onClick ? styles.clickable : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classNames} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`${styles.header} ${className}`} {...props}>
    {children}
  </div>
);

// Card Body
Card.Body = ({ children, className = '', ...props }) => (
  <div className={`${styles.body} ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`${styles.footer} ${className}`} {...props}>
    {children}
  </div>
);

export default Card;


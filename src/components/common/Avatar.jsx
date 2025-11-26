import styles from "./Avatar.module.css";

const Avatar = ({
  src,
  alt = "",
  name = "",
  size = "md",
  className = "",
  ...props
}) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const classNames = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} {...props}>
      {src ? (
        <img src={src} alt={alt || name} />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};

export default Avatar;

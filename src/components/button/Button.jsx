import styles from "./Button.module.css";

export function Button({ disabled, label, type, maxWidth, styling, onClick }) {
  return (
    <button
      style={maxWidth ? { maxWidth } : {}}
      disabled={disabled}
      type={type}
      className={`${styles.button} ${styling ? styles[styling] : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

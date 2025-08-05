import styles from "./InputWrapper.module.css";

export function InputWrapper({ children, maxWidth, direction }) {
  return (
    <div
      className={`${styles["input-wrapper"]} ${direction ? styles[direction] : ""}`}
      style={maxWidth ? { maxWidth } : {}}
    >
      {children}
    </div>
  );
}

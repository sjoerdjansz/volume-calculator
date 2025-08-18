import styles from "./Snackbar.module.css";
import { useEffect } from "react";

export function Snackbar({ open, message, status, time = 2500, onClose }) {
  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      onClose?.();
    }, time);
    return () => clearTimeout(timeout);
  }, [open, time, onClose]);

  if (!open) return null;

  return (
    <div className={`${styles["snackbar"]} ${styles[status]}`}>
      <p>{message}</p>
    </div>
  );
}

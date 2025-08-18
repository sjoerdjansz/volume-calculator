import styles from "./IconToggle.module.css";
import { useState } from "react";

export function IconToggle({ iconOne, iconTwo, handleToggle }) {
  const [toggle, setToggle] = useState(false);
  return (
    <div
      className={styles["icon-toggle"]}
      onClick={() => handleToggle(setToggle(!toggle))}
    >
      {toggle ? (
        <span>
          {iconOne.label} {iconOne.icon}
        </span>
      ) : (
        <span>
          {iconTwo.label} {iconTwo.icon}
        </span>
      )}
    </div>
  );
}

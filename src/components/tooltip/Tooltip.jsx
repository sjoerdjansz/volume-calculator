import { Info } from "@phosphor-icons/react";
import styles from "./Tooltip.module.css";
import { useState } from "react";

export function Tooltip({ message }) {
  const [toggleTooltip, setToggleTooltip] = useState(false);
  return (
    <div className={styles.tooltip}>
      <span onClick={() => setToggleTooltip(!toggleTooltip)}>
        <Info size={16} />
      </span>
      {toggleTooltip && (
        <div
          className={styles["tooltip_message"]}
          onClick={() => setToggleTooltip(!toggleTooltip)}
        >
          {Array.isArray(message) ? (
            message.map((item, index) => {
              return (
                <p className={styles["tooltip__message-items"]} key={index}>
                  {item}
                </p>
              );
            })
          ) : (
            <p>{message}</p>
          )}
        </div>
      )}
    </div>
  );
}

import { Info } from "@phosphor-icons/react";
import styles from "./Tooltip.module.css";
import { useEffect, useRef, useState } from "react";

export function Tooltip({ message }) {
  const [toggleTooltip, setToggleTooltip] = useState(false);

  const clickRef = useRef();

  useEffect(() => {
    if (!toggleTooltip) {
      return;
    }
    const handleClick = (e) => {
      if (clickRef.current && !clickRef.current.contains(e.target)) {
        setToggleTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [toggleTooltip]);

  return (
    <div className={styles.tooltip} ref={clickRef}>
      <span onClick={() => setToggleTooltip(!toggleTooltip)}>
        <Info size={16} />
      </span>
      {toggleTooltip && (
        <div
          className={styles["tooltip_message"]}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
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

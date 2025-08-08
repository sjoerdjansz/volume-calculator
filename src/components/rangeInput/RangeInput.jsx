import styles from "./RangeInput.module.css";

export function RangeInput({
  hasLabel,
  id,
  name,
  onChange,
  value,
  min,
  max,
  tooltip,
}) {
  return (
    <div className={styles["range-wrapper"]}>
      {hasLabel && (
        <label htmlFor={id}>
          {name}
          {tooltip}
        </label>
      )}
      <input
        type="range"
        name={name}
        id={id}
        onChange={onChange}
        value={value}
        min={min}
        max={max}
      />
      <span className={styles["range-label"]}>{value}</span>
    </div>
  );
}

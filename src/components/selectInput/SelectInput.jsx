import styles from "./SelectInput.module.css";

export function SelectInput({
  name,
  id,
  options,
  placeholder,
  onChange,
  value,
  hasLabel,
  tooltip,
}) {
  return (
    <>
      {hasLabel && (
        <label className={styles["select-label"]} htmlFor={id}>
          {name} {tooltip}
        </label>
      )}
      <select value={value ?? ""} name={name} id={id} onChange={onChange}>
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => {
          return (
            <option
              key={option.label ? option.label : option}
              value={option.value ? option.value : option}
            >
              {option.label ? option.label : option}
            </option>
          );
        })}
      </select>
    </>
  );
}

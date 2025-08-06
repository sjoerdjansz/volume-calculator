import styles from "./SelectInput.module.css";

export function SelectInput({
  name,
  id,
  options,
  placeholder,
  onChange,
  value,
}) {
  return (
    <>
      <select value={value || ""} name={name} id={id} onChange={onChange}>
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => {
          return (
            <option
              key={option.value ? option.value : option}
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

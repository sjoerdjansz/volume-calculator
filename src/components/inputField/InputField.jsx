import styles from "./InputField.module.css";

export function InputField({
  value,
  hasLabel,
  id,
  name,
  type,
  placeholder,
  onChange,
  icon,
}) {
  return (
    <>
      {hasLabel && <label htmlFor={name}>{name}</label>}

      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

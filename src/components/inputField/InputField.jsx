import styles from "./InputField.module.css";

export function InputField({
  value,
  hasLabel,
  id,
  name,
  type,
  placeholder,
  onChange,
}) {
  return (
    <>
      {hasLabel && (
        <label className={styles.label} htmlFor={id}>
          {name}
        </label>
      )}

      <input
        className={styles.input}
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

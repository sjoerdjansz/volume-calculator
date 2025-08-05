import styles from "./InputField.module.css";

export function InputField({ hasLabel, id, name, type, placeholder }) {
  return (
    <>
      {hasLabel && <label htmlFor={name}>{name}</label>}
      <input type={type} name={name} id={id} placeholder={placeholder} />
    </>
  );
}

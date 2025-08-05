import styles from "./ExerciseCard.module.css";
import { Trash } from "@phosphor-icons/react";
import { InputWrapper } from "../InputWrapper/InputWrapper.jsx";
import { InputField } from "../inputField/InputField.jsx";

export function ExerciseCard({ exercise, volume }) {
  return (
    <article className={styles["exercise-card"]}>
      {volume || exercise ? (
        <>
          <div className={styles["exercise-card__title-wrapper"]}>
            <h4>{exercise.name}</h4>
            <Trash size={16} color={"#ef5350"} />
          </div>
          <div className={styles["exercise-card__subtitle-wrapper"]}>
            <p>{`${exercise.movement} – ${exercise.bodyPart}`}</p>
            <div className={styles["subtitle-wrapper__sets"]}>
              <InputWrapper maxWidth="" direction="row">
                <InputField
                  type="number"
                  hasLabel={true}
                  name="Sets"
                  placeholder="3"
                />
              </InputWrapper>
            </div>
          </div>
          <ul className={styles["exercise-card__details-wrapper"]}>
            <li className={styles.primary}>
              <p>Primary</p>
              <p>{exercise.primaryMuscle}</p>
              <span>100%</span>
              <span>{volume.primary ? volume.primary : "–"} pts</span>
            </li>
            {exercise.secondaryMuscles?.map((muscle, index) => {
              return (
                <li key={index} className={styles.secondary}>
                  <p>Secondary</p>
                  <p>{muscle}</p>
                  <span>50-70%</span>
                  <span>{volume.secondary ? volume.secondary : "–"} pts</span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p>No workout data to display.</p>
      )}
    </article>
  );
}

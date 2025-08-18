import styles from "./ExerciseCard.module.css";
import { Trash } from "@phosphor-icons/react";
import { InputWrapper } from "../InputWrapper/InputWrapper.jsx";
import { InputField } from "../inputField/InputField.jsx";
import { ESTIMATE_MODES } from "../../data/estimateMode.js";
import { useEffect, useState } from "react";

export function ExerciseCard({
  exercise,
  volume,
  onSetChange,
  removeExercise,
  volumeMode,
  minimize,
}) {
  const [volumePercentages, setVolumePercentages] = useState({});

  useEffect(() => {
    if (!volumeMode) {
      return;
    }

    setVolumePercentages(ESTIMATE_MODES[volumeMode]);
  }, [volumeMode]);
  return (
    <article className={styles["exercise-card"]}>
      {volume || exercise ? (
        <>
          <div className={styles["exercise-card__title-wrapper"]}>
            <h4>{exercise.name}</h4>
            <span onClick={() => removeExercise(exercise.name)}>
              <Trash size={16} color={"#ef5350"} />
            </span>
          </div>
          <div className={styles["exercise-card__subtitle-wrapper"]}>
            <p>{`Type: ${exercise?.compoundLabel}`}</p>
            <p>{`Movement: ${exercise.movement}`}</p>
            <p>{`Body part: ${exercise.bodyPart}`}</p>
            <div className={styles["subtitle-wrapper__sets"]}>
              <InputWrapper maxWidth="" direction="row">
                <InputField
                  type="number"
                  hasLabel={true}
                  name="Sets"
                  placeholder="–"
                  value={exercise.sets ?? ""} // nullish coalescing operator
                  // zegt: geef exercise.sets terug, tenzij null of undefined, dan geef ""

                  onChange={(e) => onSetChange(e.target.value)} //
                />
              </InputWrapper>
            </div>
          </div>

          {minimize && (
            <ul className={styles["exercise-card__details-wrapper"]}>
              <li className={styles.primary}>
                <p>Primary</p>
                <p>{exercise.primaryMuscle}</p>
                <span>
                  {volumePercentages.primary
                    ? volumePercentages.primary * 100
                    : 0}
                  %
                </span>
                <span>{volume.primary ? volume.primary : "–"} pts</span>
              </li>
              {exercise.secondaryMuscles?.map((muscle, index) => {
                if (index >= 3) return null;
                return (
                  <li key={index} className={styles.secondary}>
                    <p>{index < 1 && "Secondary"}</p>
                    <p>{muscle}</p>
                    <span>
                      {volumePercentages.secondary
                        ? volumePercentages.secondary * 100
                        : 0}
                      %
                    </span>
                    <span>{volume.secondary ? volume.secondary : "–"} pts</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <p>No workout data to display.</p>
      )}
    </article>
  );
}

import styles from "./AddExerciseModal.module.css";
import { Button } from "../button/Button.jsx";
import { InputWrapper } from "../InputWrapper/InputWrapper.jsx";
import { InputField } from "../inputField/InputField.jsx";
import { useEffect, useState } from "react";
import { MagnifyingGlass, XCircle } from "@phosphor-icons/react";
import { searchAndScoreExercises } from "../../helpers/searchAndScoreExercises.js";

export function AddExerciseModal({
  searchData,
  searchType,
  title,
  onClose,
  addExercise,
  workoutExercises,
  removeExercise,
  handleGeneratedWorkout,
}) {
  const [searchString, setSearchString] = useState("");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const result = searchAndScoreExercises(searchString, searchData);

    setExercises(result);
  }, [searchString]);

  return (
    <div className={styles["modal-wrapper"]}>
      <div className={styles["modal__overlay"]}>
        <div className={styles["modal"]}>
          <div>
            <h2>{title}</h2>
            <XCircle size={24} onClick={onClose} />
          </div>

          <hr />
          <ul className={styles["modal__current-exercises-container"]}>
            {workoutExercises.length ? (
              workoutExercises.map((exercise, index) => {
                return (
                  <li
                    onClick={() => removeExercise(exercise.name)}
                    key={index}
                    className={styles["modal__current-exercise"]}
                  >
                    <p>
                      {exercise.name}
                      <span>
                        <XCircle size={14} />
                      </span>
                    </p>
                  </li>
                );
              })
            ) : (
              <li className={styles["modal__no-exercises-selected"]}>
                <p>No exercises selected.</p>
              </li>
            )}
          </ul>

          <hr />
          <div className={styles["modal__content"]}>
            <InputWrapper maxWidth="100%" direction="column">
              <InputField
                icon={<MagnifyingGlass size={16} />}
                type="text"
                name={`Search ${searchType}`}
                id="search-exercise"
                hasLabel={true}
                placeholder="Name, muscle, movement or body part"
                value={searchString}
                onChange={(e) => {
                  setSearchString(e.target.value);
                }}
              />
            </InputWrapper>
            <div className={styles["modal__search-results-container"]}>
              <ul className={styles["modal__search-results"]}>
                {exercises &&
                  exercises.map((exercise, index) => {
                    const alreadyInWorkout = workoutExercises.some(
                      (item) => item.name === exercise.name,
                    );

                    if (!alreadyInWorkout) {
                      return (
                        <li
                          key={index}
                          onClick={() => addExercise(exercise.name)}
                        >
                          <p className={styles["modal__result"]}>
                            {exercise.name}{" "}
                            <span>({exercise.primaryMuscle})</span>
                          </p>
                        </li>
                      );
                    }
                    return (
                      <li
                        className={styles["already-in-workout"]}
                        key={index}
                        onClick={() => addExercise(exercise.name)}
                      >
                        <p className={styles["modal__result"]}>
                          {exercise.name}{" "}
                          <span>({exercise.primaryMuscle})</span>
                        </p>
                      </li>
                    );
                  })}
              </ul>
              <Button
                type="button"
                label="Generate workout"
                styling="primary-alt"
                maxWidth="100%"
                onClick={handleGeneratedWorkout}
              />
              <Button
                type="button"
                label={`Save ${searchType}`}
                styling="success"
                maxWidth="100%"
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

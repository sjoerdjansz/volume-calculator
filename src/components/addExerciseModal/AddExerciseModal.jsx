import styles from "./AddExerciseModal.module.css";
import { Button } from "../button/Button.jsx";
import { InputWrapper } from "../InputWrapper/InputWrapper.jsx";
import { InputField } from "../inputField/InputField.jsx";
import { useEffect, useState } from "react";
import { MagnifyingGlass, XCircle } from "@phosphor-icons/react";

export function AddExerciseModal({ searchData, searchType, title, onClose }) {
  const [searchString, setSearchString] = useState("");
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const result = searchExercises(searchString, searchData);

    setExercises(result);
  }, [searchString]);

  function searchExercises(searchQuery, exerciseData) {
    const sanitizedQuery = searchQuery.toLowerCase().trim();

    if (sanitizedQuery === "") return exerciseData;

    return exerciseData
      .map((exercise) => {
        let score = 0;
        if (exercise.name.toLowerCase().includes(sanitizedQuery)) {
          score += 3;
        }
        if (exercise.primaryMuscle.toLowerCase().includes(sanitizedQuery)) {
          score += 2;
        }
        if (
          exercise.secondaryMuscles.some((muscle) =>
            muscle.toLowerCase().includes(sanitizedQuery),
          )
        ) {
          score += 2;
        }
        if (exercise.bodyPart.toLowerCase().includes(sanitizedQuery)) {
          score += 1;
        }
        if (exercise.movement.toLowerCase().includes(sanitizedQuery)) {
          score += 1;
        }
        return {
          exercise,
          score,
        };
      })
      .filter((item) => {
        return item.score > 0;
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.exercise);
  }

  return (
    <div className={styles["modal-wrapper"]}>
      <div className={styles["modal__overlay"]}>
        <div className={styles["modal"]}>
          <div>
            <h2>{title}</h2>
            <XCircle size={24} onClick={onClose} />
          </div>

          <hr />
          <div className={styles["modal__content"]}>
            <InputWrapper maxWidth="100%" direction="column">
              <InputField
                icon={<MagnifyingGlass size={16} />}
                type="text"
                name={`Search ${searchType}`}
                id="search-exercise"
                hasLabel={true}
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
                    return (
                      <li key={index}>
                        <span>{exercise.name}</span>
                      </li>
                    );
                  })}
              </ul>
              <Button
                type="button"
                label={`Add ${searchType}`}
                styling="primary"
                maxWidth="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

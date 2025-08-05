import styles from "./Calculator.module.css";
import { SelectInput } from "../components/selectInput/SelectInput.jsx";
import { InputWrapper } from "../components/InputWrapper/InputWrapper.jsx";
import { InputField } from "../components/inputField/InputField.jsx";
import { Button } from "../components/button/Button.jsx";
import { ExerciseCard } from "../components/exerciseCard/ExerciseCard.jsx";
import { useEffect, useState } from "react";
import {
  calculateSingleExerciseVolumes,
  calculateTotalVolumes,
} from "../helpers/calculateVolume.js";
import { ESTIMATE_MODES } from "../data/estimateMode.js";
import { WORKOUT_SELECT_OPTIONS } from "../data/workoutSelectOptions.js";
import { EXERCISES } from "../data/exercises.js";
import {
  CaretCircleDown,
  CaretCircleUp,
  Eye,
  EyeClosed,
} from "@phosphor-icons/react";

export function Calculator() {
  const [singleExerciseVolumes, setSingleExerciseVolumes] = useState([]);
  const [mode, setMode] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [totalMuscleVolume, setTotalMuscleVolume] = useState([]);
  const [toggleVolume, setToggleVolume] = useState(false);

  useEffect(() => {
    if (!mode) {
      return;
    }

    const singleExercises = calculateSingleExerciseVolumes(
      EXERCISES,
      ESTIMATE_MODES,
      mode,
    );
    const totalMuscleVolumes = calculateTotalVolumes(
      mode,
      ESTIMATE_MODES,
      EXERCISES,
    );

    console.log(totalMuscleVolumes);

    setTotalMuscleVolume(totalMuscleVolumes);
    setSingleExerciseVolumes(singleExercises);
  }, [mode]);
  return (
    <div className={styles["workouts"]}>
      <header>
        <h1>Workout Templates</h1>
        <InputWrapper maxWidth="100%">
          <SelectInput
            id="workouts"
            name="workout-select"
            options={WORKOUT_SELECT_OPTIONS}
            placeholder="Select a workout"
            onChange={(e) => {
              setSelectedWorkout(e.target.value);
            }}
            value={selectedWorkout}
          />
        </InputWrapper>
      </header>
      <section className={styles["workouts__total-volume"]}>
        <div>
          <h2>Total training volume</h2>
          <div
            onClick={() => {
              setToggleVolume(!toggleVolume);
            }}
          >
            <span>{toggleVolume ? "Show" : "Hide"}</span>
            {toggleVolume ? <Eye size={20} /> : <EyeClosed size={20} />}
          </div>
        </div>
        {mode ? (
          <ul
            className={`${styles["workouts-total-volume__list"]} ${toggleVolume && styles["disabled"]}`}
          >
            {totalMuscleVolume &&
              totalMuscleVolume.map((muscle, index) => {
                return (
                  <li
                    className={styles["workouts-total-volume__list-item"]}
                    key={index}
                  >
                    <span>{muscle.volume.toFixed(2)}</span>
                    <p>{muscle.muscle}</p>
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className={styles["workouts-total-volume__list"]}>
            <p>Add exercises and choose a mode to display muscle volume.</p>
          </div>
        )}
      </section>

      <hr />
      <main className={styles["workouts-container"]}>
        <div className={styles["workouts-container__controls"]}>
          <InputWrapper maxWidth="100%">
            <InputField
              id="workout-name"
              name="workout-name"
              type="text"
              hasLabel={false}
              placeholder="Workout name"
            />
          </InputWrapper>
          <InputWrapper maxWidth="100%">
            <SelectInput
              id="mode"
              name="mode-select"
              options={["Neutral", "Optimistic", "Conservative"]}
              placeholder="Choose mode"
              onChange={(e) => {
                setMode(e.target.value.toLowerCase());
              }}
              value={mode}
            />
          </InputWrapper>
        </div>
        <section className={styles["workouts-container__exercises"]}>
          {EXERCISES.map((exercise, index) => {
            return (
              <ExerciseCard
                exercise={exercise}
                key={exercise.value}
                volume={
                  singleExerciseVolumes[index] || {
                    primary: null,
                    secondary: null,
                  }
                }
              />
            );
          })}
        </section>
      </main>
      <footer>
        <Button
          type="button"
          maxWidth="100%"
          disabled={false}
          label="Add Exercise"
          styling="primary"
        />
        <Button
          type="submit"
          maxWidth="100%"
          disabled={false}
          label="Save Workout"
          styling="success"
        />
      </footer>
    </div>
  );
}

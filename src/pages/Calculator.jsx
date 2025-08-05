import styles from "./Calculator.module.css";
import { SelectInput } from "../components/selectInput/SelectInput.jsx";
import { InputWrapper } from "../components/InputWrapper/InputWrapper.jsx";
import { InputField } from "../components/inputField/InputField.jsx";
import { Button } from "../components/button/Button.jsx";
import { ExerciseCard } from "../components/exerciseCard/ExerciseCard.jsx";
import { useEffect, useState } from "react";
import { calculateVolume } from "../helpers/calculateVolume.js";
import { ESTIMATE_MODES } from "../data/estimateMode.js";
import { WORKOUT_SELECT_OPTIONS } from "../data/workoutSelectOptions.js";
import { EXERCISES } from "../data/exercises.js";

export function Calculator() {
  const [volumes, setVolumes] = useState([]);
  const [mode, setMode] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");

  useEffect(() => {
    if (!mode) {
      return;
    }
    const newVolumes = calculateVolume(EXERCISES, ESTIMATE_MODES, mode);
    console.log(newVolumes);

    setVolumes(newVolumes);
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
        <div></div>
      </header>
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
                setMode(e.target.value);
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
                  volumes[index] || {
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

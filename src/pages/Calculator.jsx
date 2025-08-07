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
import { Barbell, CaretCircleDown, CaretCircleUp } from "@phosphor-icons/react";
import { RangeInput } from "../components/rangeInput/RangeInput.jsx";
import { AddExerciseModal } from "../components/addExerciseModal/AddExerciseModal.jsx";

export function Calculator() {
  const [singleExerciseVolumes, setSingleExerciseVolumes] = useState([]);
  const [mode, setMode] = useState("");
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [totalMuscleVolume, setTotalMuscleVolume] = useState([]);
  const [toggleVolume, setToggleVolume] = useState(false);
  const [trainingFrequency, setTrainingFrequency] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [allSets, setAllSets] = useState(0);

  useEffect(() => {
    if (!mode) {
      return;
    }

    const singleExercises = calculateSingleExerciseVolumes(
      workoutExercises,
      ESTIMATE_MODES,
      mode,
    );
    const totalMuscleVolumes = calculateTotalVolumes(
      mode,
      ESTIMATE_MODES,
      workoutExercises,
    );

    setTotalMuscleVolume(totalMuscleVolumes);
    setSingleExerciseVolumes(singleExercises);
  }, [mode, workoutExercises]);

  useEffect(() => {
    setWorkoutExercises((prevState) => {
      return prevState.map((exercise) => {
        return {
          ...exercise,
          sets: allSets,
        };
      });
    });
  }, [allSets]);

  function handleAddExercise(exercise) {
    const sanitizedExercise = exercise.trim().toLowerCase();

    // match for search query
    const match = EXERCISES.find((exercise) => {
      return exercise.name.toLowerCase() === sanitizedExercise;
    });

    if (!match) {
      console.warn("No match found");
      return;
    }

    // check if exercise is already in array
    const isDuplicate = workoutExercises.some((exercise) => {
      return exercise.name.toLowerCase() === match.name.toLowerCase();
    });

    if (isDuplicate) {
      console.warn("Exercise already in workout");
      return;
    }

    setWorkoutExercises((prevState) => [
      ...prevState,
      {
        ...match,
        sets: allSets,
      },
    ]);
  }

  function handleRemoveExercise(exercise) {
    const newWorkout = workoutExercises.filter((ex) => {
      return ex.name !== exercise;
    });

    setWorkoutExercises(newWorkout);
  }

  function handleSetChange(name, newSets) {
    if (newSets < 0) {
      return;
    }
    // update state op basis van de vorige waarde
    setWorkoutExercises((prevState) => {
      // we maken een nieuwe arr waarin we 1 specifieke oefening bijwerken
      // dit moet 'volgens react' ivm het immutability principe. Dus eerst
      // een copy en aanpassing en dan de nieuwe state setten.
      // dat principe niet honoreren zorgt dat react feitelijk hetzelfde object krijgt
      // het verschil niet ziet en geen re-render doet
      return prevState.map((exercise) => {
        // als de namen overeenkomen returnen we een kopie van de exercise met de sets
        return exercise.name === name
          ? {
              ...exercise,
              sets: newSets,
            }
          : // de niet matches returnen we as is
            exercise;
      });
    });
  }

  function handleWorkoutNameChange(e) {
    const name = e.target.value;

    if (name.length > 50) {
      return;
    }

    setWorkoutName(name);
  }

  return (
    <div className={styles["workouts"]}>
      <h1>Workout Templates</h1>
      <div>
        {showModal && (
          <AddExerciseModal
            searchType="exercise"
            title="Add exercise to workout"
            searchData={EXERCISES}
            onClose={() => setShowModal(false)}
            addExercise={handleAddExercise}
            workoutExercises={workoutExercises}
            removeExercise={handleRemoveExercise}
          />
        )}
        <aside>
          <div className={styles["workouts__new-workout-container"]}>
            <InputWrapper maxWidth="70%">
              <SelectInput
                id="workouts"
                name="workout-select"
                options={WORKOUT_SELECT_OPTIONS}
                placeholder="Select workout"
                onChange={(e) => {
                  setSelectedWorkout(e.target.value);
                }}
                value={selectedWorkout}
              />
            </InputWrapper>
            <Button
              type="text"
              maxWidth="30%"
              styling="success"
              label="New workout"
            />
          </div>
          <section className={styles["workouts__total-volume"]}>
            <div>
              <h3>Total training volume</h3>
              <div
                onClick={() => {
                  setToggleVolume(!toggleVolume);
                }}
              >
                <span>{toggleVolume ? "Show" : "Hide"}</span>
                {toggleVolume ? (
                  <CaretCircleUp size={20} />
                ) : (
                  <CaretCircleDown size={20} />
                )}
              </div>
            </div>
            <div className={styles["workouts__frequency"]}>
              <InputWrapper maxWidth="100%" direction="row">
                <RangeInput
                  name="Frequency"
                  id="frequency"
                  hasLabel={true}
                  min="1"
                  max="7"
                  value={trainingFrequency}
                  onChange={(e) => {
                    setTrainingFrequency(e.target.value);
                  }}
                />
              </InputWrapper>
              <InputWrapper maxWidth="100%" direction="row">
                <RangeInput
                  name="Sets"
                  id="all-sets"
                  hasLabel={true}
                  min="0"
                  max="10"
                  value={allSets}
                  onChange={(e) => {
                    setAllSets(e.target.value);
                  }}
                />
              </InputWrapper>
            </div>
            {mode && workoutExercises.length > 0 ? (
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
                        <span>
                          {(muscle.volume * trainingFrequency).toFixed(2)}
                        </span>
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

          <div className={styles["buttons-container"]}>
            <Button
              type="button"
              maxWidth="100%"
              disabled={false}
              label="Add Exercise"
              styling="primary"
              onClick={() => {
                setShowModal(!showModal);
              }}
            />
            <Button
              type="submit"
              maxWidth="100%"
              disabled={false}
              label="Save Workout"
              styling="success"
            />
          </div>
        </aside>

        <main className={styles["workouts-container"]}>
          <div className={styles["workouts__workout-name-container"]}>
            <hr />
            <h4>{workoutName ? workoutName : <Barbell size={20} />}</h4>
            <hr />
          </div>
          <div className={styles["workouts-container__controls"]}>
            <InputWrapper maxWidth="100%">
              <InputField
                id="workout-name"
                name="workout-name"
                type="text"
                hasLabel={false}
                placeholder="Workout name"
                value={workoutName}
                onChange={handleWorkoutNameChange}
              />
            </InputWrapper>
            <InputWrapper maxWidth="100%">
              <SelectInput
                id="mode"
                name="mode-select"
                options={["neutral", "optimistic", "conservative"]}
                placeholder="Choose mode"
                onChange={(e) => {
                  setMode(e.target.value.toLowerCase());
                }}
                value={mode}
              />
            </InputWrapper>
          </div>
          <section className={styles["workouts-container__exercises"]}>
            {workoutExercises.length > 0 ? (
              workoutExercises.map((exercise, index) => {
                return (
                  <ExerciseCard
                    exercise={exercise}
                    key={index}
                    volume={
                      singleExerciseVolumes[index] || {
                        primary: null,
                        secondary: null,
                      }
                    }
                    onSetChange={(newSets) =>
                      handleSetChange(exercise.name, newSets)
                    }
                    removeExercise={handleRemoveExercise}
                    volumeMode={mode}
                  />
                );
              })
            ) : (
              <p className={styles["no-exercises-message"]}>
                No exercises to display.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

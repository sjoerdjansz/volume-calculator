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
  ArrowsInLineVertical,
  ArrowsOutLineVertical,
  Barbell,
  CaretCircleDown,
  CaretCircleUp,
  Eraser,
} from "@phosphor-icons/react";
import { RangeInput } from "../components/rangeInput/RangeInput.jsx";
import { AddExerciseModal } from "../components/addExerciseModal/AddExerciseModal.jsx";
import { IconToggle } from "../components/iconToggle/IconToggle.jsx";
import { Tooltip } from "../components/tooltip/Tooltip.jsx";
import { calculateVolumeByLevel } from "../helpers/calculateVolumeByLevel.js";

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
  const [minimizeAllCards, setMinimizeAllCards] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState(1);
  const [workouts, setWorkouts] = useState(() => {
    const data = localStorage.getItem("workouts");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    if (!selectedWorkout) {
      return;
    }
    const matchedWorkout = workouts.find(
      (workout) => workout.name === selectedWorkout,
    );

    setWorkoutName(matchedWorkout.name);
    setWorkoutExercises(matchedWorkout.exercises || []);
    setTrainingFrequency(Number(matchedWorkout.frequency) || 1);
    setExperienceLevel(Number(matchedWorkout.level) || 1);
    setMode(matchedWorkout.mode || "");
  }, [selectedWorkout, workouts]);

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

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

    const totalMuscleVolumesWithColors = calculateVolumeByLevel(
      experienceLevel,
      totalMuscleVolumes,
      trainingFrequency,
    );

    setTotalMuscleVolume(totalMuscleVolumesWithColors);
    setSingleExerciseVolumes(singleExercises);
  }, [experienceLevel, mode, workoutExercises, trainingFrequency]);

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
        sets: 3,
      },
    ]);
  }

  function handleSaveWorkout() {
    const newWorkout = {
      name: workoutName || `Workout-${Date.now()}`,
      exercises: workoutExercises,
      frequency: Number(trainingFrequency),
      level: Number(experienceLevel),
      mode,
    };

    setWorkouts((prev) => {
      // als we workout hebben geselecteerd, updaten we die
      if (selectedWorkout) {
        return prev.map((w) =>
          w.name === selectedWorkout ? { ...w, ...newWorkout } : w,
        );
      }

      setSelectedWorkout(workoutName);
      // geen nieuwe? dan nieuwe workout toevoegen
      return [...prev, newWorkout];
    });
  }

  function handleStartOver() {
    localStorage.removeItem("workouts");
    setWorkouts([]);
    setSelectedWorkout("");
    setWorkoutName("");
    setWorkoutExercises([]);
    setTrainingFrequency(1);
    setExperienceLevel(1);
    setMode("");
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
            searchType="exercises"
            title="Add exercises to workout"
            searchData={EXERCISES}
            onClose={() => setShowModal(false)}
            addExercise={handleAddExercise}
            workoutExercises={workoutExercises}
            removeExercise={handleRemoveExercise}
          />
        )}
        <aside>
          <div className={styles["workouts__new-workout-container"]}>
            <Button
              type="button"
              maxWidth="30%"
              styling="error"
              label="Start over"
              onClick={handleStartOver}
              icon={<Eraser size={16} />}
            />

            <InputWrapper maxWidth="100%">
              <SelectInput
                id="workouts"
                name="Select workout"
                hasLabel={false}
                options={workouts.map((workout) => workout.name)}
                placeholder="Select workout"
                onChange={(e) => {
                  setSelectedWorkout(e.target.value);
                }}
                value={selectedWorkout}
              />
            </InputWrapper>
          </div>
          <section className={styles["workouts__total-volume"]}>
            <div>
              <h3>Total training volume</h3>
              <IconToggle
                handleToggle={() => setToggleVolume(!toggleVolume)}
                iconOne={{
                  icon: <CaretCircleUp size={20} />,
                  label: "Show",
                }}
                iconTwo={{
                  icon: <CaretCircleDown size={20} />,
                  label: "Hide",
                }}
              />
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
                  name="Level"
                  id="client-level"
                  hasLabel={true}
                  min="1"
                  max="3"
                  value={experienceLevel}
                  onChange={(e) => {
                    setExperienceLevel(Number(e.target.value));
                  }}
                  tooltip={
                    <Tooltip
                      message={[
                        "1: Beginner",
                        "2: Intermediate",
                        "3: Advanced",
                      ]}
                    />
                  }
                />
              </InputWrapper>
            </div>
            {mode && workoutExercises.length > 0 ? (
              <ul
                className={`${styles["workouts-total-volume__list"]} ${toggleVolume && styles["disabled"]}`}
              >
                {totalMuscleVolume &&
                  totalMuscleVolume.map((muscle, index) => {
                    const hue = 123;
                    const sat = 38;
                    const lightness = muscle.hslLightness;
                    return (
                      <li
                        className={styles["workouts-total-volume__list-item"]}
                        key={index}
                      >
                        <span
                          style={{
                            backgroundColor:
                              muscle.hslLightness !== null
                                ? `hsl(${hue} ${sat}% ${lightness}%)`
                                : "",
                            color:
                              muscle.status === "above" ? "#ef5350" : "inherit",
                          }}
                        >
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
              onClick={handleSaveWorkout}
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
            <div>
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
                  name="Mode"
                  hasLabel={false}
                  options={["neutral", "optimistic", "conservative"]}
                  placeholder="Choose mode"
                  onChange={(e) => {
                    setMode(e.target.value.toLowerCase());
                  }}
                  value={mode}
                />
              </InputWrapper>
            </div>
            <div className={styles["workouts__minimize-wrapper"]}>
              {minimizeAllCards ? (
                <span onClick={() => setMinimizeAllCards(!minimizeAllCards)}>
                  Hide details
                  <ArrowsInLineVertical size={20} />
                </span>
              ) : (
                <span onClick={() => setMinimizeAllCards(!minimizeAllCards)}>
                  Show details <ArrowsOutLineVertical size={20} />
                </span>
              )}
            </div>
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
                    minimize={minimizeAllCards}
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

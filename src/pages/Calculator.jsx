import styles from "./Calculator.module.css";

import { ExerciseCard } from "../components/exerciseCard/ExerciseCard.jsx";
import { useEffect, useState } from "react";
import {
  calculateSingleExerciseVolumes,
  calculateTotalVolumes,
} from "../helpers/calculateVolume.js";
import { ESTIMATE_MODES } from "../data/estimateMode.js";
import { EXERCISES } from "../data/exercises.js";
import {
  ArrowsInLineVertical,
  ArrowsOutLineVertical,
  Barbell,
  Eraser,
} from "@phosphor-icons/react";
import { AddExerciseModal } from "../components/addExerciseModal/AddExerciseModal.jsx";
import { calculateVolumeByLevel } from "../helpers/calculateVolumeByLevel.js";
import { CalculatorSidebar } from "../components/calculatorSidebar/CalculatorSidebar.jsx";

import { createWorkout } from "../helpers/createWorkout.js";
import { MANDATORY_GROUPS } from "../data/mandatoryGroups.js";
import { calculateCompoundness } from "../helpers/calculateCompoundness.js";
import { sortExercises } from "../helpers/sortExercises.js";
import { Snackbar } from "../components/snackbar/Snackbar.jsx";
import { TotalVolumeSidebar } from "../components/totalVolumeSidebar/TotalVolumeSidebar.jsx";
import { Button } from "../components/button/Button.jsx";

export function Calculator() {
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [singleExerciseVolumes, setSingleExerciseVolumes] = useState([]); // volume per individual exercise
  const [totalMuscleVolume, setTotalMuscleVolume] = useState([]); // total muscle volume per muscle
  // UI states
  const [minimizeAllCards, setMinimizeAllCards] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toggleSnackbar, setToggleSnackbar] = useState({
    open: false,
    message: "",
    status: "",
    time: "",
  });
  // Settings/controls states
  const [workoutName, setWorkoutName] = useState("");
  const [mode, setMode] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [trainingFrequency, setTrainingFrequency] = useState(1);
  // Workouts that are being persisted to localstorage
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const storedWorkouts = localStorage.getItem("workouts");

    setWorkouts(storedWorkouts ? JSON.parse(storedWorkouts) : []);
  }, []);

  // als een workout wordt gevonden uit de database (die bestaat niet) zet die de verschillende states
  // geen workout match = return
  useEffect(() => {
    if (!selectedWorkout) {
      return;
    }
    const matchedWorkout = workouts.find(
      (workout) => workout.name === selectedWorkout,
    );
    if (!matchedWorkout) {
      console.log("in error no matched workout: ", workouts);
      return;
    }
    setWorkoutName(matchedWorkout.name);
    setWorkoutExercises(matchedWorkout.exercises || []);
    setTrainingFrequency(Number(matchedWorkout.frequency) || 1);
    setExperienceLevel(
      matchedWorkout.level !== undefined && matchedWorkout.level !== null
        ? Number(matchedWorkout.level)
        : "",
    );
    setMode(matchedWorkout.mode || "");
  }, [selectedWorkout, workouts]);

  // calculate volumes if there is a mode selected. Updated with dependencies
  useEffect(() => {
    if (!mode) {
      setTotalMuscleVolume([]);
      setSingleExerciseVolumes([]);
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
      Number(experienceLevel),
      totalMuscleVolumes,
      trainingFrequency,
    );

    setTotalMuscleVolume(totalMuscleVolumesWithColors);
    setSingleExerciseVolumes(singleExercises);
  }, [experienceLevel, mode, workoutExercises, trainingFrequency]);

  function addGeneratedExercises() {
    const compoundness = calculateCompoundness(EXERCISES);
    let sortedWorkout = sortExercises(
      createWorkout(compoundness, MANDATORY_GROUPS),
    );

    sortedWorkout = sortedWorkout.map((exercise) => {
      return {
        ...exercise,
        sets: 3,
      };
    });
    setWorkoutExercises(sortedWorkout);
  }

  // add exercise to workout, still uses name to match (TODO: update to ID).
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

    const computedMatch = calculateCompoundness(match);

    setWorkoutExercises((prevState) => [
      ...prevState,
      {
        ...computedMatch,
        sets: 3, // set 3 sets as basic value
      },
    ]);
  }

  function handleSaveWorkout(e) {
    e.preventDefault();

    const newWorkout = {
      id: Date.now(),
      name: workoutName.trim() || `Workout-${Date.now()}`,
      exercises: workoutExercises,
      frequency: Number(trainingFrequency),
      level: Number(experienceLevel),
      mode,
    };

    // make sure workout gets added to database (or localstorage)

    // maybe add the UX option for user to overwrite/save or cancel and adjust name
    // Now we auto overwrite
    // we gebruiken de prevState om te checken of we moeten overwriten of toevoegen
    setWorkouts((prevState) => {
      const existingWorkout = prevState.find(
        (item) => item.name === newWorkout.name,
      );
      if (existingWorkout) {
        const updatedWorkouts = prevState.map((item) => {
          if (item.name === newWorkout.name) {
            return {
              ...newWorkout,
              id: item.id,
            };
          } else {
            return item;
          }
        });
        setToggleSnackbar({
          open: true,
          message: "Workout edited",
          status: "success",
        });
        localStorage.setItem("workouts", JSON.stringify(updatedWorkouts));

        return updatedWorkouts;
      } else {
        setToggleSnackbar({
          open: true,
          message: "Workout saved",
          status: "success",
        });

        localStorage.setItem(
          "workouts",
          JSON.stringify([...prevState, newWorkout]),
        );
        return [...prevState, newWorkout]; // we staat duplicates op naam feitelijk toe. wellicht aanpassen
        // in toekomst
      }
    });

    setSelectedWorkout(newWorkout.name);
    setWorkoutName(newWorkout.name);
  }

  // Delete workout and reset state
  function handleDeleteWorkout() {
    localStorage.setItem("workouts", "");

    // Reset state
    setWorkouts([]);
    setSelectedWorkout("");
    setWorkoutName("");
    setWorkoutExercises([]);
    setTrainingFrequency(1);
    setExperienceLevel("");
    setMode("");
  }

  function handleClearWorkout() {
    setToggleSnackbar({
      open: true,
      message: "Workout data cleared",
    });
    // Reset state
    setSelectedWorkout("");
    setWorkoutName("");
    setWorkoutExercises([]);
    setTrainingFrequency(1);
    setExperienceLevel("");
    setMode("");
  }

  function handleRemoveExercise(exercise) {
    const newWorkout = workoutExercises.filter((ex) => {
      return ex.name !== exercise;
    });

    setToggleSnackbar({
      open: true,
      message: `${exercise} deleted`,
      status: "warning",
      time: 1500,
    });
    setWorkoutExercises(newWorkout);
  }

  // TODO: make sure the exercise is selected by ID not name
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
        // als de namen (TODO: moet id's worden) overeenkomen returnen we een kopie van
        //  de exercise met de sets
        return exercise.name === name
          ? {
              ...exercise,
              sets: newSets,
            }
          : // de niet matches returnen we 'as is'
            exercise;
      });
    });
  }

  function handleWorkoutNameChange(e) {
    const name = e.target.value;

    if (name.length > 50) {
      return;
    }

    setWorkoutName(name.trim());
  }

  return (
    <div className={styles["workouts"]}>
      <Snackbar
        open={toggleSnackbar.open}
        message={toggleSnackbar.message}
        status={toggleSnackbar.status}
        time={toggleSnackbar.time}
        onClose={() =>
          setToggleSnackbar((snack) => ({
            ...snack,
            open: false,
          }))
        }
      />
      <div className={styles["workouts__page-title-wrapper"]}>
        <h1>Workout Templates</h1>
        <Button
          type="button"
          maxWidth="10rem"
          styling="error-text"
          label="Delete workouts"
          onClick={handleDeleteWorkout}
        />
      </div>
      <div className={styles["workouts__content"]}>
        {showModal && (
          <AddExerciseModal
            searchType="exercises"
            title="Add exercises to workout"
            searchData={EXERCISES}
            onClose={() => setShowModal(false)}
            addExercise={handleAddExercise}
            workoutExercises={workoutExercises}
            removeExercise={handleRemoveExercise}
            handleGeneratedWorkout={addGeneratedExercises}
          />
        )}
        <CalculatorSidebar
          onWorkoutNameChange={handleWorkoutNameChange}
          workoutName={workoutName}
          workouts={workouts}
          onStartOver={handleDeleteWorkout}
          mode={mode}
          onModeChange={setMode}
          selectedWorkout={selectedWorkout}
          onSelectWorkout={setSelectedWorkout}
          trainingFrequency={trainingFrequency}
          onTrainingFrequencyChange={setTrainingFrequency}
          experienceLevel={experienceLevel}
          onExperienceLevelChange={setExperienceLevel}
          workoutExercises={workoutExercises}
          totalMuscleVolume={totalMuscleVolume}
          onSaveWorkout={handleSaveWorkout}
          showModal={showModal}
          onShowModal={setShowModal}
          handleGeneratedWorkout={addGeneratedExercises}
          handleClearWorkout={handleClearWorkout}
        />
        <main className={styles["workouts-container"]}>
          <div className={styles["workouts__workout-name-container"]}>
            <hr />
            <h4>{workoutName ? workoutName : <Barbell size={20} />}</h4>
            <hr />
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
        {/*TODO: verzinnen wat te doen met nieuwe*/}
        {/*<TotalVolumeSidebar />*/}
      </div>
    </div>
  );
}

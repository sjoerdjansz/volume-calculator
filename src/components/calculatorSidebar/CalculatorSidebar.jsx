import styles from "./CalculatorSidebar.module.css";
import { Button } from "../button/Button.jsx";
import {
  CaretCircleDown,
  CaretCircleUp,
  Eraser,
  PlusCircle,
} from "@phosphor-icons/react";
import { InputWrapper } from "../InputWrapper/InputWrapper.jsx";
import { SelectInput } from "../selectInput/SelectInput.jsx";
import { InputField } from "../inputField/InputField.jsx";
import { IconToggle } from "../iconToggle/IconToggle.jsx";
import { RangeInput } from "../rangeInput/RangeInput.jsx";
import { Tooltip } from "../tooltip/Tooltip.jsx";
import { useState } from "react";
import { EXPERIENCE_LEVELS } from "../../data/experienceLevels.js";

export function CalculatorSidebar({
  workouts,
  onStartOver,
  onWorkoutNameChange,
  workoutName,
  mode,
  onModeChange,
  selectedWorkout,
  onSelectWorkout,
  trainingFrequency,
  onTrainingFrequencyChange,
  experienceLevel,
  onExperienceLevelChange,
  workoutExercises,
  totalMuscleVolume,
  onSaveWorkout,
  onShowModal,
  showModal,
  handleGeneratedWorkout,
}) {
  const [toggleVolume, setToggleVolume] = useState(false);

  return (
    <aside>
      <div className={styles["workouts__new-workout-container"]}>
        <div>
          <Button
            type="button"
            maxWidth="100%"
            styling="success"
            label="Save Workout"
            onClick={onSaveWorkout}
            icon={<PlusCircle size={16} />}
          />
          <Button
            type="button"
            maxWidth="100%"
            styling="error"
            label="Delete Workout"
            onClick={onStartOver}
            icon={<Eraser size={16} />}
          />
        </div>
        <div>
          <InputWrapper maxWidth="100%">
            <SelectInput
              id="workouts"
              name="Select workout"
              hasLabel={false}
              options={workouts.map((workout) => workout.name)}
              placeholder="Select workout"
              onChange={(e) => {
                onSelectWorkout(e.target.value);
              }}
              value={selectedWorkout}
            />
          </InputWrapper>
        </div>
      </div>
      <section className={styles["workouts__total-volume"]}>
        <div className={styles["workouts__controls"]}>
          <div>
            <InputWrapper maxWidth="100%">
              <InputField
                id="workout-name"
                name="Name"
                type="text"
                hasLabel={false}
                placeholder="Workout name"
                value={workoutName}
                onChange={onWorkoutNameChange}
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
                  onModeChange(e.target.value);
                }}
                value={mode}
              />
            </InputWrapper>
          </div>
          <div className={styles["workouts__subtitle"]}>
            <div>
              <h3>Total training volume</h3>
              <Tooltip
                message="Total weekly volume per muscle based on training frequency and
          experience. Red is too high. Light green means the volume is near the
          upper limit of the recommended range. Dark green is closer to the
          lower limit."
              />
            </div>
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
        </div>
        <div className={styles["workouts__controls-inputs"]}>
          <InputWrapper maxWidth="100%" direction="row">
            <SelectInput
              id="trainingLevel"
              name="Level"
              hasLabel={true}
              options={EXPERIENCE_LEVELS}
              value={experienceLevel}
              placeholder="Experience level"
              onChange={(e) => onExperienceLevelChange(Number(e.target.value))}
              tooltip={
                <Tooltip
                  message={[
                    "Beginner: 6-12 sets per week",
                    "Intermediate: 10-18 sets per week",
                    "Advanced: 15-22 sets per week",
                  ]}
                />
              }
            />
          </InputWrapper>
          <InputWrapper maxWidth="100%" direction="row">
            <RangeInput
              name="Frequency"
              id="frequency"
              hasLabel={true}
              min="1"
              max="7"
              value={trainingFrequency}
              onChange={(e) => {
                onTrainingFrequencyChange(Number(e.target.value));
              }}
              tooltip={<Tooltip message="Training frequency per week" />}
            />
          </InputWrapper>
        </div>

        {mode &&
        workoutExercises.length > 0 &&
        Number(experienceLevel) > 0 &&
        trainingFrequency > 0 ? (
          <ul
            className={`${styles["workouts-total-volume__list"]} ${toggleVolume && styles["disabled"]}`}
          >
            {totalMuscleVolume &&
              totalMuscleVolume.map((muscle) => {
                const hue = 123;
                const sat = 38;
                const lightness = muscle.hslLightness;
                return (
                  <li
                    className={styles["workouts-total-volume__list-item"]}
                    key={muscle.muscle}
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
            <p>
              Add exercises and adjust the controls to show volume per muscle.
            </p>
          </div>
        )}
      </section>

      <Button
        type="button"
        maxWidth="100%"
        disabled={false}
        label="Generate Workout"
        styling="primary-alt"
        onClick={handleGeneratedWorkout}
      />
      <Button
        type="button"
        maxWidth="100%"
        disabled={false}
        label="Add Exercise"
        styling="primary"
        onClick={() => {
          onShowModal(!showModal);
        }}
      />
    </aside>
  );
}

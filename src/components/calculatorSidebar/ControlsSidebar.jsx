import styles from "./ControlsSidebar.module.css";
import { Button } from "../button/Button.jsx";
import { Eraser, PlusCircle } from "@phosphor-icons/react";
import { InputWrapper } from "../InputWrapper/InputWrapper.jsx";
import { SelectInput } from "../selectInput/SelectInput.jsx";
import { InputField } from "../inputField/InputField.jsx";
import { RangeInput } from "../rangeInput/RangeInput.jsx";
import { Tooltip } from "../tooltip/Tooltip.jsx";
import { EXPERIENCE_LEVELS } from "../../data/experienceLevels.js";

export function ControlsSidebar({
  workouts,
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
  onSaveWorkout,
  onShowModal,
  showModal,
  handleGeneratedWorkout,
  handleClearWorkout,
}) {
  return (
    <aside className={styles["controls-sidebar"]}>
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
            styling="primary-alt"
            label="Clear workout"
            onClick={handleClearWorkout}
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
      <section className={styles["workouts__controls-container"]}>
        <h3>Settings</h3>
        <div className={styles["workouts__controls-inputs"]}>
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
          <InputWrapper maxWidth="100%" direction="row">
            <SelectInput
              id="trainingLevel"
              name="Level"
              hasLabel={true}
              options={EXPERIENCE_LEVELS}
              value={String(experienceLevel)}
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

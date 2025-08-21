import styles from "./TotalVolumeSidebar.module.css";
import { IconToggle } from "../iconToggle/IconToggle.jsx";
import { useState } from "react";
import {
  ArrowsInLineVertical,
  ArrowsOutLineVertical,
} from "@phosphor-icons/react";
import { SET_RANGES } from "../../helpers/calculateVolumeByLevel.js";

export function TotalVolumeSidebar({
  totalMuscleVolume,
  mode,
  workoutExercises,
  experienceLevel,
  trainingFrequency,
}) {
  const [toggleVolume, setToggleVolume] = useState(false);

  function createVolumeMessages(muscle, xpLevel) {
    const { weeklyVolume, percentFromAvg } = muscle;
    const { low, high } = SET_RANGES[xpLevel];

    const percent = percentFromAvg * 100;
    const average = (low + high) / 2;
    const lowerThan = ((weeklyVolume - low) / low) * 100;
    const higherThan = ((weeklyVolume - high) / high) * 100;

    let fromAverage;
    if (percent > 0) {
      fromAverage = "above";
    } else if (percent === 0) {
      fromAverage = "exactly";
    } else {
      fromAverage = "below";
    }

    if (weeklyVolume === average) {
      return `Volume is within the recommended range. 
It’s ${fromAverage} the average for this muscle (${average} sets).`;
    }

    if (weeklyVolume >= low && weeklyVolume <= high) {
      return `Volume is within the suggested range (${low}–${high} sets). 
It’s ${Math.abs(percent).toFixed(0)}% ${fromAverage} the average for this muscle.`;
    } else if (weeklyVolume < low) {
      return `About ${Math.abs(lowerThan.toFixed(0))}% lower than the suggested minimum (${low} sets). 
Consider adding more sets to benefit this muscle group.`;
    } else if (weeklyVolume > high) {
      return `Volume is about ${higherThan.toFixed(0)}% above the higher end of the range (${high} sets). 
Reducing a few sets may improve recovery and workout balance.`;
    }
  }

  function getStyles(muscle) {
    const { volumeInRange, status } = muscle;

    if (volumeInRange) {
      return "green-card";
    } else if (status === "above") {
      return "red-card";
    } else {
      return "yellow-card";
    }
  }

  // TODO: Zorgen dat de gebruiker de optie heeft om het totale volume van
  // alle opgeslagen workouts te zien met een toggle in controls oid.
  // dus: toggle tussen: show single workout / show all workouts volumes

  return (
    <aside className={styles["volume-sidebar"]}>
      <div className={styles["volume-sidebar__header"]}>
        <h3>Weekly training volume</h3>

        <IconToggle
          handleToggle={() => setToggleVolume(!toggleVolume)}
          iconOne={{
            icon: <ArrowsOutLineVertical size={20} />,
            label: "Show details",
          }}
          iconTwo={{
            icon: <ArrowsInLineVertical size={20} />,
            label: "Hide details",
          }}
        />
      </div>
      {mode &&
      workoutExercises.length > 0 &&
      Number(experienceLevel) > 0 &&
      trainingFrequency > 0 ? (
        <ul className={styles["muscle-volume__list"]}>
          {totalMuscleVolume &&
            totalMuscleVolume.map((muscle) => {
              return (
                <li
                  key={muscle.muscle}
                  className={`${styles["muscle-volume__list-item"]} ${styles[getStyles(muscle, experienceLevel)]}`}
                >
                  <p className={styles["muscle-list-item__title"]}>
                    {muscle.muscle}
                  </p>
                  <p className={styles["muscle-list-item__volume"]}>
                    {muscle.weeklyVolume.toFixed(2)}
                  </p>
                  <p
                    className={`${toggleVolume && styles["disabled"]} ${styles["muscle-list-item__content"]}`}
                  >
                    {createVolumeMessages(muscle, experienceLevel)}
                  </p>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className={styles["muscle-volume__list-alt"]}>
          <p>
            Add exercises and adjust the controls to show volume per muscle.
          </p>
        </div>
      )}
    </aside>
  );
}

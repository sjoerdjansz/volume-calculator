import styles from "./TotalVolumeSidebar.module.css";
import { useEffect, useState } from "react";
import { MathOperations } from "@phosphor-icons/react";
import {
  calculateVolumeByLevel,
  SET_RANGES,
} from "../../helpers/calculateVolumeByLevel.js";
import { Button } from "../button/Button.jsx";
import { calculateTotalVolumes } from "../../helpers/calculateVolume.js";
import { ESTIMATE_MODES } from "../../data/estimateMode.js";

export function TotalVolumeSidebar({
  totalMuscleVolume,
  workoutExercises,
  experienceLevel,
}) {
  const [toggleTotalVolume, setToggleTotalVolume] = useState(false);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [allMuscleVolumes, setAllMuscleVolumes] = useState([]);
  const [calculatedExperienceLevel, setCalculatedExperienceLevel] =
    useState(null);

  useEffect(() => {
    const workouts = localStorage.getItem("workouts");

    if (!workouts) {
      console.warn("No workouts in local storage");
      return;
    }

    // TODO: Zorgen dat de parsedWorkouts FREQUENCY wordt meegenomen in de total workouts calculation
    const parsedWorkouts = workouts ? JSON.parse(workouts) : [];

    setSavedWorkouts(parsedWorkouts);
    const subTotal = parsedWorkouts.map((workout) => {
      const totalVolumes = calculateTotalVolumes(
        workout.mode,
        ESTIMATE_MODES,
        workout.exercises,
      );

      return calculateVolumeByLevel(
        Number(workout.level),
        totalVolumes,
        workout.trainingFrequency,
      );
    });

    setAllWorkouts(subTotal);

    const summedVolumesArr = sumVolumes(subTotal);

    setAllMuscleVolumes(
      calculateAllVolumes(summedVolumesArr).sort((a, b) => {
        return b.totalVolume - a.totalVolume;
      }),
    );

    setCalculatedExperienceLevel(getExperienceLevel());
  }, [toggleTotalVolume]);

  function sumVolumes(workouts) {
    let totals = [];
    for (let i = 0; i < workouts.length; i++) {
      workouts[i].map((item) => {
        totals.push({
          ...item,
          muscle: item.muscle,
          volume: item.weeklyVolume,
        });
      });
    }
    return totals;
  }

  function calculateAllVolumes(muscles) {
    const totals = {};
    for (const { muscle, volume } of muscles) {
      if (!totals[muscle]) {
        totals[muscle] = 0;
      }
      totals[muscle] = totals[muscle] + volume;
    }

    return Object.entries(totals).map((entry) => ({
      muscle: entry[0],
      totalVolume: entry[1],
    }));
  }

  function createTotalVolumeMessages(muscle, xpLevel) {
    if (xpLevel == null) return null;

    const { totalVolume } = muscle;
    const range = SET_RANGES[xpLevel];
    if (!range) return null;

    const { low, high } = range;
    const average = (low + high) / 2;

    // relatieve verschillen
    const percentFromAvg = (totalVolume - average) / average; // bv. -0.6 = 60% onder
    const lowerThan = ((totalVolume - low) / low) * 100; // in %
    const higherThan = ((totalVolume - high) / high) * 100; // in %

    const fromAverage =
      percentFromAvg > 0 ? "above" : percentFromAvg < 0 ? "below" : "exactly";

    // gelijk aan gemiddelde (met tolerantie)
    const EPS = 1e-9;
    if (Math.abs(totalVolume - average) < EPS) {
      return `Volume is within the recommended range. 
It’s exactly the average for this muscle (${average} sets).`;
    }

    if (totalVolume >= low && totalVolume <= high) {
      return `Volume is within the suggested range (${low}–${high} sets). 
It’s ${Math.abs(percentFromAvg * 100).toFixed(0)}% ${fromAverage} the average for this muscle.`;
    } else if (totalVolume < low) {
      return `About ${Math.abs(lowerThan).toFixed(0)}% lower than the suggested minimum (${low} sets). 
Consider adding more sets to benefit this muscle group.`;
    } else {
      return `Volume is about ${Math.abs(higherThan).toFixed(0)}% above the higher end of the range (${high} sets). 
Reducing a few sets may improve recovery and workout balance.`;
    }
  }

  function createSingleVolumeMessages(muscle, xpLevel) {
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

  function getStyles(muscle, xpLevel) {
    // Support both shapes
    const volume = muscle.weeklyVolume ?? muscle.totalVolume;
    if (volume == null || xpLevel == null || !SET_RANGES[xpLevel])
      return "yellow-card";

    const { low, high } = SET_RANGES[xpLevel];

    if (volume > high) return "red-card";
    if (volume < low) return "yellow-card";
    return "green-card";
  }

  function getExperienceLevel() {
    let averageExpLvl;
    if (experienceLevel) {
      return experienceLevel;
    } else {
      averageExpLvl = savedWorkouts.reduce((acc, curr) => {
        return acc + curr.level / savedWorkouts.length;
      }, 0);
    }
    return averageExpLvl;
  }

  return (
    <aside className={styles["volume-sidebar"]}>
      <div className={styles["volume-sidebar__header"]}>
        <h3>Weekly training volume</h3>
        <Button
          label={toggleTotalVolume ? "Total volume" : "Single workout volume"}
          onClick={() => setToggleTotalVolume(!toggleTotalVolume)}
          icon={<MathOperations size={20} />}
          maxWidth={"200px"}
          type="button"
          styling="primary-alt"
        />
      </div>

      {toggleTotalVolume ? (
        <ul className={styles["muscle-volume__list"]}>
          {allMuscleVolumes &&
            calculatedExperienceLevel &&
            allMuscleVolumes.map((muscle) => {
              return (
                <li
                  key={muscle.muscle}
                  className={`${styles["muscle-volume__list-item"]}  ${styles[getStyles(muscle, calculatedExperienceLevel)]}`}
                >
                  <p className={styles["muscle-list-item__title"]}>
                    {muscle.muscle}
                  </p>
                  <p className={styles["muscle-list-item__volume"]}>
                    {muscle.totalVolume.toFixed(2)}
                  </p>
                  <p className={styles["muscle-list-item__content"]}>
                    {createTotalVolumeMessages(
                      muscle,
                      calculatedExperienceLevel,
                    )}
                  </p>
                </li>
              );
            })}
        </ul>
      ) : workoutExercises.length > 0 ? (
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
                  <p className={styles["muscle-list-item__content"]}>
                    {createSingleVolumeMessages(muscle, experienceLevel)}
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

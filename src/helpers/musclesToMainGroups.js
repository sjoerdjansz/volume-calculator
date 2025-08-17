import { MUSCLE_GROUP_MAP } from "../data/muscleGroupMap.js";

// check alle oefeningen
// loop over alle primary muscles om te zien waar ze vallen in bodypart
// met deze functie kan ik met object.entries een match vinden van een keyword
export function musclesToMainGroup(data) {
  return data.map((exercise) => {
    const primary = exercise.primaryMuscle.toLowerCase();

    const match = Object.entries(MUSCLE_GROUP_MAP).find(([muscles]) => {
      return muscles.some((m) => {
        return m.toLowerCase() === primary;
      });
    });

    return {
      id: exercise.id,
      name: exercise.name,
      mainGroup: match ? match[0] : null,
    };
  });
}

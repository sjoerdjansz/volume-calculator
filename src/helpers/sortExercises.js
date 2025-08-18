export function sortExercises(workout) {
  return workout.sort((a, b) => {
    if (
      a.bodyPart.toLowerCase() === "core" &&
      b.bodyPart.toLowerCase() !== "core"
    ) {
      return 1;
    } else if (
      b.bodyPart.toLowerCase() === "core" &&
      a.bodyPart.toLowerCase() !== "core"
    ) {
      return -1;
    }
    return b.compoundScore - a.compoundScore;
  });
}

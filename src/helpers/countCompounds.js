export function countCompounds(workout) {
  let count = 0;

  workout.forEach((exercise) => {
    // console.log(exercise.compoundLabel);
    if (exercise.compoundLabel.includes("compound")) {
      count++;
    }
  });
  return count;
}

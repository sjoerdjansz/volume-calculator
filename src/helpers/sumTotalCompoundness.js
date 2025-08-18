export function sumTotalCompoundness(workout) {
  let score = 0;
  for (let i = 0; i < workout.length; i++) {
    score += workout[i].compoundScore;
  }
  return score;
}

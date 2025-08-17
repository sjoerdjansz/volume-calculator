export function searchAndScoreExercises(searchQuery, exerciseData) {
  const sanitizedQuery = searchQuery.toLowerCase().trim();

  if (sanitizedQuery === "") return exerciseData;

  return exerciseData
    .map((exercise) => {
      let score = 0;
      if (exercise.name.toLowerCase().includes(sanitizedQuery)) {
        score += 3;
      }
      if (exercise.primaryMuscle.toLowerCase().includes(sanitizedQuery)) {
        score += 2;
      }
      if (
        exercise.secondaryMuscles.some((muscle) =>
          muscle.toLowerCase().includes(sanitizedQuery),
        )
      ) {
        score += 2;
      }
      if (exercise.bodyPart.toLowerCase().includes(sanitizedQuery)) {
        score += 1;
      }
      if (exercise.movement.toLowerCase().includes(sanitizedQuery)) {
        score += 1;
      }
      return {
        exercise,
        score,
      };
    })
    .filter((item) => {
      return item.score > 0;
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.exercise);
}

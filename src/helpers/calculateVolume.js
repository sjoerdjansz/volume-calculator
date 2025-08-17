export function calculateSingleExerciseVolumes(exercisesData, modeData, mode) {
  const factor = modeData[mode.toLowerCase()];

  return exercisesData.map((i) => {
    return {
      primary: parseFloat(((i.sets || 0) * factor.primary).toFixed(2)),
      secondary: parseFloat(((i.sets || 0) * factor.secondary).toFixed(2)),
    };
  });
}

export function calculateTotalVolumes(mode, modeData, exercises) {
  const { primary, secondary } = modeData[mode];
  const newData = [];

  exercises.forEach((exercise) => {
    newData.push({
      muscle: exercise.primaryMuscle,
      volume: exercise.sets * primary || 0,
    });
    exercise.secondaryMuscles.forEach((muscle) => {
      newData.push({
        muscle: muscle,
        volume: exercise.sets * secondary || 0,
      });
    });
  });

  const reducedArr = newData.reduce((acc, current) => {
    if (acc[current.muscle]) {
      acc[current.muscle] += current.volume;
    } else {
      acc[current.muscle] = current.volume;
    }
    return acc;
  }, {});
  return Object.entries(reducedArr)
    .map(([muscle, volume]) => ({
      muscle,
      volume,
    }))
    .sort((a, b) => {
      return b.volume - a.volume;
    });
}

export function calculateVolume(exercisesData, modeData, mode) {
  const factor = modeData[mode.toLowerCase()];

  return exercisesData.map((i) => {
    return {
      primary: parseFloat((i.sets * factor.primary).toFixed(2)),
      secondary: parseFloat((i.sets * factor.secondary).toFixed(2)),
    };
  });
}

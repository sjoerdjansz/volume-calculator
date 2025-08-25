export const SET_RANGES = {
  1: {
    low: 6,
    high: 12,
    label: "beginner",
  },
  2: {
    low: 10,
    high: 18,
    label: "intermediate",
  },
  3: {
    low: 15,
    high: 22,
    label: "advanced",
  },
};

// optioneel
function normalizedRange(volume, low, high) {
  const average = (low + high) / 2;
  const halfRange = (high - low) / 2;

  if (halfRange === 0) {
    return 0;
  }

  const norm = (volume - average) / halfRange;

  return Math.max(-1, Math.min(1, norm));
}

function softNormalize(volume, low, high) {
  const avg = (low + high) / 2;
  const half = (high - low) / 2 || 1;
  const raw = (volume - avg) / half; // low=-1, high=+1
  return Math.tanh(raw); // (-1, 1) met gradatie buiten range
}

export function calculateVolumeByLevel(trainingLevel, data, tFrequency) {
  if (!trainingLevel || trainingLevel === 0) {
    return;
  }

  const { low, high } = SET_RANGES[Number(trainingLevel)];

  const average = (high + low) / 2;

  return data.map((muscle) => {
    const weeklyVolume = Number(muscle.volume ?? 0) * Number(tFrequency ?? 1);
    const percentFromAverage = average ? (weeklyVolume - average) / average : 0;
    const inRange = weeklyVolume >= low && weeklyVolume <= high;

    let status;

    if (weeklyVolume > high) {
      status = "above";
    } else if (weeklyVolume < low) {
      status = "below";
    } else {
      status = "within";
    }

    let norm = null;

    if (inRange) {
      norm = softNormalize(weeklyVolume, low, high);
    }

    return {
      ...muscle,
      percentFromAvg: percentFromAverage,
      normalizedFromAvg: norm,
      volumeInRange: inRange,
      weeklyVolume,
      status,
    };
  });
}

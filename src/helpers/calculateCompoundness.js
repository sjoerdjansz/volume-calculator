const JOINT_MAP = {
  shoulder: ["glenohumeral", "scapulothoracale"],
  elbow: ["humeroulnar"],
  hip: ["coxofemoral"],
  knee: ["tibiofemoral"],
  ankle: ["talocrural"],
  spine: ["spine"],
};

const LOW_SCORE_MOVEMENTS = [
  "carry",
  "gait",
  "pose",
  "stretch",
  "balance",
  "core",
];

function getLoadScore(load) {
  if (load > 4) {
    return 5;
  } else return load;
}

function classifyExercise(score) {
  if (score >= 14) {
    return "primary compound";
  } else if (score > 12) {
    return "secondary compound";
  } else {
    return "assistance/isolation";
  }
}

function getJointsScore(joints) {
  const groupsFound = [];

  joints.forEach((joint) => {
    for (const group in JOINT_MAP) {
      if (JOINT_MAP[group].includes(joint) && !groupsFound.includes(group)) {
        groupsFound.push(group);
        break;
      }
    }
  });

  const j = groupsFound.length;

  if (j <= 0) return 0;
  if (j === 1) return 1;
  if (j === 2) return 2;
  if (j === 3) return 3;
  return 4;
}

export function getMusclesScore(exercise) {
  const { primaryMuscle, secondaryMuscles, movement, bodyPart } = exercise;

  const muscles = [];

  // lage score voor carry or gait
  if (LOW_SCORE_MOVEMENTS.includes(movement.toLowerCase())) {
    return 1;
  }
  if (bodyPart.toLowerCase() === "full body") {
    return 1;
  }

  if (primaryMuscle) {
    muscles.push(primaryMuscle);
  }

  if (secondaryMuscles.length > 0) {
    muscles.push(...secondaryMuscles);
  }

  const sanitizedMuscles = muscles.reduce((acc, muscle) => {
    if (!acc.includes(muscle)) acc.push(muscle);
    return acc;
  }, []);

  if (sanitizedMuscles.length === 1) {
    return 1;
  } else if (sanitizedMuscles.length < 4) {
    return 2;
  } else if (sanitizedMuscles.length < 7) {
    return 3;
  } else if (sanitizedMuscles.length < 10) {
    return 4;
  } else {
    return 5;
  }
}

// TODO: eventueel contextuele weging toepassen op basis van invoer van gebruiker
// Strength-mode: load ×2.0, joints ×1.5, muscles ×1.0 (jouw huidige).
// Hypertrophy-mode: load ×1.8, joints ×1.25, muscles ×1.5.
// Beginner-mode: verlaag joints-gewicht iets (×1.25) zodat minder technische multi-joint lifts minder snel
// Primary compounds worden.

export function calculateCompoundness(data) {
  if (!data) {
    return [];
  }
  // maak een array van data als wat we aangeleverd krijgen 1 exercise object is
  const list = Array.isArray(data) ? data : [data];

  const mappedList = list.map((exercise) => {
    const jointScore = getJointsScore(exercise.primaryJoints) * 1.25;
    const loadScore = getLoadScore(exercise.systemicLoad) * 2;
    const muscleScore = getMusclesScore(exercise) * 1.5;
    const totalScore = jointScore + loadScore + muscleScore;

    return {
      ...exercise,
      compoundScore: totalScore,
      compoundLabel: classifyExercise(totalScore),
      jointScore,
      loadScore,
      muscleScore,
    };
  });
  console.log(mappedList);

  // als true geven we de array van exercises terug, anders moeten we even item [0] van het object
  // teruggeven, wat ook een array is maar verstopt binnen het object
  return Array.isArray(data) ? mappedList : mappedList[0];
}

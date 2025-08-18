// TODO: een mooie toevoeging zou een automatisch set allocater zijn om het volume te balanceren
// bijv met button/icon in de UI voor een toggle oid

// TODO: voor later deze armcheck helper afmaken en integreren
// verplaatsen naar een helper en generieker maken
// const checkWhichArm = (workoutExercises) => {
//   let biceps = 0;
//   let triceps = 0;
//   workoutExercises.forEach((item) => {
//     if (item.primaryMuscle.toLowerCase().includes("biceps brachii")) {
//       biceps += 2;
//     }
//
//     if (item.primaryMuscle.toLowerCase().includes("triceps brachii")) {
//       triceps += 2;
//     }
//
//     const secondaries = Array.isArray(item.secondaryMuscles)
//       ? item.secondaryMuscles
//       : [];
//
//     secondaries.forEach((sec) => {
//       if (sec.toLowerCase().includes("biceps brachii")) {
//         biceps++;
//       }
//
//       if (sec.toLowerCase().includes("triceps brachii")) {
//         triceps++;
//       }
//     });
//   });
//
//   let avoid = null;
//
//   if (biceps > triceps) {
//     avoid = "biceps brachii";
//   } else if (triceps > biceps) {
//     avoid = "triceps brachii";
//   } else {
//     avoid = "equal";
//   }
//
//   return {
//     biceps: biceps,
//     triceps: triceps,
//     avoid,
//   };
// };
//
// checkWhichArm(workout);

// zorgt voor randomizatie van de gekozen bodyparts zodat elke workout een andere insteek heeft.
function getRandomGroup(groups) {
  const randomInt = Math.floor(Math.random() * groups.length);

  return groups.splice(randomInt, 1)[0];
}

function checkDuplicates(workout, exercise) {
  return workout.find((item) => {
    return item.name.toLowerCase() === exercise.name.toLowerCase();
  });
}

export function createWorkout(data, groups) {
  const groupsCopy = [...groups];
  const workout = [];
  let compoundsCount = 0;

  while (groupsCopy.length > 0) {
    const randomBodyPart = getRandomGroup(groupsCopy);

    let filteredExercises = [];

    if (compoundsCount >= 4) {
      console.warn(
        "max van 4 compounds is bereikt, hij zoekt nu alleen nog isolation",
      );
      filteredExercises = data
        .filter((exercise) => {
          return exercise.bodyPart.toLowerCase() === randomBodyPart;
        })
        .filter((item) => {
          return item.compoundLabel.includes("isolation");
        });
    } else {
      filteredExercises = data.filter((exercise) => {
        return exercise.bodyPart.toLowerCase() === randomBodyPart;
      });
    }

    if (!filteredExercises.length) {
      console.warn("No exercise in: ", randomBodyPart);
      continue;
    }

    // random nr op basis van de lengte van de filteredExercises om een keuze te maken
    const randInt = Math.floor(Math.random() * filteredExercises.length);
    const selectedExercise = filteredExercises[randInt];

    // check for duplicate name
    if (checkDuplicates(workout, selectedExercise)) {
      console.warn("Duplicate exercise found, continue looping");
      continue;
    }

    // check if a bodypart is already in the workout
    const isInWorkout = workout.some((exercise) => {
      return (
        exercise.bodyPart.toLowerCase() ===
        selectedExercise.bodyPart.toLowerCase()
      );
    });

    // zou dit nog kunnen uitbreiden om te checken of elk beweegpatroon wel voorkomt
    // 2. er zou nog een armspier checker kunnen komen om de oververtegenwoordigde uit te sluiten van selectie
    if (isInWorkout) {
      console.log("Bodypart is already in workout");
      continue;
    }

    if (selectedExercise.compoundLabel.includes("compound")) {
      compoundsCount++;
    }
    workout.push(selectedExercise);
  }
  return workout;
}

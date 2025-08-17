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

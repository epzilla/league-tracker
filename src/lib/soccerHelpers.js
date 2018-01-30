export const getStatsForMatch = (match) => {};

export const getGoalDifferential = (gf, ga) => {
  const result = gf - ga;
  if (result > 0) {
    return '+' + result;
  }

  return result;
};
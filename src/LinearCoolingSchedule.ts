import { ICoolingSchedule } from './ICoolingSchedule';

/**
 * Creates a linear cooling function
 * @param coldProbability The probability of accepting a detrimental change at the end of cooling
 * @param hotProbability The probability of accepting a detrimental change at the start of cooling
 * @returns A cooling schedule
 */
export const makeLinearCoolingSchedule = (coldProbability: number, hotProbability: number): ICoolingSchedule => {
  return (progressFraction: number) => {
    return coldProbability + (1 - (progressFraction)) * (hotProbability - coldProbability);
  };
};

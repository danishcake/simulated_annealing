/**
 * Defines a cooling schedule - how the chance of accepting a detrimental change
 * varies
 */
export interface ICoolingSchedule {
  (progressFraction: number): number;
}

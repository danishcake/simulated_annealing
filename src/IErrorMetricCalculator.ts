
/**
 * Represents an error metric calculator
 */
export interface IErrorMetricCalculator<DOMAIN_T> {
  (domain: Readonly<DOMAIN_T>): number;
}

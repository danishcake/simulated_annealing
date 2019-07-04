import * as _ from 'lodash';
import * as random from 'random';
import { ICoolingSchedule } from './ICoolingSchedule';
import { IDomainMutator } from './IDomainMutator';
import { IErrorMetricCalculator } from './IErrorMetricCalculator';

export class AnnealingOptimiser<DOMAIN_T> {
  private mDomainMutator: IDomainMutator<DOMAIN_T>;
  private mErrorMetricCalculator: IErrorMetricCalculator<DOMAIN_T>;
  private mCoolingSchedule: ICoolingSchedule;

  public constructor(domainMutator: IDomainMutator<DOMAIN_T>,
                     errorMetricCalculator: IErrorMetricCalculator<DOMAIN_T>,
                     coolingSchedule: ICoolingSchedule) {
    this.mDomainMutator = domainMutator;
    this.mErrorMetricCalculator = errorMetricCalculator;
    this.mCoolingSchedule = coolingSchedule;
  }

  /**
   * Mutates the domain repeatedly to reduce the calculated error metric
   * If an individual mutation reduces the error metric the mutation is accepted
   * If an individual mutation increases the error metric it is accepted with a probability that
   * decreases towards the end of the processing
   * @param domain The initial domain
   * @param steps The total number of iterations
   * @returns The optimised domain
   */
  public optimise(domain: Readonly<DOMAIN_T>,
                  steps: Readonly<number>): DOMAIN_T {
    // Calculate initial error metric
    let errorMetric: number = this.mErrorMetricCalculator(domain);
    let bestErrorMetric: number = errorMetric;
    let bestDomain: Readonly<DOMAIN_T> = _.cloneDeep(domain);

    // Mutate, accepting improvements unconditionally and detrimental changes with decreasing
    // probability
    for (let step = 0; step < steps; step++) {
      const candidateDomain = this.mDomainMutator(domain);
      const candidateErrorMetric = this.mErrorMetricCalculator(candidateDomain);

      const detrimentalChangeAcceptanceProbability = this.mCoolingSchedule(step / steps);
      if (candidateErrorMetric < errorMetric || random.float(0, 1) < detrimentalChangeAcceptanceProbability) {
        // Improvement, accept change
        // or, detrimental change that we've accepted anyway
        errorMetric = candidateErrorMetric;
        domain = candidateDomain;
      }

      if (errorMetric < bestErrorMetric) {
        bestErrorMetric = errorMetric;
        bestDomain = domain;
      }
    }

    return bestDomain;
  }
}

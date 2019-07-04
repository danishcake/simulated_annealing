
/**
 * Represents a thing that mutates the domain
 */
export interface IDomainMutator<DOMAIN_T> {
  (domain: Readonly<DOMAIN_T>): DOMAIN_T;
}

import { SerialisedPerson } from './Person';
import { Room, SerialisedRoom } from './Room';

/**
 * A trip is defined by:
 * A number of rooms with some capacity
 * A number of people, who reside in those rooms
 */
export interface Trip {
  rooms: Room[];
}

/**
 * Serialised state
 */
export interface SerialisedTrip {
  rooms: SerialisedRoom[];
  people: SerialisedPerson[];
}

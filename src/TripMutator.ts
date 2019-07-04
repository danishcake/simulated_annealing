import * as _ from 'lodash';
import * as random from 'random';
import { IDomainMutator } from './IDomainMutator';
import { Trip } from './Trip';

/**
 * Randomly swaps people
 * TODO: Add additional option to just move a single person if there is spare room
 * in the destination room
 * TODO: We've got a better chance of swapping a person in a small room,
 * so instead pick two random people and swap them, regardless of rooms
 */
export const makeTripMutator = (): IDomainMutator<Trip> => {
  return (trip: Readonly<Trip>): Trip => {
    const mutatedTrip = _.cloneDeep(trip);

    for (let i = 0; i < 3; i++) {
      // Pick two random rooms
      const roomIndex1 = random.int(0, mutatedTrip.rooms.length - 1);
      let roomIndex2 = random.int(0, mutatedTrip.rooms.length - 1);
      while (roomIndex2 === roomIndex1) {
        roomIndex2 = random.int(0, mutatedTrip.rooms.length - 1);
      }

      const personIndex1 = random.int(0, mutatedTrip.rooms[roomIndex1].occupants.length - 1);
      const personIndex2 = random.int(0, mutatedTrip.rooms[roomIndex2].occupants.length - 1);

      const person1 = mutatedTrip.rooms[roomIndex1].occupants[personIndex1];
      const person2 = mutatedTrip.rooms[roomIndex2].occupants[personIndex2];
      mutatedTrip.rooms[roomIndex1].removeOccupant(person1);
      mutatedTrip.rooms[roomIndex2].removeOccupant(person2);
      mutatedTrip.rooms[roomIndex1].addOccupant(person2);
      mutatedTrip.rooms[roomIndex2].addOccupant(person1);
    }

    return mutatedTrip;
  };
};

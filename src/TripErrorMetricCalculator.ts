import * as _ from 'lodash';
import { IErrorMetricCalculator } from './IErrorMetricCalculator';
import { Trip } from './Trip';

/**
 * Creates an error metric calculator function
 * This calculates the error as the square of the number of friends not allocated to
 * the same room, plus extra if no friends are allocated
 */
export const makeTripErrorMetricCalculator = (): IErrorMetricCalculator<Trip> => {
  return (trip: Readonly<Trip>): number => {
    let errorSum: number = 0;

    for (const room of trip.rooms) {
      const roomOccupantIds = room.occupants.map((person) => person.id);

      for (const person of room.occupants) {
        let missingFriendCount = 0;

        for (const friend of person.friends) {
          if (!_.includes(roomOccupantIds, friend.id)) {
            missingFriendCount += 2;
          }
        }

        // Extra sad case: No friends in room. Increase sadness score
        if (missingFriendCount === person.friends.length) {
          missingFriendCount++;
        }

        errorSum += missingFriendCount * missingFriendCount;
      }
    }
    return errorSum;
  };
};

import { AnnealingOptimiser } from './AnnealingOptimiser';
import { ICoolingSchedule } from './ICoolingSchedule';
import { IDomainMutator } from './IDomainMutator';
import { IErrorMetricCalculator } from './IErrorMetricCalculator';
import { makeLinearCoolingSchedule } from './LinearCoolingSchedule';
import { makeTripErrorMetricCalculator } from './TripErrorMetricCalculator';
import { makeTripMutator } from './TripMutator';

import { Person } from './Person';
import { Room } from './Room';
import { allocateFriends, allocateRooms, createPeople, deserialiseTrip, serialiseTrip } from './setup';
import { Trip } from './Trip';

// To setup a new problem
// const people: Person[] = createPeople();
// allocateFriends(people);
//
// const rooms = [
//   new Room('A', 4),
//   new Room('B', 6),
//   new Room('C', 6),
//   new Room('D', 8),
//   new Room('E', 8),
// ];
//
// const trip: Trip = allocateRooms(people, rooms);
//
// const serialisedTrip = JSON.stringify(serialiseTrip(trip));
// console.log(serialisedTrip);

// We're going to develop against a static problem
// tslint:disable-next-line:max-line-length
const serialisedTrip = '{"people":[{"friends":[15,7,23,14],"id":0,"name":"0"},{"friends":[7,14,21,22],"id":1,"name":"1"},{"friends":[13,25,18,9,26],"id":2,"name":"3"},{"friends":[12,8,10,5],"id":3,"name":"4"},{"friends":[7,19,10,12,18],"id":4,"name":"5"},{"friends":[3,26,11],"id":5,"name":"6"},{"friends":[10,12,7],"id":6,"name":"7"},{"friends":[6,23,20,10,21],"id":7,"name":"8"},{"friends":[3,16,24,5],"id":8,"name":"9"},{"friends":[15,2,24,25],"id":9,"name":"10"},{"friends":[3,4,6,7,1,25],"id":10,"name":"11"},{"friends":[10,11],"id":11,"name":"13"},{"friends":[17,18,4],"id":12,"name":"14"},{"friends":[26,16,4],"id":13,"name":"15"},{"friends":[8,11,0],"id":14,"name":"16"},{"friends":[9,13,22,19,18],"id":15,"name":"17"},{"friends":[13,10,20,22,23],"id":16,"name":"18"},{"friends":[12,4,23,19],"id":17,"name":"19"},{"friends":[15,4,1],"id":18,"name":"20"},{"friends":[15,17,24,20,21],"id":19,"name":"21"},{"friends":[7,11,16,19,24,6],"id":20,"name":"23"},{"friends":[19,18,7],"id":21,"name":"24"},{"friends":[16,11,26,1],"id":22,"name":"25"},{"friends":[17,1,0,16],"id":23,"name":"26"},{"friends":[8,9,20,0,7],"id":24,"name":"27"},{"friends":[21,9,10],"id":25,"name":"28"},{"friends":[13,24,2,12],"id":26,"name":"29"}],"rooms":[{"capacity":4,"name":"A","occupants":[0,1,2,3]},{"capacity":6,"name":"B","occupants":[4,5,6,7,8,9]},{"capacity":6,"name":"C","occupants":[10,11,12,13,14,15]},{"capacity":8,"name":"D","occupants":[16,17,18,19,20,21,22,23]},{"capacity":8,"name":"E","occupants":[24,25,26]}]}';
const trip = deserialiseTrip(JSON.parse(serialisedTrip));

const mutator: IDomainMutator<Trip> = makeTripMutator();
const errorMetricCalculator: IErrorMetricCalculator<Trip> = makeTripErrorMetricCalculator();
const coolingSchedule: ICoolingSchedule = makeLinearCoolingSchedule(0.05, 0.5);
const optimiser = new AnnealingOptimiser(mutator, errorMetricCalculator, coolingSchedule);

console.log(`Initial error: ${errorMetricCalculator(trip)}`);

let optimisedTrip = trip;
const outerIterations = 10;
const innerIterations = 100000;
for (let i = 0; i < outerIterations; i++ ) {
  optimisedTrip = optimiser.optimise(optimisedTrip, innerIterations);
  console.log(`${Math.floor(i * 100 / outerIterations)}% Error metric: ${errorMetricCalculator(optimisedTrip)}`);
}
console.log(`Optimised error: ${errorMetricCalculator(optimisedTrip)}`);

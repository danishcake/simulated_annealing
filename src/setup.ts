import * as _ from 'lodash';
import * as random from 'random';
import { Person, SerialisedPerson } from './Person';
import { Room, SerialisedRoom } from './Room';
import { SerialisedTrip, Trip } from './Trip';

/**
 * Creates 30 people
 */
export const createPeople = (): Person[] => {
  const people = [];
  for (let i = 0; i < 30; i++) {
    people.push(new Person(`${i}`));
  }

  return people;
};

/**
 * Define friendships
 * Each person sets three friends. If they set a friend, that friend has a 50% chance of
 * picking them back as an additional friend
 *
 * This probably isn't representative of real friendship groups, which will likely be
 * somewhat more clustered
 * @param people The people of create friendship groups within
 */
export const allocateFriends = (people: Person[]): Person[] => {
  for (const person of people) {
    for (let i = 0; i < 3; i++) {
      const friendIndex = random.int(0, people.length - 1);
      const friend = people[friendIndex];
      person.addFriend(friend);
      if (random.boolean()) {
        friend.addFriend(person);
      }
    }
  }

  return people;
};

/**
 * Randomly allocates people to rooms
 * @param people People to allocate
 * @param rooms Collection of rooms to allocate to
 * @return An initial trip state
 */
export const allocateRooms = (people: Person[], rooms: Room[]): Trip => {
  // Allocate as simply as possible
  let roomIndex = 0;
  for (const person of people) {
    // Room full, start next room
    if (rooms[roomIndex].occupants.length === rooms[roomIndex].capacity) {
      roomIndex++;
    }

    // All rooms full
    if (roomIndex >= rooms.length) {
      throw new Error('All rooms full, too many people');
    }

    rooms[roomIndex].addOccupant(person);
  }

  return { rooms };
};

/**
 * Serialises a trip so it can be repeatedly processed
 * @param trip Trip to serialise
 */
export const serialiseTrip = (trip: Trip): SerialisedTrip => {
  const people = _.flatten(trip.rooms.map((room) => room.occupants));
  const serialisedPeople: SerialisedPerson[] = serialisePeople(people);
  const serialisedRooms: SerialisedRoom[] = trip.rooms.map((room) => room.serialise());

  return {
    people: serialisedPeople,
    rooms: serialisedRooms
  };
};

/**
 * Deserialises a trip
 * @param serialisedTrip Previously serialised trip
 */
export const deserialiseTrip = (serialisedTrip: SerialisedTrip): Trip => {
  const people = deserialisePeople(serialisedTrip.people);
  const rooms = serialisedTrip.rooms.map((room) => deserialiseRoom(room, people));

  return {
    rooms
  };
};

/**
 * Deserialises a room. Serialised rooms store their occupants via ID. This
 * method performs the lookup and returns rooms with the actual reference Person
 */
const deserialiseRoom = (serialisedRoom: SerialisedRoom, people: Person[]): Room => {
  const room = new Room(serialisedRoom.name, serialisedRoom.capacity);

  for (const personId of serialisedRoom.occupants) {
    // Find person
    const person = people.find((p) => p.id === personId);
    if (person == null) {
      throw new Error(`Could not find person ${personId}`);
    }

    room.addOccupant(person);
  }

  return room;
};

/**
 * Serialises an array of people
 * @param people People to serialise
 */
const serialisePeople = (people: Readonly<Person>[]): SerialisedPerson[] => {
  return people.map((person) => person.serialise());
};

/**
 * Deserialises previously serialised people
 * @param serialisedPeople People to deserialise
 *
 * People are serialised with their friends referenced via ID. This method
 * replaces the references with the underlying referenced friend
 */
const deserialisePeople = (serialisedPeople: SerialisedPerson[]): Person[] => {
  const people: Person[] = [];

  // Create the people
  for (const person of serialisedPeople) {
    people.push(new Person(person.name, person.id));
  }

  // Add their friends
  for (const person of serialisedPeople) {
    const deserialisedPerson = people.find((p) => p.id === person.id);
    if (deserialisedPerson != null) {
      for (const friendId of person.friends) {
        const deserialisedFriend = people.find((p) => p.id === friendId);

        if (deserialisedFriend != null) {
          deserialisedPerson.addFriend(deserialisedFriend);
        }
      }
    }
  }

  return people;
};

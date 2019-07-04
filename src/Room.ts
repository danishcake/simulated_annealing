import { Person } from './Person';

/**
 * A room, defined by its name, maximum number of occupants,
 * and the occupants
 */
export class Room {
  private readonly mName: string;
  private readonly mCapacity: number;
  private mOccupants: Readonly<Person>[];

  public constructor(name: string, capacity: number) {
    this.mName = name;
    this.mCapacity = capacity;
    this.mOccupants = [];
  }

  public addOccupant(person: Readonly<Person>): void {
    if (this.mOccupants.find((p) => p.id === person.id)) {
      throw new Error('Logic error: Occupant already present');
    }

    if (this.mOccupants.length >= this.mCapacity) {
      throw new Error('Logic error: Room already full');
    }

    this.mOccupants.push(person);
  }

  public removeOccupant(person: Readonly<Person>): void {
    if (this.mOccupants.find((p) => p.id === person.id) == null) {
      throw new Error('Logic error: Occupant not present');
    }

    this.mOccupants = this.mOccupants.filter((p) => p.id !== person.id);
  }

  public serialise(): SerialisedRoom {
    return {
      capacity: this.mCapacity,
      name: this.mName,
      occupants: this.mOccupants.map((p) => p.id)
    };
  }

  public get name(): string {
    return this.mName;
  }

  public get capacity(): number {
    return this.mCapacity;
  }

  public get occupants(): ReadonlyArray<Readonly<Person>> {
    return this.mOccupants;
  }
}

export interface SerialisedRoom {
  name: string;
  capacity: number;
  occupants: number[];
}

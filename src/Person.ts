/**
 * A person. Defined by their name, a unique auto-allocated ID
 * and their friends
 */
export class Person {
  private static sInstanceCount: number = 0;

  private readonly mId: number;
  private readonly mName: string;
  private readonly mFriends: Person[];

  public constructor(name: string, id?: number) {
    this.mId = id !== undefined ? id : Person.sInstanceCount++;
    this.mName = name;
    this.mFriends = [];
  }

  public addFriend(friend: Person): void {
    if (this.mFriends.some((p) => p.mId === friend.mId) ||
        this.mFriends.some((p) => p.mId === this.mId)) {
      // Already have this friend, or fiend is self
      return;
    }

    this.mFriends.push(friend);
  }

  public serialise(): SerialisedPerson {
    return {
      friends: this.mFriends.map((p) => p.id),
      id: this.mId,
      name: this.mName
    };
  }

  public get id(): number {
    return this.mId;
  }

  public get friends(): Person[] {
    return this.mFriends;
  }
}

export interface SerialisedPerson {
  friends: number[];
  id: number;
  name: string;
}

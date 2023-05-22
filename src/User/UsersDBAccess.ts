import * as Nedb from 'nedb';
import { IUser } from '../Shared/Model';

export class UsersDBAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/Users.db');
    this.nedb.loadDatabase();
  }

  public async putUser(user: IUser): Promise<void> {
    if (!user.id) {
      user.id = this.generateUserId();
    }
    return new Promise((resolve, reject) => {
      this.nedb.insert(user, (err: Error | any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async getUserById(userId: string): Promise<IUser | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find({ id: userId }, (err: Error, docs: any[]) => {
        if (err) {
          reject(err);
        } else {
          if (docs.length === 0) {
            resolve(undefined);
          } else {
            resolve(docs[0]);
          }
        }
      });
    });
  }

  private generateUserId() {
    return Math.random().toString(36).slice(2);
  }
}

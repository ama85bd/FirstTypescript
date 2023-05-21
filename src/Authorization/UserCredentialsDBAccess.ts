import { IUserCredentials } from '../Shared/Model';
import * as Nedb from 'nedb';

export class UserCredentialsDBAccess {
  private nedb: Nedb;

  constructor() {
    this.nedb = new Nedb('database/UserCredentials.db');
    this.nedb.loadDatabase();
  }

  public async putUserCredential(
    userCredentials: IUserCredentials
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.nedb.insert(userCredentials, (err: Error | null, docs: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  public async getUserCredential(
    username: string,
    password: string
  ): Promise<IUserCredentials | undefined> {
    return new Promise((resolve, reject) => {
      this.nedb.find(
        { username: username, password: password },
        (err: Error, docs: IUserCredentials[]) => {
          if (err) {
            reject(err);
          } else {
            if (docs.length === 0) {
              resolve(undefined);
            } else {
              resolve(docs[0]);
            }
          }
        }
      );
    });
  }
}

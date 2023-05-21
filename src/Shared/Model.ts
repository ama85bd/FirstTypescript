import { IAccount } from '../Server/Model';

export enum AccessRight {
  CREATE,
  READ,
  UPDATE,
  DALETE,
}

export interface IUserCredentials extends IAccount {
  accessRights: AccessRight[];
}

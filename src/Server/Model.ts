import { AccessRight } from '../Shared/Model';

export interface IAccount {
  username: string;
  password: string;
}

export interface ISessionToken {
  tokenId: string;
  username: string;
  valid: boolean;
  expirationTime: Date;
  accessRight: AccessRight[];
}

export enum TokenState {
  VALID,
  INVALID,
  EXPIRED,
}

export interface ITokenState {
  accessRight: AccessRight[];
  state: TokenState;
}

export interface ITokenGenerator {
  generateToken(account: IAccount): Promise<ISessionToken | undefined>;
}

export interface ITokenValidator {
  validateToken(tokenId: string): Promise<ITokenState>;
}

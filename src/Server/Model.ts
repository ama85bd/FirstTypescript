export interface IAccount {
  username: string;
  password: string;
}

export interface IHandler {
  handleRequest(): void;
}

export interface ISessionToken {
  tokenId: string;
}

export interface ITokenGenerator {
  generateToken(account: IAccount): Promise<ISessionToken | undefined>;
}

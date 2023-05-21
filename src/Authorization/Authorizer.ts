import { IAccount, ISessionToken, ITokenGenerator } from '../Server/Model';

export class Authorizer implements ITokenGenerator {
  async generateToken(account: IAccount): Promise<ISessionToken | undefined> {
    if (account.username === 'asif' && account.password === '1234') {
      return {
        tokenId: 'someTokenId',
      };
    } else {
      return undefined;
    }
  }
}

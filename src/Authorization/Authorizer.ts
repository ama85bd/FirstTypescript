import { IAccount, ISessionToken, ITokenGenerator } from '../Server/Model';
import { UserCredentialsDBAccess } from './UserCredentialsDBAccess';

export class Authorizer implements ITokenGenerator {
  private userCredDBAccess: UserCredentialsDBAccess =
    new UserCredentialsDBAccess();

  async generateToken(account: IAccount): Promise<ISessionToken | undefined> {
    const resultAccount = await this.userCredDBAccess.getUserCredential(
      account.username,
      account.password
    );

    if (resultAccount) {
      return {
        tokenId: 'someTokenId',
      };
    } else {
      return undefined;
    }
  }
}

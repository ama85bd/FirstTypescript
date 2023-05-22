import {
  IAccount,
  ISessionToken,
  ITokenGenerator,
  ITokenState,
  ITokenValidator,
  TokenState,
} from '../Server/Model';
import { SessionTokenDBAccess } from './SessionTokenDBAccess';
import { UserCredentialsDBAccess } from './UserCredentialsDBAccess';

export class Authorizer implements ITokenGenerator, ITokenValidator {
  private userCredDBAccess: UserCredentialsDBAccess =
    new UserCredentialsDBAccess();
  private sessionTokenDBAccess: SessionTokenDBAccess =
    new SessionTokenDBAccess();

  async generateToken(account: IAccount): Promise<ISessionToken | undefined> {
    const resultAccount = await this.userCredDBAccess.getUserCredential(
      account.username,
      account.password
    );

    if (resultAccount) {
      const token: ISessionToken = {
        accessRight: resultAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        username: resultAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId(),
      };

      await this.sessionTokenDBAccess.storeSessionToken(token);
      return token;
    } else {
      return undefined;
    }
  }

  public async validateToken(tokenId: string): Promise<ITokenState> {
    const token = await this.sessionTokenDBAccess.getToken(tokenId);

    if (!token || !token.valid) {
      return {
        accessRight: [],
        state: TokenState.INVALID,
      };
    } else if (token.expirationTime < new Date()) {
      return {
        accessRight: [],
        state: TokenState.EXPIRED,
      };
    }
    return {
      accessRight: token.accessRight,
      state: TokenState.VALID,
    };
  }

  private generateExpirationTime() {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2);
  }
}

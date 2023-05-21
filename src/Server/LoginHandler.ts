import { error } from 'console';
import { IncomingMessage, ServerResponse } from 'http';
import { IAccount, IHandler, ITokenGenerator } from './Model';

export class LoginHandler implements IHandler {
  private req: IncomingMessage;
  private res: ServerResponse;
  private tokenGenerator: ITokenGenerator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenGenerator: ITokenGenerator
  ) {
    this.req = req;
    this.res = res;
    this.tokenGenerator = tokenGenerator;
  }

  public async handleRequest(): Promise<void> {
    try {
      const body = await this.getRequestBody();
      const sessionToken = await this.tokenGenerator.generateToken(body);
      if (sessionToken) {
        this.res.write('valid credentials');
      } else {
        this.res.write('wrong credentials');
      }
    } catch (error: any) {
      this.res.write('error: ' + error.message);
    }
  }

  private async getRequestBody(): Promise<IAccount> {
    return new Promise((resolve, reject) => {
      let body = '';
      this.req.on('data', (data: string) => {
        body += data;
      });

      this.req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });

      this.req.on('error', (error: any) => {
        reject(error);
      });
    });
  }
}

import { IncomingMessage, ServerResponse } from 'http';
import { UsersDBAccess } from '../User/UsersDBAccess';
import { AccessRight, HTTP_CODES, HTTP_METHODS, IUser } from '../Shared/Model';
import { Utils } from './Utils';
import { BaseRequestHandler } from './BaseRequestHandler';
import { ITokenValidator } from './Model';

export class UsersHandler extends BaseRequestHandler {
  private userDBAccess = new UsersDBAccess();
  private tokenValidator: ITokenValidator;

  public constructor(
    req: IncomingMessage,
    res: ServerResponse,
    tokenValidator: ITokenValidator
  ) {
    super(req, res);
    this.tokenValidator = tokenValidator;
  }
  async handleRequest(): Promise<void> {
    switch (this.req.method) {
      case HTTP_METHODS.GET:
        await this.handleGet();
        break;
      case HTTP_METHODS.PUT:
        await this.handlePut();
        break;

      default:
        this.handleNotFound();
        break;
    }
  }

  private async handlePut() {
    const operationAuthorized = await this.operationAuthorized(
      AccessRight.CREATE
    );
    if (operationAuthorized) {
      try {
        const user: IUser = await this.getRequestBody();
        await this.userDBAccess.putUser(user);
        this.respondText(HTTP_CODES.CREATED, `user ${user.name} created`);
      } catch (error: any) {
        this.respondBadRequest(error.message);
      }
    } else {
      this.respondUnauthorized('missing or invalid authentication');
    }
  }

  private async handleGet() {
    const operationAuthorized = await this.operationAuthorized(
      AccessRight.READ
    );
    if (operationAuthorized) {
      const parsedUrl = Utils.getUrlParameters(this.req.url);
      if (parsedUrl) {
        const userId = parsedUrl.query.id;
        if (userId) {
          const user = await this.userDBAccess.getUserById(userId as string);
          if (user) {
            this.respondJsonObject(HTTP_CODES.OK, user);
          } else {
            this.handleNotFound();
          }
        } else {
          this.respondBadRequest('User not present!');
        }
      }
    } else {
      this.respondUnauthorized('Missing or invalid authentication!');
    }
  }

  private async operationAuthorized(operation: AccessRight): Promise<boolean> {
    const tokenId = this.req.headers.authorization;
    if (tokenId) {
      const tokenRight = await this.tokenValidator.validateToken(tokenId);

      if (tokenRight.accessRight.includes(operation)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

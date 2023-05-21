import { UserCredentialsDBAccess } from '../src/Authorization/UserCredentialsDBAccess';

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
}

new DbTest().dbAccess.putUserCredential({
  username: 'user1',
  password: 'pass1',
  accessRights: [1, 2, 3],
});

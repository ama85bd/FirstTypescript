import { UserCredentialsDBAccess } from '../src/Authorization/UserCredentialsDBAccess';
import { UsersDBAccess } from '../src/User/UsersDBAccess';

class DbTest {
  public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  public userDBAccess: UsersDBAccess = new UsersDBAccess();
}

// new DbTest().userDBAccess.putUser({
//   age: 35,
//   email: 'user1@test.com',
//   id: '123user1',
//   name: 'user1',
//   workingPosition: 3,
// });

new DbTest().dbAccess.putUserCredential({
  username: 'user1',
  password: 'pass1',
  accessRights: [0, 1, 2, 3],
});

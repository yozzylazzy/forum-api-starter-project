# PROYEK DUA DICODING EXPERT BACKEND BY YOSEF ADRIAN
# Installation Dependencies

- npm install @hapi/hapi @hapi/jwt bcrypt dotenv nanoid@3.x.x pg
- npm install @types/jest eslint jest node-pg-migrate nodemon --save-dev
- Eslint Configuration: npm init @eslint/config

# List Kebutuhan Forum API

- Registrasi Pengguna (SUDAH ADA)
- Login dan Logout (SUDAH ADA)
- Menambahkan Thread (SUDAH DIBUAT)
- Melihat Thread (SUDAH DIBUAT)
- Menambahkan dan Menghapus Komentar pada Thread (SUDAH DIBUAT)
- Menambahkan dan Menghapus Balasan Komentar Thread (opsional) (SUDAH DIBUAT).
- Test Driven Development applied and Clean Architecture (entities, use_case, interface, repository and http server/frameworks)

Starter Project Forum API sudah mencakup fitur:

- Registrasi Pengguna;
- Login;
- Refresh Access Token; dan
- Logout

# To Run Test Case for Unit and Integration Testing :

- npm run test:watch

# Run for localhost to test on Postman as dev :

- npm run start:dev

--------------------------------------|---------|----------|---------|---------|-------------------                                                                                 
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                                  
--------------------------------------|---------|----------|---------|---------|-------------------
All files                             |     100 |      100 |     100 |     100 | 
 Applications/security                |     100 |      100 |     100 |     100 | 
  AuthenticationTokenManager.js       |     100 |      100 |     100 |     100 | 
  PasswordHash.js                     |     100 |      100 |     100 |     100 | 
 Applications/use_case                |     100 |      100 |     100 |     100 | 
  AddCancelLikeUseCase.js             |     100 |      100 |     100 |     100 | 
  AddCommentUseCase.js                |     100 |      100 |     100 |     100 |                   
  AddReplyUseCase.js                  |     100 |      100 |     100 |     100 | 
  AddThreadUseCase.js                 |     100 |      100 |     100 |     100 | 
  AddUserUseCase.js                   |     100 |      100 |     100 |     100 | 
  DeleteAuthenticationUseCase.js      |     100 |      100 |     100 |     100 | 
  DeleteCommentUseCase.js             |     100 |      100 |     100 |     100 | 
  DeleteReplyUseCase.js               |     100 |      100 |     100 |     100 | 
  LoginUserUseCase.js                 |     100 |      100 |     100 |     100 | 
  LogoutUserUseCase.js                |     100 |      100 |     100 |     100 | 
  RefreshAuthenticationUseCase.js     |     100 |      100 |     100 |     100 | 
  ShowThreadUseCase.js                |     100 |      100 |     100 |     100 | 
 Commons/exceptions                   |     100 |      100 |     100 |     100 | 
  AuthenticationError.js              |     100 |      100 |     100 |     100 | 
  AuthorizationError.js               |     100 |      100 |     100 |     100 | 
  ClientError.js                      |     100 |      100 |     100 |     100 | 
  DomainErrorTranslator.js            |     100 |      100 |     100 |     100 | 
  InvariantError.js                   |     100 |      100 |     100 |     100 | 
  NotFoundError.js                    |     100 |      100 |     100 |     100 | 
 Domains/authentications              |     100 |      100 |     100 |     100 | 
  AuthenticationRepository.js         |     100 |      100 |     100 |     100 | 
 Domains/authentications/entities     |     100 |      100 |     100 |     100 | 
  NewAuth.js                          |     100 |      100 |     100 |     100 | 
 Domains/comments                     |     100 |      100 |     100 |     100 | 
  CommentRepository.js                |     100 |      100 |     100 |     100 | 
 Domains/comments/entities            |     100 |      100 |     100 |     100 | 
  CreateComment.js                    |     100 |      100 |     100 |     100 | 
  CreatedComment.js                   |     100 |      100 |     100 |     100 | 
 Domains/likes                        |     100 |      100 |     100 |     100 | 
  LikeRepository.js                   |     100 |      100 |     100 |     100 | 
 Domains/likes/entities               |     100 |      100 |     100 |     100 | 
  CreateLike.js                       |     100 |      100 |     100 |     100 | 
  CreatedLike.js                      |     100 |      100 |     100 |     100 | 
 Domains/replies                      |     100 |      100 |     100 |     100 | 
  ReplyRepository.js                  |     100 |      100 |     100 |     100 | 
 Domains/replies/entities             |     100 |      100 |     100 |     100 | 
  CreateReply.js                      |     100 |      100 |     100 |     100 | 
  CreatedReply.js                     |     100 |      100 |     100 |     100 | 
 Domains/threads                      |     100 |      100 |     100 |     100 | 
  ThreadRepository.js                 |     100 |      100 |     100 |     100 | 
 Domains/threads/entities             |     100 |      100 |     100 |     100 | 
  CreateThread.js                     |     100 |      100 |     100 |     100 | 
  CreatedThread.js                    |     100 |      100 |     100 |     100 | 
 Domains/users                        |     100 |      100 |     100 |     100 | 
  UserRepository.js                   |     100 |      100 |     100 |     100 | 
 Domains/users/entities               |     100 |      100 |     100 |     100 | 
  RegisterUser.js                     |     100 |      100 |     100 |     100 | 
  RegisteredUser.js                   |     100 |      100 |     100 |     100 | 
  UserLogin.js                        |     100 |      100 |     100 |     100 | 
 Infrastructures/http                 |     100 |      100 |     100 |     100 | 
  createServer.js                     |     100 |      100 |     100 |     100 | 
 Infrastructures/repository           |     100 |      100 |     100 |     100 | 
  AuthenticationRepositoryPostgres.js |     100 |      100 |     100 |     100 | 
  CommentRepositoryPostgres.js        |     100 |      100 |     100 |     100 | 
  LikeRepositoryPostgres.js           |     100 |      100 |     100 |     100 | 
  ReplyRepositoryPostgres.js          |     100 |      100 |     100 |     100 | 
  ThreadRepositoryPostgres.js         |     100 |      100 |     100 |     100 | 
  UserRepositoryPostgres.js           |     100 |      100 |     100 |     100 | 
 Infrastructures/security             |     100 |      100 |     100 |     100 | 
  BcryptPasswordHash.js               |     100 |      100 |     100 |     100 | 
  routes.js                           |     100 |      100 |     100 |     100 | 
 Interfaces/http/api/users            |     100 |      100 |     100 |     100 | 
  handler.js                          |     100 |      100 |     100 |     100 | 
  index.js                            |     100 |      100 |     100 |     100 | 
  routes.js                           |     100 |      100 |     100 |     100 | 
--------------------------------------|---------|----------|---------|---------|-------------------

## KRITERIA WAJIB :

- Continous Integration -> OK!!! (Github Action, Amazon RDS for PostgreSQL)
- Continous Delivery/Deployment -> OK!!! (Github Action, Amazon EC2 and Amazon RDS)
- Limiter for /threads ... -> OK!!! (NGINX, limit to 90r/min just for /threads and inside of it)
- HTTPS Certirficate -> OK!!! (Certbort NGINX, using xyz domain)

## OPSIONAL KRITERIA STEP :

- npm run migra
te create "create table likes"
- Create domain level
- Create Application Level
- Create Infrastructure Level (Repository > CreateServer > Container)
- Create Interfaces
- Create Domains for new Exceptions
- Test Case Likes Features Finished All 100%

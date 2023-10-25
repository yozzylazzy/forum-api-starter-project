# PROYEK SATU DICODING EXPERT BACKEND BY YOSEF ADRIAN
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

File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |     100 |      100 |     100 |     100 |                   
 ...ions/security |     100 |      100 |     100 |     100 |                   
  ...enManager.js |     100 |      100 |     100 |     100 |                   
  PasswordHash.js |     100 |      100 |     100 |     100 |                   
 ...ions/use_case |     100 |      100 |     100 |     100 |                   
  ...ntUseCase.js |     100 |      100 |     100 |     100 |                   
  ...lyUseCase.js |     100 |      100 |     100 |     100 |                   
  ...adUseCase.js |     100 |      100 |     100 |     100 |                   
  ...erUseCase.js |     100 |      100 |     100 |     100 |                   
  ...onUseCase.js |     100 |      100 |     100 |     100 |                   
  ...ntUseCase.js |     100 |      100 |     100 |     100 |                   
  ...lyUseCase.js |     100 |      100 |     100 |     100 |                   
  ...erUseCase.js |     100 |      100 |     100 |     100 |                   
  ...erUseCase.js |     100 |      100 |     100 |     100 |                   
  ...onUseCase.js |     100 |      100 |     100 |     100 |                   
  ...adUseCase.js |     100 |      100 |     100 |     100 |                   
 ...ns/exceptions |     100 |      100 |     100 |     100 |                   
  ...tionError.js |     100 |      100 |     100 |     100 |                   
  ...tionError.js |     100 |      100 |     100 |     100 |                   
  ClientError.js  |     100 |      100 |     100 |     100 |                   
  ...ranslator.js |     100 |      100 |     100 |     100 |                   
  ...iantError.js |     100 |      100 |     100 |     100 |                   
  ...oundError.js |     100 |      100 |     100 |     100 |                   
 ...thentications |     100 |      100 |     100 |     100 |                   
  ...epository.js |     100 |      100 |     100 |     100 |                   
 ...ions/entities |     100 |      100 |     100 |     100 |                   
  NewAuth.js      |     100 |      100 |     100 |     100 |                   
 Domains/comments |     100 |      100 |     100 |     100 |                   
  ...epository.js |     100 |      100 |     100 |     100 |                   
 ...ents/entities |     100 |      100 |     100 |     100 |                   
  ...teComment.js |     100 |      100 |     100 |     100 |                   
  ...edComment.js |     100 |      100 |     100 |     100 |                   
 Domains/replies  |     100 |      100 |     100 |     100 |                   
  ...epository.js |     100 |      100 |     100 |     100 |                   
 ...lies/entities |     100 |      100 |     100 |     100 |                   
  CreateReply.js  |     100 |      100 |     100 |     100 |                   
  CreatedReply.js |     100 |      100 |     100 |     100 |                   
 Domains/threads  |     100 |      100 |     100 |     100 |                   
  ...epository.js |     100 |      100 |     100 |     100 |                   
 ...eads/entities |     100 |      100 |     100 |     100 |                   
  CreateThread.js |     100 |      100 |     100 |     100 |                   
  ...tedThread.js |     100 |      100 |     100 |     100 |                   
 Domains/users    |     100 |      100 |     100 |     100 |                   
  ...epository.js |     100 |      100 |     100 |     100 |                   
 ...sers/entities |     100 |      100 |     100 |     100 |                   
  RegisterUser.js |     100 |      100 |     100 |     100 |                   
  ...teredUser.js |     100 |      100 |     100 |     100 |                   
  UserLogin.js    |     100 |      100 |     100 |     100 |                   
 ...ructures/http |     100 |      100 |     100 |     100 |                   
  createServer.js |     100 |      100 |     100 |     100 |                   
 ...es/repository |     100 |      100 |     100 |     100 |                   
  ...yPostgres.js |     100 |      100 |     100 |     100 |                   
  ...yPostgres.js |     100 |      100 |     100 |     100 |                   
  ...yPostgres.js |     100 |      100 |     100 |     100 |                   
  ...yPostgres.js |     100 |      100 |     100 |     100 |                   
  ...yPostgres.js |     100 |      100 |     100 |     100 |                   
 ...ures/security |     100 |      100 |     100 |     100 |                   
  ...swordHash.js |     100 |      100 |     100 |     100 |                   
  ...enManager.js |     100 |      100 |     100 |     100 |                   
 ...thentications |     100 |      100 |     100 |     100 |                   
  handler.js      |     100 |      100 |     100 |     100 |                   
  index.js        |     100 |      100 |     100 |     100 |                   
  routes.js       |     100 |      100 |     100 |     100 |                   
 .../api/comments |     100 |      100 |     100 |     100 |                   
  handler.js      |     100 |      100 |     100 |     100 |                   
  index.js        |     100 |      100 |     100 |     100 |                   
  routes.js       |     100 |      100 |     100 |     100 |                   
 ...p/api/replies |     100 |      100 |     100 |     100 |                   
  handler.js      |     100 |      100 |     100 |     100 |                   
  index.js        |     100 |      100 |     100 |     100 |                   
  routes.js       |     100 |      100 |     100 |     100 |                   
 ...p/api/threads |     100 |      100 |     100 |     100 |                   
  handler.js      |     100 |      100 |     100 |     100 |                   
  index.js        |     100 |      100 |     100 |     100 |                   
  routes.js       |     100 |      100 |     100 |     100 |                   
 ...ttp/api/users |     100 |      100 |     100 |     100 |                   
  handler.js      |     100 |      100 |     100 |     100 |                   
  index.js        |     100 |      100 |     100 |     100 |                   
  routes.js       |     100 |      100 |     100 |     100 |    
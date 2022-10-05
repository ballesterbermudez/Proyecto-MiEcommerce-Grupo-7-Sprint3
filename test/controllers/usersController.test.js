const request = require("supertest");
const db = require("../../api/database/models");
const generateJWT = require("../../helpers/generateToken");
const { app, server } = require("../../server");
const persistance = require("../../api/persistence/persistence");

afterEach(() => {
  server.close();
});
afterAll(async () => {
  await db.sequelize.close();
});

//USADO PARA CREAR TOKEN
const payload = {
  id: 1,
  username: "diegogod",
  role: "GOD",
};

//LISTAR TODOS LOS USUARIOS
describe("GET /users", () => {
  test("Debe retornar un statusCode 200", async () => {
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test.skip("Debe retornar un statusCode 500", async () => {
    const token = await generateJWT(payload);
    await db.sequelize.close();
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un array con usuarios", async () => {
    const token = await generateJWT(payload);
    const { body } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: expect.any(String) }),
      ])
    );
  });
});

//LISTAR USUARIO POR ID
describe("GET /users/:id", () => {
  test("Debe retornar un statusCode 200", async () => {
    const userId = "1";
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 401", async () => {
    const userId = "999";
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(401);
  });

  test.skip("Debe retornar un statusCode 500", async () => {
    const userId = "1";
    const token = await generateJWT(payload);
    await db.sequelize.close();
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un objeto usuario", async () => {
    const userId = "1";
    const token = await generateJWT(payload);
    const { body } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(body.user).toEqual(
      expect.objectContaining({ email: expect.any(String) })
    );
  });
});

//CREAR USUARIO
describe("POST /users", () => {
  test.skip("Debe retornar un statusCode 200", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 412 por error en ROL", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 999,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(412);
  });

  test("Debe retornar un statusCode 412 por error en atributos", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 2,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(412);
  });

  //VALIDATE ENEMAIL
  test("Debe retornar un statusCode 401 validate email unique", async () => {
    const newUser = {
      email: "diego@god.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate email no debe ser vacio", async () => {
    const newUser = {
      email: "",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate email formato incorrecto", async () => {
    const newUser = {
      email: "supertest",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  //VALIDATES DE USERNAME
  test("Debe retornar un statusCode 401 validate username unique", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: 'diegogod',
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate username no es String", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: 123,
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate username sin letra", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "123",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate username menor de 4", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "abc",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate username mayor de 50", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "1234567890-1234567890-1234567890-1234567890-1234567890",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  //VALIDATES DE PASSWORD
  test("Debe retornar un statusCode 401 validate password no es String", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: 123456,
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate password menor a 6", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate password mayor a 50", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "1234567890-1234567890-1234567890-1234567890-1234567890",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  //VALIDATES DE FIRST NAME
  test("Debe retornar un statusCode 401 validate firstname no es String", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: 31,
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate firstname sin numeros", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "3l",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate firstname no debe ser vacio", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate firstname menor a 2", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "O",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate firstname mayor a 50", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "Abcdefghij-abcdefghij-abcdefghij-abcdefghij-abcdefghij",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  //VALIDATES DE LAST NAME
  test("Debe retornar un statusCode 401 validate lastname no es String", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: 7357,
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate lastname sin numeros", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "T3st3r",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate lastname no debe ser vacio", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate lastname menor a 2", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "T",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  test("Debe retornar un statusCode 401 validate lastname mayor a 50", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Abcdefghij-abcdefghij-abcdefghij-abcdefghij-abcdefghij",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payload);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  
});

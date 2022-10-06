const request = require("supertest");
const db = require("../../api/database/models");
const generateJWT = require("../../helpers/generateToken");
const { app, server } = require("../../server");
const { Data } = require("../../helpers/dataDB");

afterEach(() => {
  server.close();
});
afterAll(async () => {
  await db.sequelize.close();
});

// beforeAll(async() => {
//   await Data();
// })


//USADO PARA CREAR TOKEN
const payloadGod = {
  id: 1,
  username: "diegogod",
  role: "GOD",
};

const payloadAdmin = {
  id: 2,
  username: "hernana",
  role: "ADMIN",
};

const payloadGuest = {
  id: 5,
  username: "juven",
  role: "GUEST",
};

//LISTAR TODOS LOS USUARIOS
describe("GET - Listar todos los usuarios - /users", () => {
  test("Debe retornar un statusCode 200 rol GOD", async () => {
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 200 rol ADMIN", async () => {
    const token = await generateJWT(payloadAdmin);
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 403 rol GUEST", async () => {
    const token = await generateJWT(payloadGuest);
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(403);
  });

  test("Debe retornar un array con usuarios", async () => {
    const token = await generateJWT(payloadGod);
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
describe("GET - Listar un usuario por id - /users/:userId", () => {
  test("Debe retornar un statusCode 200 rol GOD", async () => {
    const userId = "1";
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 200 rol ADMIN", async () => {
    const userId = "1";
    const token = await generateJWT(payloadAdmin);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 403 rol GUEST", async () => {
    const userId = "1";
    const token = await generateJWT(payloadGuest);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(403);
  });

  test("Debe retornar un statusCode 200 rol GUEST", async () => {
    const userId = "5";
    const token = await generateJWT(payloadGuest);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un objeto usuario", async () => {
    const userId = "1";
    const token = await generateJWT(payloadGod);
    const { body } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(body.user).toEqual(
      expect.objectContaining({ email: expect.any(String) })
    );
  });

  test("Debe retornar un statusCode 401", async () => {
    const userId = "999";
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(401);
  });
});

//CREAR USUARIO
describe("POST - Crear un usuario en la base de datos - /users", () => {
  test("Debe retornar un statusCode 200", async () => {
    const newUser = {
      email: "supertest1@cenco.com",
      username: "jest1",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un objeto usuario", async () => {
    const newUser = {
      email: "supertest2@cenco.com",
      username: "jest2",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
    const { body } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(body.user).toEqual(
      expect.objectContaining({ email: expect.any(String) })
    );
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
      username: "diegogod",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
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
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });

  //VALIDATES DE PROFILEP PIC
  test("Debe retornar un statusCode 401 validate profilepic formato incorrecto", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "foto de perfil",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(401);
  });
});

//EDITAR USUARIO
describe("PUT - Editar un usuario de la base de datos - /users/:userId", () => {
  test("Debe retornar un statusCode 200", async () => {
    const { id } = await db.User.findOne({
      where: { email: "supertest1@cenco.com" },
      attributes: ["id"],
    });
    const userId = id;
    const newUserData = {
        email: "test_editar_1@cenco.com",
        username: "testEditarOne",
        password: "123456",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 200 rol GUEST", async () => {
    const userId = 5;
    const newUserData = {
        first_name: "Juan"
    };
    const token = await generateJWT(payloadGuest);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un statusCode 403 rol GUEST", async () => {
    const userId = 1;
    const newUserData = {
        first_name: "Juan"
    };
    const token = await generateJWT(payloadGuest);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(403);
  });


  test("Debe retornar un objeto usuario", async () => {
    const { id } = await db.User.findOne({
      where: { email: "test_editar_1@cenco.com" },
      attributes: ["id"],
    });
    const userId = id;
    const newUserData = {
      email: "supertest1@cenco.com",
      username: "testEditarTwo",
      password: "123456",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
    const { body } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(body.user).toEqual(
      expect.objectContaining({ email: expect.any(String) })
    );
  });

  test("Debe retornar un statusCode 412 por error en ROL", async () => {
    const { id } = await db.User.findOne({
      where: { email: "supertest1@cenco.com" },
      attributes: ["id"],
    });
    const userId = id;
    const newUserData = {
      email: "tessdt3@cenco.com",
      username: "test23sd",
      password: "testsd1234",
      id_role: 999,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(412);
  });

  test("Debe retornar un statusCode 404 no se encontro el usuario", async () => {
    const userId = 999;
    const newUserData = {
      email: "tessdt3@cenco.com",
      username: "test23sd",
      password: "testsd1234",
      id_role: 2,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(404);
  });

  test("Debe retornar un statusCode 401 validate username menor de 4", async () => {
    const { id } = await db.User.findOne({
      where: { email: "supertest1@cenco.com" },
      attributes: ["id"],
    });
    const userId = id;
    const newUserData = {
      email: "tessdt3@cenco.com",
      username: "ZZ",
      password: "testsd1234",
      id_role: 2,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(401);
  });
});

//ELIMINIAR USUARIO
describe("DELETE - Elimininar un usuario de la base de datos - /users/:userId", () => {
  test("Debe retornar un statusCode 200 ", async () => {
    const { id } = await db.User.findOne({
      where: { email: "supertest1@cenco.com" },
      attributes: ["id"],
    });
    const userId = id;
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(200);
  });

  test("Debe retornar un obeto usuario", async () => {
    const { id } = await db.User.findOne({
      where: { email: "supertest2@cenco.com" },
      attributes: ["id"],
    });
    const userId = id;
    const token = await generateJWT(payloadGod);
    const { body } = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(body.userDeleted).toEqual(
      expect.objectContaining({ email: expect.any(String) })
    );
  });

  test("Debe retornar un statusCode 404", async () => {
    const userId = 999;
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(404);
  });
});

//CIERRO LA CONEXION CON LA BASE PARA SIMULAR ERROR
describe("Deben retornar statusCode 500", () => {
  test("Debe retornar un statusCode 500 error en la base de datos", async () => {
    const token = await generateJWT(payloadGod);
    // await db.sequelize.query("drop database if exists mi_ecommerce_test;")
    db.sequelize.close();
    const { statusCode } = await request(app)
      .get("/api/v1/users")
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un statusCode 500", async () => {
    const userId = "1";
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .get(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un statusCode 500", async () => {
    const newUser = {
      email: "supertest@cenco.com",
      username: "jest",
      password: "123456",
      first_name: "El",
      last_name: "Tester",
      profilepic: "https://sequelize.com/constraints/",
      id_role: 1,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .post(`/api/v1/users/`)
      .auth(token, { type: "bearer" })
      .send(newUser);
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un statusCode 500 error en la base de datos", async () => {
    const userId = 10;
    const newUserData = {
      email: "tessdt3@cenco.com",
      username: "test23sd",
      password: "testsd1234",
      id_role: 2,
    };
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .put(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" })
      .send(newUserData);
    expect(statusCode).toBe(500);
  });

  test("Debe retornar un statusCode 500", async () => {
    const userId = 999;
    const token = await generateJWT(payloadGod);
    const { statusCode } = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .auth(token, { type: "bearer" });
    expect(statusCode).toBe(500);
  });
});

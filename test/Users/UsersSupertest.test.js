const { expect } = require("chai");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const supertest = require("supertest");
const crypto = require("crypto");

const requester = supertest("http://localhost:8000");

describe("Rutas de sesión de mi usuario (Register, Login, Current)", function () {
  let user = {};
  let cookie = {};

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected for UsersSupertest.test.js");
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it("Ruta: api/sessions/register con el método POST", async () => {
    const newUser = {
      first_name: "Julieta",
      last_name: "Jalapeño",
      email: `july${crypto.randomBytes(5).toString("hex")}@july.com`,
      password: "coder",
      age: 20,
    };

    const { statusCode, request } = await requester
      .post("/api/sessions/register")
      .send(newUser);
    user = request._data;

    expect(statusCode).to.be.equal(201);
  });

  it("Ruta: api/sessions/login con el método POST", async () => {
    const result = await requester.post("/api/sessions/login").send(user);
    const cookieResult = result.headers["set-cookie"][0];

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(cookie.name).to.be.ok.and.equal("coderCookie");
    expect(cookie.value).to.be.ok;
  });

  it("Ruta: api/sessions/current con el método GET", async () => {
    const { _body } = await requester
      .get("/api/sessions/current")
      .set("Cookie", [`${cookie.name}=${cookie.value}`]);

    expect(_body.email).to.be.equal(user.email);
  });
});

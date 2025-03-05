const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("../../models/User");
const assert = require("assert");
const crypto = require("crypto");

describe("Testing User DB sin chai", function () {
  this.timeout(10000);
  let idUser;

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected for Users.test.js");
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("Crear un usuario", async function () {
    const mockUser = {
      first_name: "Pepe",
      last_name: "Perez",
      email: `pepe${crypto.randomBytes(5).toString("hex")}@pepe.com`,
      password: "coder",
      age: 20,
    };

    const newUser = await userModel.create(mockUser);
    idUser = newUser._id;
    assert.ok(newUser.email, "El usuario debe tener la propiedad email");
  });

  it("Obtener todos los usuarios", async function () {
    const users = await userModel.find();
    assert.ok(Array.isArray(users), "Se esperaba un arreglo de usuarios");
  });

  it("Obtener un usuario", async function () {
    const user = await userModel.findById(idUser);
    assert.strictEqual(typeof user, "object", "Se esperaba un objeto usuario");
  });

  it("Actualizar un usuario", async function () {
    const mockUserUpdate = {
      first_name: "Pedro",
      last_name: "Parez",
      email: `pedro${crypto.randomBytes(5).toString("hex")}@example.com`,
      password: "coder",
      age: 25,
    };

    await userModel.findByIdAndUpdate(idUser, mockUserUpdate);
    const updatedUser = await userModel.findById(idUser);
    assert.strictEqual(
      updatedUser.first_name,
      "Pedro",
      "El primer nombre debe ser 'Pedro'"
    );
  });

  it("Eliminar un usuario", async function () {
    const deletedUser = await userModel.findByIdAndDelete(idUser);
    const foundUser = await userModel.findById(deletedUser._id);
    assert.strictEqual(
      foundUser,
      null,
      "El usuario debe ser eliminado y retornar null"
    );
  });
});

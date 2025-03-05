const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userModel = require("../../models/User.js");
const { expect } = require("chai");
const crypto = require("crypto");

describe("Testing User DB (ES Modules) usando chai", function () {
  this.timeout(10000);
  let idUser;

  before(async function () {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected for UsersChai.test.js");
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
    expect(newUser).to.have.property("email");
  });

  it("Obtener todos los usuarios", async function () {
    const users = await userModel.find();
    expect(users).to.be.an("array");
  });

  it("Obtener un usuario", async function () {
    const user = await userModel.findById(idUser);
    expect(user).to.have.property("cart");
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
    expect(updatedUser.first_name).to.equal("Pedro");
  });

  it("Eliminar un usuario", async function () {
    const deletedUser = await userModel.findByIdAndDelete(idUser);
    const foundUser = await userModel.findById(deletedUser._id);
    expect(foundUser).to.be.null;
  });
});

// mocks/mockingUsers.js
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

/**
 * Genera un arreglo de usuarios mock.
 * Cada usuario tendrá:
 * - first_name, last_name y email generados con faker.
 * - age aleatorio entre 18 y 80.
 * - password encriptado (siempre "coder123").
 * - role aleatorio entre "user" y "admin".
 * - pets: arreglo vacío.
 *
 * @param {number} num - Cantidad de usuarios a generar.
 * @returns {Array} Arreglo de usuarios.
 */
function generateMockUsers(num) {
  const users = [];
  // Encriptamos una sola vez "coder123" para todos los usuarios
  const hashedPassword = bcrypt.hashSync("coder123", 10);

  for (let i = 0; i < num; i++) {
    const user = {
      first_name: faker.person.firstName(),  // anterior: faker.name.firstName()
      last_name: faker.person.lastName(),      // anterior: faker.name.lastName()
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }), // anterior: faker.datatype.number({ min: 18, max: 80 })
      password: hashedPassword,
      role: faker.helpers.arrayElement(["user", "admin"]),
      pets: [] 
    };
    users.push(user);
  }
  return users;
}

module.exports = {
  generateMockUsers,
};

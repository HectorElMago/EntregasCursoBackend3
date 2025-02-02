// routes/mocks.router.js
const express = require("express");
const router = express.Router();
const { faker } = require("@faker-js/faker");
const { generateMockUsers } = require("../mocks/mockingUsers");
const bcrypt = require("bcrypt");

// Importa el modelo de Usuario
const User = require("../models/User");
// Importa (o crea) el modelo de Pet. Asegúrate de tenerlo definido.
const Pet = require("../models/Pet");

//////////////////////////////////////////////
// Endpoint para generar mascotas mock
//////////////////////////////////////////////
router.get("/mockingpets", (req, res) => {
  const pets = [];
  // Generamos 50 mascotas con datos falsos
  for (let i = 0; i < 50; i++) {
    const pet = {
      name: faker.animal.cat(), // o faker.animal.dog() según lo necesites
      species: faker.helpers.arrayElement(["dog", "cat", "bird", "fish"]),
      age: faker.number.int({ min: 1, max: 15 }), // anterior: faker.datatype.number({ min: 1, max: 15 })
      // Agrega más propiedades si es necesario
    };
    pets.push(pet);
  }
  res.json({ status: "success", payload: pets });
});

//////////////////////////////////////////////
// Endpoint para generar usuarios mock
//////////////////////////////////////////////
router.get("/mockingusers", (req, res) => {
  // Genera 50 usuarios utilizando el módulo mockingUsers
  const users = generateMockUsers(50);
  res.json({ status: "success", payload: users });
});

//////////////////////////////////////////////
// Endpoint para generar e insertar datos
//////////////////////////////////////////////
router.post("/generateData", async (req, res) => {
  const { users, pets } = req.body; // Se esperan parámetros numéricos
  try {
    let createdUsers = [];
    let createdPets = [];

    // Si se indicó cantidad de usuarios a generar
    if (users && Number(users) > 0) {
      const mockUsers = generateMockUsers(Number(users));
      // Inserta los usuarios generados en la base de datos
      createdUsers = await User.insertMany(mockUsers);
    }

    // Si se indicó cantidad de mascotas a generar y el modelo Pet existe
    if (pets && Number(pets) > 0 && Pet) {
      const mockPets = [];
      for (let i = 0; i < Number(pets); i++) {
        const pet = {
          name: faker.animal.dog(),
          species: faker.helpers.arrayElement(["dog", "cat", "bird", "fish"]),
          age: faker.number.int({ min: 1, max: 15 }),
        };
        mockPets.push(pet);
      }
      createdPets = await Pet.insertMany(mockPets);
    }

    res.json({
      status: "success",
      createdUsers,
      createdPets,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;

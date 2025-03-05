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

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: Endpoints para generación de datos mock
 */

router.get("/mockingpets", (req, res) => {
  const pets = [];
  for (let i = 0; i < 50; i++) {
    const pet = {
      name: faker.animal.cat(),
      species: faker.helpers.arrayElement(["dog", "cat", "bird", "fish"]),
      age: faker.number.int({ min: 1, max: 15 }),
    };
    pets.push(pet);
  }
  res.json({ status: "success", payload: pets });
});

//////////////////////////////////////////////
// Endpoint para generar usuarios mock
//////////////////////////////////////////////
/**
 * @swagger
 * /api/mockingusers:
 *   get:
 *     summary: Obtener una lista de usuarios mock.
 *     tags: [Mocks]
 *     responses:
 *       200:
 *         description: Lista de usuarios mock generadas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Error en el servidor.
 */
router.get("/mockingusers", (req, res) => {
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

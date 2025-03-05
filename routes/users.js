const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con la gestión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *         role:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - age
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Pepe"
 *               last_name:
 *                 type: string
 *                 example: "Perez"
 *               email:
 *                 type: string
 *                 example: "pepe@example.com"
 *               age:
 *                 type: number
 *                 example: 20
 *               password:
 *                 type: string
 *                 example: "coder"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Error al crear el usuario.
 */
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } =
      req.body;
    const user = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      cart,
      role,
    });
    await user.save();
    res.status(201).json({ status: "success", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error en el servidor.
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leer un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("cart");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un usuario
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

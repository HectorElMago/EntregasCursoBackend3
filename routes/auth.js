require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/User");
const UserRepository = require("../repositories/UserRepository");

const userRepository = new UserRepository();

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y manejo de sesiones
 */

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userDTO = await userRepository.getUserById(req.user._id);
    res.json(userDTO);
  }
);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Autenticación de usuario (Login)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "adminpassword"
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve token de autenticación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login exitoso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       401:
 *         description: Credenciales inválidas.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("jwt", token, { httpOnly: true });
    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtener información del usuario autenticado.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 age:
 *                   type: number
 *       401:
 *         description: No autorizado.
 *       500:
 *         description: Error en el servidor.
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;

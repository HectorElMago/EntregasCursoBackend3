const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const passport = require("passport");

/**
 * @swagger
 * tags:
 *   name: Carritos
 *   description: Endpoints para la gestión de carritos de compra
 */

// POST /api/carts - Crear un carrito (disponible para todos los usuarios autenticados)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      res.status(201).json({ status: "success", cart: newCart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { cid, pid } = req.params;

    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const productIndex = cart.products.findIndex((p) => p.product == pid);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE /api/carts/:cid/products/:pid - Eliminar un producto del carrito
router.delete(
  "/:cid/products/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      cart.products = cart.products.filter((product) => product.product != pid);
      await cart.save();

      res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// PUT /api/carts/:cid - Actualizar un carrito
router.put(
  "/:cid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      cart.products = products;
      await cart.save();

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener el carrito del usuario.
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrito del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error en el servidor.
 */
router.get("/", (req, res) => {
  // Aquí implementarías la lógica para obtener el carrito.
  res.json({ products: [] });
});

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Crear un nuevo carrito para el usuario.
 *     tags: [Carritos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "userId123"
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/", (req, res) => {
  // Aquí implementarías la lógica para crear un carrito.
  res.status(201).json(req.body);
});

module.exports = router;

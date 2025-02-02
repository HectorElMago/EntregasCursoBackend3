// models/Pet.js
const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  age: { type: Number, required: true },
  // Agrega otras propiedades si lo deseas
});

module.exports = mongoose.model("Pet", petSchema);
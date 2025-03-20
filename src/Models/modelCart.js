import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({
  // Puedes agregar campos adicionales si lo necesitas
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

const Carrito = mongoose.model("Carrito", carritoSchema);
export default Carrito;
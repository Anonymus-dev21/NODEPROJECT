import express from "express";
import productosRouter from "./Routes/productos.router.js";
import cartRouter from "./Routes/carrito.router.js";
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/productos", productosRouter);
app.use("/api/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});
import express from "express";
import productosRouter from "./Routes/productos.router.js";
import cartRouter from "./Routes/carrito.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils/dirnameUtil.js";
import mongoose from "mongoose";

import {Server} from "socket.io";
import conectarDB from "../connection/db.js";
import dotenv from "dotenv";
import Producto from "./Models/modelProducts.js";
dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( 'Public'));
app.use("/api/productos", productosRouter);
app.use("/api/cart", cartRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor express escuchando en http://localhost:${PORT}`);
});
const io= new Server(httpServer)
app.locals.io = io;
conectarDB()
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars'); 


app.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeProducts")
  } catch (error) {
    console.error("Error cargando productos:", error)
    res.status(500).send("Error al cargar productos")
  }
})
app.get("/cart", async (req, res) => {
  try {
    res.render("cart")
  } catch (error) {
    console.error("Error cargando productos:", error)
    res.status(500).send("Error al cargar productos")
  }
});

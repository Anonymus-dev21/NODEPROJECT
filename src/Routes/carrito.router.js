import e, { Router } from "express";
import Producto from "../Models/modelProducts.js";
import Carrito from "../Models/modelCart.js";
import { isValidObjectId } from "mongoose";
const router = Router();
 

router.get("/:cid", async (req, res) => {
  try{
  const cid = req.params.cid;
  if (!cid) {
    res.status(400).json({error: "Falta el id del carrito"});
    return;
  } else if ( !isValidObjectId(cid)) {
    res.status(400).json({error: "El id del carrito no es valido"});
    return;
  }

  const cart = await Carrito.findOne({ _id: cid }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    
    const total = cart.products.reduce((sum, item) => {
      return sum + (item.product.precio * item.quantity);
    }, 0);

   
    res.status(200).json({ ...cart.toObject(), total });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = new Carrito(req.body);
    await newCart.save();
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
})

router.post("/:cid/productos/:pid", async (req, res) => {
 
  const {cid, pid} = req.params;
  if (!cid) {
    res.status(400).json({error: "Falta el id del carrito"});
    return;
  } else if (!isValidObjectId(cid)) {
    res.status(400).json({error: "El id del carrito no es valido"});
    return;
  } else if (!pid) {
    res.status(400).json({error: "Falta el id del producto"});
    return;
  } else if (!isValidObjectId(pid)) {
    res.status(400).json({error: "El id del producto no es valido"});
    return;
  }
  const quantity = parseInt(req.body.quantity);
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Elige una cantidad válida para agregar" });
  }
  
  const product = await Producto.findById(pid);
  if(!product){
    res.status(404).json({error: "Producto no encontrado"});
    return;
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: "No hay suficiente stock" });
  }
  const cart = await Carrito.findOne({_id: cid});
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }
  
  const existingIndex = cart.products.findIndex(p => p.product.equals(pid));
  if (existingIndex !== -1) {
    cart.products[existingIndex].quantity += quantity;
  } else {
    cart.products.push({product: pid, quantity: quantity});
  }
  product.stock -= quantity;
  await product.save();
  await cart.save();
  res.status(201).json({ message: "Producto agregado al carrito" });
});
export default router;
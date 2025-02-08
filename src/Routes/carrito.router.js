import { Router } from "express";
import { loadData, saveData  } from "../data.js";
import fs from "fs";


const router = Router();


router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const data = await loadData();
  
  const cart = data.carrito.find((cart) => cart.id === cid);
  if (cart) {
    res.status(200).json(cart.products);
  } else {
  res.status(404).json({error: "Carrito no encontrado"})}
});
router.post("/", async (req, res) => {
  const data = await loadData();
  const id = data.carrito.length > 0 ? data.carrito[data.carrito.length - 1].id + 1 : 1;
  const newCart = {id: id, products: []};
  data.carrito.push(newCart);
  await saveData(data);
  res.status(201).json(newCart);
})

router.post("/:cid/productos/:pid", async (req, res) => {
  const {cid, pid} = req.params;
  const quantity = parseInt(req.body.quantity);
  if(!quantity){
    res.status(400).json({error: "Falta el campo quantity"});
    return;
  }
  const data = await loadData();
  const product = data.productos.find((product) => product.id == pid);
  if(!product){
    res.status(404).json({error: "Producto no encontrado"});
    return;
  }
  const cart = data.carrito.find((cart) => cart.id == cid);
  if(cart){
    const productoYaAgregado = cart.products.find((product) => product.id == pid);
    if(product.stock >= quantity){
    if(productoYaAgregado){
      productoYaAgregado.quantity += quantity;
      
    } else {
      cart.products.push({id: pid, quantity: quantity});
      
    }
    product.stock -= quantity;
  } else {
      res.status(400).json({error: "No hay suficiente stock"});
      return;
    }
    
    res.status(201).json(cart.products);
  } else {
    res.status(404).json({error: "Carrito no encontrado"});
  }
  
  await saveData(data);
});
export default router;
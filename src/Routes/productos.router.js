import {json, Router} from "express";
import fs from "fs"; 
import { loadData, saveData  } from "../data.js";

const router = Router();



router.get("/", async (req, res) => {
  const data = await loadData()
  if(data.productos.length > 0){

    const {limit} = req.query;
    if(limit){
      res.send(data.productos.slice(0, limit))
      return
    }
      res.send(data.productos)
    } else{
      res.status(404).json({error: "No hay productos cargados"});
    }
  })


router.get("/:pid", async (req, res) => {
  const pdtoid = parseInt(req.params.pid);
  const data = await loadData();
  const producto = data.productos.find((producto) => producto.id == pdtoid);
  if(producto){
  res.send(producto);}
  else{
    res.status(404).json({error: "Producto no encontrado"});
  }
})


router.post("/", async(req, res) => {
  try {
const body = req.body;
if(body.id){
  res.status(400).send("No se puede agregar un id");
  return;
}
if(!body.title || !body.descripcion || !body.precio || !body.codigo || !body.stock){
  res.status(400).send("Faltan datos");
  return;
}
const data = await loadData();
const productos = data.productos;
const newId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
const newProducto = { id: newId, ...body };
productos.push(newProducto);
data.productos = productos;
await saveData(data);
req.app.locals.io.emit("newProduct", data.productos);

res.status(201).json(newProducto);}
catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error al agregar el producto" });
}


}); 


router.put("/:pid", async (req, res) => {
  const pdtoid = parseInt(req.params.pid);
  const body = req.body;
  const data = await loadData();

 if (Object.keys(body).length === 0) {
  res.status(400).send("Añade algun campo a modificar")
  return;
};
  const producto = data.productos.find((producto) => producto.id === pdtoid);
  if(!producto){
    res.status(404).json({error: "Producto no encontrado"});
    return;
  }
  if(body.id){
    res.status(400).json({error: "No se puede modificar el id del producto"});
    return;}
  const index = data.productos.findIndex((producto) => producto.id == pdtoid);
  data.productos[index] = {...producto, ...body};
  await saveData(data);
  req.app.locals.io.emit("updateProduct", data.productos);
  res.status(201).json(data.productos[index]);
})

router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const data = await loadData();
  const producto = data.productos.find((pdto) => pdto.id === pid);
  if(!producto){
    res.status(404).json({error: "Producto no encontrado"});
    return;
  }
  
  const index = data.productos.findIndex((pdto) => pdto.id === pid);
  const [productoEliminado] = data.productos.splice(index, 1);
  data.carrito.forEach((cart) => {
    cart.products = cart.products.filter((product) => parseInt(product.id) !== pid);
  })
  await saveData(data);
  req.app.locals.io.emit("deleteProduct", data.productos); 
  res.status(200).json( {productoEliminado: productoEliminado});
});



export default router;
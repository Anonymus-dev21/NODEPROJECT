import {Router} from "express";


import  { isValidObjectId } from "mongoose";
import Producto from "../Models/modelProducts.js";
import Carrito from "../Models/modelCart.js";
const router = Router();


router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    let filter = {};
    if(query){
      if(query === "Todos" || query === "" || query === undefined){
        filter = {};
      } else {
        filter = { categoria: query };
      }
    } 
    const options = {
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
      sort: sort === "asc" ? { precio: 1 } : sort === "desc" ? { precio: -1 } : undefined,
    };
    const result = await Producto.paginate(filter, options);
    res.status(200).json(result);
    } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
});


router.get("/:pid", async (req, res) => {
  const pdtoid = req.params.pid;
  const producto = await Producto.findById(pdtoid);
  if(producto){
  res.send(producto)
  return
  }
  else{
    res.status(404).json({error: "Producto no encontrado"});
    return
  }
})


router.post("/", async (req, res) => {
  try {
const body = req.body;
if(body.id){
  res.status(400).send("No se puede agregar un id");
  return;
}
if(!body.title || !body.descripcion || !body.precio || !body.codigo || !body.stock || !body.categoria){
  res.status(400).send("Faltan datos");
  return;
}

const productExist = await Producto.findOne( { $or: [{ title: body.title }, { codigo: body.codigo }] } );

if(productExist){
  res.status(400).send("Ya hay un producto con el mismo título o codigo");
  return;
}

const newProducto =  new Producto({
  title: body.title,
  descripcion: body.descripcion,
  precio: body.precio,
  codigo: body.codigo,
  stock: body.stock,
  categoria: body.categoria
})

await newProducto.save();

req.app.locals.io.emit("newProduct", Producto);

res.status(201).json({message: "Producto agregado: ", newProducto});
}
catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error al agregar el producto" });
}


}); 


router.put("/:pid", async (req, res) => {
  const pdtoid = req.params.pid;
  const body = req.body;
  if(!pdtoid){
    res.status(400).json({error: "Falta el id del producto"});
    return
  }
  if( !isValidObjectId(pdtoid)){
    res.status(400).json({error: "El id del producto no es valido"});
    return    
  }
  const producto = Producto.findById(pdtoid);

 if (Object.keys(body).length === 0) {
  res.status(400).send("Añade algun campo a modificar")
  return;
};

  if(!producto){
    res.status(404).json({error: "Producto no encontrado"});
    return;
  }
  if(body.id){
    res.status(400).json({error: "No se puede modificar el id del producto"});
    return;}
  const productoActualizado = await Producto.findByIdAndUpdate(pdtoid, body, {new: true});
  req.app.locals.io.emit("updateProduct", );
  res.status(201).json({message: "Producto actualizado: ", productoActualizado});
})

router.delete("/:pid", async (req, res) => {
  const pid = req.params.pid
  if(!pid){
    res.status(400).json({error: "Falta el id del producto"});
    return
  }
  if( !isValidObjectId(pid)){
    res.status(400).json({error: "El id del producto no es valido"});
    return    
  }
  const producto = await Producto.findById(pid);
  if(!producto){
    res.status(404).json({error: "No existe un producto con ese id"});
    return;
  }
  const productoEliminado =  await Producto.deleteOne({ _id: pid });
  
 await Carrito.updateMany ({}, {
  $pull: {
    products: {  product: pid }
  }
});
  req.app.locals.io.emit("deleteProduct", Producto); 
  res.status(200).json( {productoEliminado: productoEliminado});
});



export default router;
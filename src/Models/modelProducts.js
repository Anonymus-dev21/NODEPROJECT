
import mongoose from "mongoose";
import mongosePaginate from "mongoose-paginate-v2";

const productoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  codigo: { type: String, required: true },
  stock: { type: Number, required: true },
  
});

productoSchema.plugin(mongosePaginate);

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
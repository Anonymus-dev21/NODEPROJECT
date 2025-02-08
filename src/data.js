
// export const productos = [
//     {
//       id:1,
//       title: "Producto 1",
//       descripcion: "Descripción del producto 1",
//       precio: 100,
//       codigo: "15",
//       stock: 10,
      
//     },
//     {
//       id:2,
//       title: "Producto 2",
//       descripcion: "Descripción del producto 2",
//       precio: 200,
//       codigo: "52",
//       stock: 20,
      
//     },
//     {
//       id  :3,
//       title: "Producto 3",
//      descripcion: "Descripción del producto 3",
//       precio: 300,
//       codigo:"23",
//       stock: 30,
     
//     }
//   ];

//     export const carrito = [
//         {
//             id,
//             products: [
//             {
//               id,
//               quantity
//             }
//           ]
//           }
//         ]

import fs from "fs";

const DATA_PATH = "./data.txt"; 


export async function loadData() {
  try {
    const fileData = await fs.promises.readFile(DATA_PATH, "utf-8");
    
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error al cargar data:", error);
    
    return { productos: [], carrito: [] };
  }
}


// Función para guardar la data
export async function saveData(data) {
  try {
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al guardar data:", error);
  }
}

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
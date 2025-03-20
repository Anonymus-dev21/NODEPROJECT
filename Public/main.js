
const socket = io();
document.addEventListener("DOMContentLoaded", () => {
const path = window.location.pathname;
console.log(path)
if (path.includes("/realtimeProducts")) {
  
  const contenedorProductos = document.querySelector(".contenedorProductos");
  const addToCart = () => {
    
    const contenedorProductos = document.querySelector(".contenedorProductos");

    contenedorProductos.addEventListener("click", (event) => {
      // Verifica si el clic se hizo sobre un botón con la clase "addToCart"
      if (event.target && event.target.classList.contains("addToCart")) {
        // Obtiene el ID del producto desde el atributo data-product-id
        const productoId = event.target.dataset.productId;
        
        
        // Llama a la función que hace el fetch para agregar el producto al carrito
        fetch(`http://localhost:8080/api/cart/67da15499f2a0704ba97ded4/productos/${productoId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ quantity: 1 })
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(errorText => { throw new Error(errorText); });
          }
          return response.json();
        })
        .then(data => {
          
          Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'El producto ha sido agregado al carrito'
          });
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message
          });
          console.error("Error al agregar producto al carrito:", error.message);
        });
      }
    })}
  
  const generarProductos = (products) => {

    contenedorProductos.innerHTML = "";
    products.forEach(producto => {
        const divCard = document.createElement("div");
        divCard.classList.add("CardProducto");

        divCard.innerHTML = `
<div class="img"></div>
<div class="productoInfo">
  <div class="title">
    <p>${producto.title}</p>
  </div>
  <div class="precio">
    <p>$${producto.precio}</p>
  </div>
  <div class="descripcion">
    <p>${producto.descripcion}</p>
  </div>
  <div class="cartbutton">
    <button class="addToCart" data-product-id="${producto._id}">Añadir al carrito</button>
  </div>
</div>
`;
        contenedorProductos.appendChild(divCard);
    });
};

const categoria = document.getElementById("category");
const orden = document.getElementById("order");
let selectedCategory = categoria.value;
let selectedOrder = orden.value;
let url = "http://localhost:8080/api/productos";
categoria.addEventListener("change", () => {
  
    selectedCategory = categoria.value;
    
    url = `http://localhost:8080/api/productos?query=${selectedCategory}&sort=${selectedOrder}&limit=${limit}`;
    obtenerProductos(url);
});

orden.addEventListener("change", () => {
  selectedOrder = orden.value;
  url = `http://localhost:8080/api/productos?sort=${selectedOrder}&query=${selectedCategory}&limit=${limit}`;
  obtenerProductos(url);
})
let limit = 10;
const verMas = document.getElementById("verMas");
const verMenos = document.getElementById("verMenos");

verMas.addEventListener("click", () => {
  limit += 10;
  if(limit >= 30){
    limit = 30;
  }
  
  url = `http://localhost:8080/api/productos?limit=${limit}&sort=${selectedOrder}&query=${selectedCategory}`  ;
  obtenerProductos(url);
})

verMenos.addEventListener("click", () => {
  
  limit -= 10;
  if(limit <= 0){
    limit = 10;
    
  }
  
  url = `http://localhost:8080/api/productos?limit=${limit}&sort=${selectedOrder}&query=${selectedCategory}`  ;
  obtenerProductos(url);
})

const dibujarPaginación = (paginas) => {
  const paginacionContainer = document.querySelector(".paginate"); // selecciona el contenedor
  // Limpia el contenedor
  paginacionContainer.innerHTML = "";

  for (let i = 0; i < paginas; i++) {
    const div = document.createElement("div");
    div.classList.add("page");

    const button = document.createElement("button");
    button.textContent = i + 1;
    button.addEventListener("click", () => {
      const limit = 10;
      const url = `http://localhost:8080/api/productos?limit=${limit}&page=${i + 1}&sort=${selectedOrder}&query=${selectedCategory}`;
      obtenerProductos(url);
    });

    div.appendChild(button);
    paginacionContainer.appendChild(div);
  }
};
  const obtenerProductos = async (url) => {
    
    try {
        await fetch(url)
        .then(res => res.json())
        .then(data => {generarProductos(data.docs)
          dibujarPaginación(data.totalPages);
         if(data.totalDocs >= limit){
           verMas.classList.remove("disabled");
        } else {
            verMas.classList.add("disabled");
         }

         if(limit > 10){
          verMenos.classList.remove("disabled");
       } else {
           verMenos.classList.add("disabled");
        }
        });
    } catch (error) {
        console.error(error);
    }
}

obtenerProductos(url);

socket.on("newProduct", () => obtenerProductos(url)); 
socket.on("deleteProduct", () => obtenerProductos(url)); 
socket.on("updateProduct", () => obtenerProductos(url)); 
  //Agregar producto form

  const productForm = document.getElementById("productForm");
  productForm.addEventListener("submit", async (e) => {
    try{

    
      e.preventDefault();
      const title = document.getElementById("title").value;
      const precio = document.getElementById("price").value;
      const descripcion = document.getElementById("description").value;
      const stock = document.getElementById("stock").value;
      const codigo = document.getElementById("code").value;
      const categoria = document.getElementById("categorya").value;
      const newProduct = {title, precio, descripcion, stock, codigo, categoria};
      console.log(newProduct)

      await fetch("http://localhost:8080/api/productos", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(newProduct)
      }).then(async (res) => {
          if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
          }
      })
      productForm.reset()
      Swal.fire({
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 1500
      })
    }
      catch(error){
          console.error("Error:", error.message);
          
      }
  })

  addToCart();
}

    


    //=========================CARRITO====================================
    if(path.includes("/cart")){
      const containerCart = document.getElementsByClassName("carritoProductsContainer");
   const pedirProductosCarrito = async () => {
     try {
       const res = await fetch("http://localhost:8080/api/cart/67da15499f2a0704ba97ded4");
       const data = await res.json();
       containerCart[0].innerHTML = "";

       data.products.forEach((item) => {
         const div = document.createElement("div");
         div.innerHTML = `
           <div class="img"></div>
           <div class="productoInfo">
             <div class="title">
               <p>${item.product.title}</p>
             </div>
             <div class="precio">
               <p>$${item.product.precio}</p>
             </div>
             <div class="descripcion">
               <p>${item.product.descripcion}</p>
             </div>
             <div class="cantidad">
               <p>Cantidad: ${item.quantity}</p>
             </div>
             <div class="total">
               <p>Total: $${item.product.precio * item.quantity}</p>
             </div>
           </div>`;
         
         containerCart[0].appendChild(div);
       });
       const totalCompra= document.getElementsByClassName("totalCompra");
       const total = document.createElement("div");
       total.innerHTML = `<div class="total">
    <h2>Total: $${data.total} </h2>
</div>`;

       totalCompra[0].appendChild(total);
     } catch (error) {
       console.log(error);
     }
   }


   pedirProductosCarrito();
    }
    
})

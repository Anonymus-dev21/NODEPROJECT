const socket = io();
document.addEventListener("DOMContentLoaded", () => {

  
    console.log(products);
    const contenedorProductos = document.querySelector(".contenedorProductos");
    const generarProductos = (products, newProduct) => {
        contenedorProductos.innerHTML = "";
        if(newProduct){
            products.push(newProduct);}
            products.forEach(productos => {
            const divCard = document.createElement("div");
            divCard.classList.add("CardProducto");
            
            divCard.innerHTML = `
            
                  <div class="img">
            
                  </div>
            
                  <div class="productoInfo">
                    <div class="title">
                      <p> ${productos.title} </p>
                    </div>
                    <div class="precio">
                      <p> ${productos.precio} </p>
                    </div>
                    <div class="descripcion">
                      <p> ${productos.descripcion} </p>
                    </div>
            
                  </div>
                `
                contenedorProductos.appendChild(divCard);
        });
    }
    generarProductos(products);
    socket.on("newProduct", (newProduct) => {
        generarProductos(newProduct);
    })

    socket.on("deleteProduct", (productoEliminado) => {
        console.log(productoEliminado)
       

        generarProductos(productoEliminado);
    })

    socket.on("updateProduct", (productoActualizado) => {
        generarProductos(productoActualizado);
    })

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
        const newProduct = {title, precio, descripcion, stock, codigo};
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
})
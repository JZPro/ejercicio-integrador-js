
// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);
const licuadora = new Producto('HO123HO', 'Licuadora', 100, 'hogar');

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon, licuadora];




// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }


    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {

        try {
            console.log(`Agregando ${cantidad} ${sku}`);

            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);

            // si lo encuentro opero con el producto a agregar
            if (producto) {
                console.log("Producto encontrado", producto);

                // Ej. 1)a)
                // Busco el producto en el nuevo Carrito
                const prodFoundEnCarrito = this.productos.find(element => element.sku === sku); 
                
                            
                if (prodFoundEnCarrito === undefined ) {

                // Creo un producto nuevo en el carrito                    
                    const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad, producto.categoria);
                    this.productos.push(nuevoProducto);
                    this.precioTotal = this.precioTotal + (producto.precio * cantidad);                    

                    //Ej. 1)b) Agrego categoria solo si no existe
                    const catFoundEnCarrito = this.categorias.find(element => element === nuevoProducto.categoria); 

                    if (catFoundEnCarrito === undefined){
                        this.categorias.push(nuevoProducto.categoria);
                        console.log("se agrego al carrito la categoria " + nuevoProducto.categoria + " del producto: " + nuevoProducto.nombre);
                    }
                    

                } else {
                    // Suma de las cantidades y calculo precio total
                    console.log("Encontro en carrito el elemento con sku: "+ prodFoundEnCarrito.sku);

                    //prodFoundEnCarrito.cantidad += prodFoundEnCarrito.cantidad;
                    // this.cantidad += prodFoundEnCarrito.cantidad;
                    prodFoundEnCarrito.cantidad += cantidad;
                    this.precioTotal += producto.precio * cantidad;
                    // Calcular stock del producto ?
                    
                    console.log("Cantidad del producto: ", prodFoundEnCarrito.cantidad);

                }

            // no encontro sku en el super
            } else {
                console.log(`El producto con sku ${sku} no se encontró`);
            }
            
            console.log("Cantidad de distintos productos en el carrito: "+ this.productos.length);
            carrito.muestraCarritoActual();

        } catch (error) {
            console.log(error);
            //console.log(new Error(error));
            
            }

    }


    
    async eliminarProducto(sku, cantidad) {
        console.log(`Eliminando ${cantidad} unidades del SKU: ${sku}`);

        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        console.log("Producto encontrado", producto);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let mensaje =""

                    // Ej. 2)a)-Busco el Indice del producto en el nuevo Carrito
                    const idx = this.productos.findIndex(element => element.sku === sku); 
                    
                    if (idx !== -1 ) {
                        
                        console.log(`Se encontró el producto: ${this.productos[idx].nombre} en el carrito`);

                            if (cantidad >= this.productos[idx].cantidad) {

                                //Elimino el producto del carrito si ya no quedan unidades
                                //Calculo precio total, Elimino el prod del carrito y verifico si hay categoría para eliminar

                                console.log(`Se eliminará del carrito el producto ${producto.nombre} - ${producto.categoria}`);                                
                                
                                this.precioTotal -= producto.precio * this.productos[idx].cantidad;

                                const productoEliminado = this.productos.splice(idx ,1);

                                //console.log("Se eliminó " + productoEliminado[0].nombre + " con sku: " + productoEliminado[0].sku);

                                mensaje = `El producto ${productoEliminado[0].nombre} con SKU: ${productoEliminado[0].sku} fué eliminado del carrito`;
                                
                                if (productoEliminado) {
                                    
                                    //Averiguo si existe la categoria en algun prod del carrito
                                    const foundCat = this.productos.filter(e => e.categoria === productoEliminado[0].categoria);

                                    if (foundCat.length > 0) {
                                        //No borro la categoria porque hay productos que la tienen
                                        console.log(`Todavia hay productos con la categoria ${foundCat[0].categoria}`);

                                    } else {
                                        const idxCat = this.categorias.findIndex(element => element === productoEliminado[0].categoria);
                    
                                        if (idxCat !== -1){
                                            // Elimino la categ del carrito
                                            const catEliminada = this.categorias.splice(idxCat ,1);

                                            //console.log("Se eliminó la categoria " + catEliminada[0] + " por el sku: " + productoEliminado[0].sku);
                                            mensaje = `Se ha eliminado del carrito el producto ${productoEliminado[0].nombre} con SKU: ${productoEliminado[0].sku}, tambien la categoría: ${catEliminada[0]}`;
                                        }
                                    }

                                    
                                } 

                            } else {

                                // Resto las cantidades y calculo precio total
                                this.productos[idx].cantidad -= cantidad;
                                this.precioTotal -= producto.precio * cantidad;
                                mensaje = `Se quitaron ${cantidad} unidades al producto ${sku}`;
                            }
                        
                        console.log("Cantidad de distintos productos en el carrito: "+ this.productos.length);
                        carrito.muestraCarritoActual();

                        resolve(mensaje);

                    } else {
                        // no se encontro en carrito                        
                        reject(new Error("El producto " + producto.nombre + " con categoría " + producto.categoria + " no se encuentra en este carrito"));
                    }
                

                }, 1500);
            });
            
                
    }

    muestraCarritoActual() {
        this.productos.forEach(function (prods, index) {
            console.log(`id.${index}- ${prods.nombre} - Cant: ${prods.cantidad}`)
        });
        console.log(`Categorías en el carrito: ${this.categorias}`)
        console.log(`Precio Total: ${this.precioTotal}`)
    } 
    
}




// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito
    categoria;  // Agrego Categoria para luego poder agregar o quitar del carrito Categorias

    constructor(sku, nombre, cantidad, categoria) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);            
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject( new Error(`Product ${sku} not found`));
            }
        }, 1500);
    });
}




//Operaciones - Ejecucion ---------------------------------------------------------------------

//console.log('PRODUCTOS listado DB del SUPER');
console.log(productosDelSuper);

const carrito = new Carrito();

// AGREGANDO -'WE328NJ', 'Jabon', 4, 'higiene', 3
carrito.agregarProducto('WE328NJ', 2);

// PRUEBAS SUMANDO CANT
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 2);
carrito.agregarProducto('WE328NJ', 2);


// PROBANDO AGREGADO DE UNO DE LA MISMA CATEGORIA: 'OL883YE', 'Shampoo', 3, 'higiene', 50
carrito.agregarProducto('OL883YE', 3);


// AGREGANDO UNO DE OTRA CATEGORIA: 'FN312PPE', 'Gaseosa', 5, 'bebidas'
carrito.agregarProducto('FN312PPE', 2);


// AGREGANDO UNO QUE NO EXISTE - Mensaje de error
carrito.agregarProducto('WE123NO', 2);


// UNO DE OTRA CATEGORIA NUEVA - 'XX92LKI', 'Arroz', 7, 'alimentos', 20
carrito.agregarProducto('XX92LKI', 2);




// Quito 3 unidades de Jabon
carrito.eliminarProducto('WE328NJ', 3)
.then((resp) => console.log(resp))
.catch((error) => console.log(error)); 


// Quito del carrito totalmente jabones
carrito.eliminarProducto('WE328NJ', 5)
.then((resp) => console.log(resp))
.catch((error) => console.log(error)); 


// Quito del carrito totalmente arroz
carrito.eliminarProducto('XX92LKI', 10)
.then((resp) => console.log(resp))
.catch((error) => console.log(error)); 


// Intento con uno que no existe en la DB
carrito.eliminarProducto("WE123NO", 5)
  .then((resp) => console.log(resp))
  .catch((error) => console.log(error)); 

  
//Trato de eliminar un producto que no esta en el Carrito
carrito.eliminarProducto('XX92LKI', 8)
.then((resp) => console.log(resp))
.catch((error) => console.log(error)); 


// Quito X cantidad de shampoo
carrito.eliminarProducto('OL883YE', 2)
.then((resp) => console.log(resp))
.catch((error) => console.log(error)); 


// Quito del carrito totalmente shampoo
carrito.eliminarProducto('OL883YE', 10)
.then((resp) => console.log(resp))
.catch((error) => console.log(error)); 
  






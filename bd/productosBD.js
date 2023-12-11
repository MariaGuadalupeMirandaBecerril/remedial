var conexionP=require("./conexion").conexionP;
var Producto=require("../modelos/Producto");
//const { compile } = require("ejs");

async function mostrarProductos(){
    var products=[];
    try{
        var productos=await conexionP.get();
        productos.forEach((producto)=>{
            var producto1=new Producto(producto.id, producto.data());
            if(producto1.bandera==0){
                products.push(producto1.obtenerProducto);
            }
        });
    }
    catch(err){
        console.log("Error al obtener los productos de firebase"+err);
    }
    return products;
}

async function buscarProdID(id){
    var product;
    try{
        var productobd=await conexionP.doc(id).get();
        var productoObjeto=new Producto(productobd.id,productobd.data());
        if(productoObjeto.bandera==0){
            product=productoObjeto.obtenerProducto;
        }
    }
    catch(err){
        console.log("Error al buscar el producto "+err);
        product=null;
    }
    return product;
}

async function nuevoProducto(datos){
    var producto=new Producto(null,datos);
    var error=1;
    if(producto.bandera==0){
        try{
            await conexionP.doc().set(producto.obtenerProducto);
            console.log("Producto registrado correctamente");
            error=0;
        } 
        catch(err){
            console.log("Error al registrar el producto "+err);
        }
    }
    return error;
}

async function modificarProducto(datos){
    var producto=new Producto(datos.id, datos);
    var error=1;
    if(producto.bandera==0){
        try{
            await conexionP.doc(producto.id).set(producto.obtenerProducto);
            console.log("Producto actualizado correctamente");
            error=0;
        }
        catch(err){
            console.log("Error al modificar el producto "+err);
        }
    }
    else{
        console.log("Los datos no son correctos");
    }
    return error;
}

async function borrarProducto(id){
    var error=1;
    try{
        await conexionP.doc(id).delete();
        console.log("Producto Borrado");
        error=0;
    }
    catch(err){
        console.log("Error al borrar el producto "+err);
    }
    return error;
}

module.exports={
    mostrarProductos,
    buscarProdID,
    nuevoProducto,
    modificarProducto,
    borrarProducto
}
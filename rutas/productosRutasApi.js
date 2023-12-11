var rutaPD=require("express").Router();
var {mostrarProductos, nuevoProducto, buscarProdID, modificarProducto, borrarProducto}=require("../bd/productosBD");
var {subirArchivoProd, eliminarArchivoProd} = require("../middlewares/middlewares");
const Productos = require("../modelos/Producto");

rutaPD.get("/api/mostrarproductos",async(req, res)=>{
    var productos = await mostrarProductos();
    console.log(productos);
    if(productos.length==0){
        res.status(400).json("No hay productos");
    }
    else {
        res.status(200).json(productos);
    }
});

/*rutaPD.get("/nuevoproducto",(req, res)=>{
    res.render("productos/nuevo");
});*/

rutaPD.post("/api/nuevoproducto", subirArchivoProd(),async (req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoProducto(req.body);
    if (error==0){
        res.status(200).json("Producto registrado correctamente");
    }
    else {
        res.status(400).json("El producto no se ha podido registrar");
    }
});

/*rutaPD.post("/api/buscarProductoPorId/:id",(req,res)=>{
    console.log("kjaf");
    console.log(req.params.id);
    res.end()
});*/
            
rutaPD.get("/api/buscarProductoPorId/:id", async (req, res)=>{
    console.log(req.params.id);
    var product= await buscarProdID (req.params.id);
    if (product==""){
        res.status(400).json("Producto no encontrado");
    } else{
        res.status(200).json(product);
    }
});

rutaPD.post("/api/editarProducto", subirArchivoProd(), async (req, res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error= await modificarProducto(req.body);
    if (error==0){
        res.status(200).json("Producto actualizado correctamente");
    } else{
        res.status(400).json("Error al actualizar el producto");
    }
});

rutaPD.get("/api/borrarproducto/:id", async (req, res)=>{
    /*var error = await borrarProducto(req.params.id);
    if (error==0){
        res.status(200).json("Producto borrado correctamente");
    } else{
        res.status(400).json("Error al borrar el producto");
    }*/
    try {
        var producto = await buscarProdID(req.params.id);
        if (!producto) {
          res.status(400).send("producto no encontrado.");
        } else {
          var archivo = producto.foto;
          await borrarProducto(req.params.id);
          eliminarArchivoProd(archivo)(req, res, () => {
            res.status(200).json("Producto borrado correctamente");
          });
        }
      } catch (err) {
        console.log("Error al borrar producto" + err);
        res.status(400).send("Error al borrar producto.");
      }
});

module.exports=rutaPD;
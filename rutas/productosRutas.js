var rutaPD=require("express").Router();
var {autorizado, admin}=require("../middlewares/password");
var {mostrarProductos, nuevoProducto, buscarProdID, modificarProducto, borrarProducto}=require("../bd/productosBD");
var eliminarArchivoProd = require("../middlewares/middlewares").eliminarArchivoProd;
var {subirArchivoProd} = require("../middlewares/middlewares");
const Productos = require("../modelos/Producto");

rutaPD.get("/mostrarP", autorizado, async(req, res)=>{
    var productos = await mostrarProductos();
    console.log(productos);
    res.render("productos/mostrarP",{productos})
});

rutaPD.get("/nuevoproducto", autorizado, async(req, res)=>{
    res.render("productos/nuevo");
});

rutaPD.post("/nuevoproducto", subirArchivoProd(),async (req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoProducto(req.body);
    res.redirect("/mostrarP");
});

rutaPD.get("/editarProducto/:id", async (req, res)=>{
    console.log(req.params.id);
    var product= await buscarProdID (req.params.id);
    res.render("productos/modificarP", {product});
    res.end();
});

rutaPD.post("/editarProducto", subirArchivoProd(), async (req, res)=>{
    console.log(req.body);
    req.body.foto=req.file.originalname;
    var error= await modificarProducto(req.body);
    res.redirect("/mostrarP");
});

rutaPD.get("/borrarproducto/:id", async (req, res)=>{
    /*try{
        await borrarProducto(req.params.id);
        res.redirect("/mostrarP");
    }
    catch(err){
        console.log("Error al borrar el producto "+err);
    }*/
    try {
        var producto = await buscarProductoPorID(req.params.id);
        if (!producto) {
          res.status(404).send("Usuario no encontrado.");
        } else {
          var archivo = producto.foto;
          await borrarProducto(req.params.id);
          eliminarArchivoProd(archivo)(req, res, () => {
            res.redirect("/productos");
          });
        }
      } catch (err) {
        console.log("Error al borrar usuario" + err);
        res.status(400).send("Error al borrar usuario.");
      }
});

module.exports=rutaPD;
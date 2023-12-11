var rutaN=require("express").Router();
var {mostrarNoticias, modificarNoticia, borrarNoticia, buscarNotID, nuevaNoticia}=require("../bd/noticiasBD");
var {subirArchivoNot, eliminarArchivoNot} = require("../middlewares/middlewares");
const Noticias = require("../modelos/Noticia");

rutaN.get("/api/mostrarnoticias",async(req, res)=>{
    var noticias = await mostrarNoticias();
    console.log(noticias);
    if(noticias.length==0){
        res.status(400).json("No hay ninguna noticia");
    }
    else {
        res.status(200).json(noticias);
    }
});

/*rutaPD.get("/nuevanoticia",(req, res)=>{
    res.render("productos/nuevo");
});*/

rutaN.post("/api/nuevanoticia", subirArchivoNot(),async (req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevaNoticia(req.body);
    if (error==0){
        res.status(200).json("Noticia registrada correctamente");
    }
    else {
        res.status(400).json("La Noticia no se ha podido registrar");
    }
});

/*rutaPD.post("/api/buscarProductoPorId/:id",(req,res)=>{
    console.log("kjaf");
    console.log(req.params.id);
    res.end()
});*/
            
rutaN.get("/api/buscarNotID/:id", async (req, res)=>{
    console.log(req.params.id);
    var notice= await buscarNotID (req.params.id);
    if (notice==""){
        res.status(400).json("Noticia no encontrada");
    } else{
        res.status(200).json(notice);
    }
});

rutaN.post("/api/editarNoticia", subirArchivoNot(), async (req, res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error= await modificarNoticia(req.body);
    if (error==0){
        res.status(200).json("Noticia actualizada correctamente");
    } else{
        res.status(400).json("Error al actualizar la noticia");
    }
});

rutaN.get("/api/borrarnoticia/:id", async (req, res)=>{
    /*var error = await borrarProducto(req.params.id);
    if (error==0){
        res.status(200).json("Producto borrado correctamente");
    } else{
        res.status(400).json("Error al borrar el producto");
    }*/
    try {
        var noticia = await buscarNotID(req.params.id);
        if (!noticia) {
          res.status(400).send("noticia no encontrada.");
        } else {
          var archivo = noticia.foto;
          await borrarNoticia(req.params.id);
          eliminarArchivoNot(archivo)(req, res, () => {
            res.status(200).json("Noticia borrada correctamente");
          });
        }
      } catch (err) {
        console.log("Error al borrar la noticia " + err);
        res.status(400).send("Error al borrar la noticia.");
      }
});

module.exports=rutaN;
var rutaN=require("express").Router();
var {autorizado, admin}=require("../middlewares/password");
var {mostrarNoticias, nuevaNoticia, buscarNotID, modificarNoticia, borrarNoticia, mostrarNoticiaPorID}=require("../bd/noticiasBD");
var eliminarArchivoNot = require("../middlewares/middlewares").eliminarArchivoNot;
var {subirArchivoNot} = require("../middlewares/middlewares");
const Noticias = require("../modelos/Noticia");

rutaN.get("/mostrarN", autorizado, async(req, res)=>{
    var noticias = await mostrarNoticias();
    console.log(noticias);
    res.render("noticias/mostrarN",{noticias})
});

rutaN.get("/nuevanoticia", autorizado, async(req, res)=>{
    res.render("noticias/nuevo");
});

rutaN.post("/nuevanoticia",subirArchivoNot(), async (req, res)=>{
    console.log(req.body);
    req.body.foto=req.file.filename;
    var error=await nuevaNoticia(req.body);
    res.redirect("/mostrarN");
});

rutaN.get("/editarNoticia/:id", async (req, res)=>{
    console.log(req.params.id);
    var notice= await buscarNotID (req.params.id);
    res.render("noticias/modificarN", {notice});
    res.end();
});

rutaN.post("/editarNoticia", subirArchivoNot(), async (req, res) => {
  try {
      if (req.file != null) {
          req.body.foto = req.file.filename;
      } else {
          req.body.foto = req.body.fotoAnt;
      }

      // Verificación para evitar que admin sea undefined
      if (req.body.admin === undefined) {
          req.body.admin = false; // O asigna el valor por defecto que necesites
      }

      var error = await modificarNoticia(req.body);
      res.redirect("/mostrarN");
  } catch (err) {
      console.error("Error al editar noticia:", err);
      res.status(500).send("Error interno al editar noticia.");
  }
});


/*rutaN.post("/editarNoticia", subirArchivoNot(), async (req, res)=>{
if(req.file!=null){
  req.body.foto=req.file.filename;
} else {
  req.body.foto=req.body.fotoAnt;
}
  var error= await modificarNoticia(req.body);
  res.redirect("/mostrarN");

      console.log(req.body);
    req.body.foto=req.file.originalname;
    var error= await modificarNoticia(req.body);
    res.redirect("/mostrarN");
});*/

rutaN.get("/borrarnoticia/:id", async (req, res)=>{
    /*try{
        await borrarProducto(req.params.id);
        res.redirect("/mostrarN");
    }
    catch(err){
        console.log("Error al borrar el producto "+err);
    }*/
    try {
        var noticia = await buscarNotID(req.params.id);
        if (!noticia) {
          res.status(404).send("Noticia no encontrada.");
        } else {
          var archivo = noticia.foto;
          await borrarNoticia(req.params.id);
          eliminarArchivoNot(archivo)(req, res, () => {
            res.redirect("/mostrarN");
          });
        }
      } catch (err) {
        console.log("Error al borrar la noticia" + err);
        res.status(400).send("Error al borrar la noticia.");
      }
});

rutaN.get("/foroN", async(req, res)=>{
  var noticias = await mostrarNoticias();
  console.log(noticias);
  res.render("noticias/foroN",{noticias})
});

/*rutaN.get("/noticiaN", async (req, res) => {
  try {
    // Obtener el ID de los parámetros de la URL
    const noticiaId = req.query.id;

    // Verificar que noticiaId sea una cadena no vacía
    if (!noticiaId || typeof noticiaId !== 'string') {
      res.status(400).send("ID de noticia no válido.");
      return;
    }

    // Buscar la noticia por ID
    const noticia = await buscarNotID(noticiaId);

    // Verificar si la noticia existe
    if (!noticia) {
      res.status(404).send("Noticia no encontrada.");
      return;
    }

    // Renderizar la vista de la noticia
    res.render("noticias/noticiaN", { noticia });
  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    res.status(500).send("Error interno al obtener la noticia.");
  }
});*/


//CODIGO MEDIO FUNCIONAL
rutaN.get("/noticiaN", async(req, res)=>{
  var noticias = await mostrarNoticias();
  buscarNotID();
  res.render("noticias/noticiaN",{noticias})
});


/*rutaN.get("/noticiaN", async (req, res) => {
  try {
    // Obtener el ID de los parámetros de la URL
    const noticiaId = req.query.id; // Usar req.query.id en lugar de req.params.id

    // Buscar la noticia por ID
    const noticia = await buscarNotID(noticiaId);

    // Verificar si la noticia existe
    if (!noticia) {
      res.status(404).send("Noticia no encontrada.");
      return;
    }

    // Renderizar la vista de la noticia
    res.render("noticias/noticiaN", { noticia });
  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    res.status(500).send("Error interno al obtener la noticia.");
  }
});*/

/*
rutaN.get("/noticiaN", async (req, res) => {
  try {
    // Obtener el ID de los parámetros de la URL
    const noticiaId = req.query.id;

    // Mostrar la noticia por ID
    await mostrarNoticiaPorID(noticiaId);

    // Aquí puedes redirigir o enviar una respuesta según tus necesidades
    // res.redirect("/otra-ruta"); 
    // res.send("Noticia mostrada correctamente.");

  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    res.status(500).send("Error interno al obtener la noticia.");
  }
});
*/


module.exports=rutaN;
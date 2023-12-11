var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var eliminarArchivo=require("../middlewares/middlewares").eliminarArchivos;
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario, login}=require("../bd/usuariosBD");
const { eliminarArchivoProd } = require("../middlewares/middlewares");
var {autorizado}=require("../middlewares/password");
const Usuarios = require("../modelos/Usuario");

ruta.get("/",autorizado, async(req, res)=>{
    var usuarios = await mostrarUsuarios();
    //console.log(usuarios);
    //res.end();
    res.render("usuarios/mostrar",{usuarios})
});

ruta.get("/nuevousuario",(req, res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario",subirArchivo(), async (req, res)=>{
    //console.log(req.file.originalname);
    
    req.body.foto=req.file.filename;
    //console.log(req.body);
    var error=await nuevoUsuario(req.body);
    res.redirect("/");
});

ruta.get("/editarUsuario/:id", async (req, res)=>{
    console.log(req.params.id);
    var user= await buscarporID (req.params.id);
    res.render("usuarios/modificar", {user});
    res.end();
});


//Se deja este ahhh.
ruta.post("/editarUsuario", subirArchivo(), async (req, res) => {
    try {
        if (req.file && req.file.filename) {
            req.body.foto = req.file.filename;
        } else {
            // Si no hay nuevo archivo, utiliza la imagen anterior
            req.body.foto = req.body.fotoAnterior;
        }

        // Verificación para evitar que admin sea undefined
        if (req.body.admin === undefined) {
            req.body.admin = false; // O asigna el valor por defecto que necesites
        }

        var error = await modificarUsuario(req.body);
        res.redirect("/");
    } catch (err) {
        console.error("Error al editar el usuario:", err);
        res.status(500).send("Error interno al editar usuario.");
    }
});


/*
Codigo medio bueno chatgtp
ruta.post("/editarUsuario", subirArchivo(), async (req, res) => {
    try {
        if (req.file !== null) {
            req.body.foto = req.file.filename;
        } else {
            // Si no hay nuevo archivo, utiliza la imagen anterior
            req.body.foto = req.body.fotoAnterior;
        }

        // Verificación para evitar que admin sea undefined
        if (req.body.admin === undefined) {
            req.body.admin = false; // O asigna el valor por defecto que necesites
        }

        var error = await modificarUsuario(req.body);
        res.redirect("/");
    } catch (err) {
        console.error("Error al editar el usuario:", err);
        res.status(500).send("Error interno al editar usuario.");
    }
});/*

/*
Codigo bueno hasta el momento.
ruta.post("/editarUsuario", subirArchivo(), async (req, res) => {
    try {
        if (req.file != null) {
            req.body.foto = req.file.filename;
        } else {
            req.body.foto = req.body.fotoAnterior;
        }

        // Verificación para evitar que admin sea undefined
        if (req.body.admin === undefined) {
            req.body.admin = false; // O asigna el valor por defecto que necesites
        }

        var error = await modificarUsuario(req.body);
        res.redirect("/");
    } catch (err) {
        console.error("Error al editar el usuario:", err);
        res.status(500).send("Error interno al editar usuario.");
    }
});*/


/*ruta.post("/editarUsuario", subirArchivo(), async (req, res)=>{
    console.log(req.body);
if(req.file!=null){
    req.body.foto=req.file.filename;
} else{
    req.body.foto=req.body.fotoAnterior;
}
    var error= await modificarUsuario(req.body);
    res.redirect("/");
});*/

ruta.get("/borrarusuario/:id", async (req, res)=>{
    /*try{
        await borrarUsuario(req.params.id);
        res.redirect("/");
    }
    catch(err){
        console.log("Error al borrar el usuario "+err);
    }*/
    try {
        var usuario = await buscarporID(req.params.id);
        if (!usuario) {
          res.status(400).send("Usuario no encontrado.");
        } else {
          var archivo = usuario.foto;
          await borrarUsuario(req.params.id);
          eliminarArchivo(archivo)(req, res, () => {
            res.redirect("/");
          });
        }
      } catch (err) {
        console.log("Error al borrar usuario" + err);
        res.status(400).send("Error al borrar usuario.");
      }
});

ruta.get("/login", (req, res) => {
    res.render("usuarios/login");
   });

ruta.post("/login",async(req, res)=>{
    var user=await login(req.body);
    if (user==undefined){
        res.redirect("/login");
    }
    else{
        if(user.admin){
            console.log("Administrador");
            req.session.admin=req.body.usuario;
            res.redirect("/nuevoProducto");
        }
        else {
            console.log("Usuario");
            req.session.usuario=req.body.usuario;
            res.redirect("/");
        }
    }
});

ruta.get("/logout",(req,res)=>{
    req.session=null;
    res.redirect("/login");
});

ruta.get("/registro", (req,res)=>{
    res.render("usuarios/registro");
});

module.exports=ruta;
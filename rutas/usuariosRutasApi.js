var ruta=require("express").Router();
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario}=require("../bd/usuariosBD");
const Usuarios = require("../modelos/Usuario");
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var eliminarArchivos=require("../middlewares/middlewares").eliminarArchivos;

ruta.get("/api/mostrarusuarios",async(req, res)=>{
    var usuarios = await mostrarUsuarios();
    console.log(usuarios);
    //res.end();
    //res.render("usuarios/mostrar",{usuarios})
    if( usuarios.length==0){
        res.status(400).json("No hay usuarios");
    }
    else{
        res.status(200).json(usuarios);
    }

});

//ruta.get("/nuevousuario",(req, res)=>{
//    res.render("usuarios/nuevo");
//});

ruta.post("/api/nuevoUsuario",subirArchivo(),async (req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    if (error==0) {
        res.status(200).json("Usuario registrado correctamente");
    }
    else{
        res.status(400).json("El usuario no se ha podido registrar");
    }
});

ruta.get("/api/buscarUsuarioPorId/:id", async (req, res)=>{
    //console.log(req.params.id);
    var user= await buscarporID (req.params.id);
    //res.render("usuarios/modificar", {user});
    //res.end();
    if (user==""){
        res.status(400).json("Usuario no encontrado");
    }
    else{
        res.status(200).json(user);
    }
});

ruta.post("/api/editarUsuario",subirArchivo(),async (req, res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error= await modificarUsuario(req.body);
    if (error==0) {
        res.status(200).json("Usuario actualizado correctamente");
    } else{
        res.status(400).json("Error al actualizar al usuario");
    }
});

ruta.get("/api/borrarUsuario/:id", async (req, res)=>{
    /*var error = await borrarUsuario(req.params.id);
    if (error==0) {
        res.status(200).json("Usuario borrado correctamente");
    } else{
        res.status(400).json("Error al borrar al usuario");
    }*/
    try{
        var usuario = await buscarporID(req.params.id);
        if (!usuario){
            res.status(400).send("Usuario no encontrado");
        } else{
            var archivo = usuario.foto;
            await borrarUsuario(req.params.id);
            eliminarArchivos(archivo)(req, res, () => {
                res.status(200).json("Usuario borrado");
            });
        }
    } catch (err){
        console.log("Error al buscar usuario" + err);
        res.status(200).send("Error al buscar usuario");
    }
});

module.exports=ruta;
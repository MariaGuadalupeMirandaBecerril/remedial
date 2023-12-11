var conexionu=require("./conexion").conexionu;
const { generarPassword } = require("../middlewares/password");
var Usuario=require("../modelos/Usuario");
const { compile } = require("ejs");

async function mostrarUsuarios(){
    console.log("Hola mundo");
    var users=[];
    try{
        var usuarios=await conexionu.get();
       // console.log(usuarios);
        usuarios.forEach((usuario)=>{
            var usuario1=new Usuario(usuario.id, usuario.data());
            //console.log(usuario1);
            if(usuario1.bandera==0){
                users.push(usuario1.obtenerUsuario);
            }
        });
    }
    catch(err){
        console.log("Error al obtener los usuarios de firebase"+err);
        //users.push(null);
    }
    return users;
}

async function buscarporID(id){ //Aqui se puede cambiar lo de buscarporID(datos).
    var user;
    try{
        var usuariobd=await conexionu.doc(id).get();
        //var {usuarios}=await conexion.where("usuario","==",datos.usuario).get(); campo para buscar usuario ("==" compara usuario con datos.usuario).
        var usuarioObjeto=new Usuario(usuariobd.id,usuariobd.data());
        if(usuarioObjeto.bandera==0){
            user=usuarioObjeto.obtenerUsuario;
        }
    }
    catch(err){
        console.log("Error al buscar al usuario "+err);
        user=null;
    }
    return user;
}

async function nuevoUsuario(datos){
    //console.log(datos);
    var {salt, hash}=generarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;
    datos.admin=false;
    var usuario=new Usuario(null,datos);
    var error=1;
    if(usuario.bandera==0){
        try{
            await conexionu.doc().set(usuario.obtenerUsuario);
            console.log("Usuario registrado correctamente");
            error=0;
        } 
        catch(err){
            console.log("Error al registrar al usuario "+err);
        }
    }
    return error;
}

async function modificarUsuario(datos){
var user = await buscarporID(datos.id);
var error=1;
if (user!=undefined){
    if(datos.password==""){
        datos.password=user.password;
        datos.salt=user.salt;
    } else{
        var {salt, hash}=generarPassword(datos.password);
        datos.password=hash;
        datos.salt=salt;
    }
    var usuario=new Usuario(datos.id, datos);
    if(usuario.bandera==0){
        try{
            await conexionu.doc(usuario.id).set(usuario.obtenerUsuario);
            console.log("Usuario actualizado correctamente");
            error=0;
        }
        catch(err){
            console.log("Error al modificar al usuario "+err);
        }
    }
}
    else{
        console.log("Los datos no son correctos");
    }
    return error;
}

async function borrarUsuario(id){
    var error=1;
    var user = await buscarporID(id);
    if (user!=undefined){
        try{
            await conexionu.doc(id).delete().DeleteFile("/web/images");
            console.log("Usuario Borrado");
            error=0;
        }
        catch(err){
            console.log("Error al borrar el usuario "+err);
        }
    }
    return error;
}

async function login(datos){
    var user=undefined;
    var usuarioObjeto;
    try{
        var user=await conexionu.where('usuario', '==',datos.usuario).get();
        if (user.docs.length==0){
            return undefined;
        }
        usuario.docs.filter((doc)=>{
            var validar=validarPassword(datos.password,doc.data().password,doc.data().salt);
            if (validar){
                usuarioObjeto=new Usuario(doc.id,doc.data());
                if (usuarioObjeto.bandera==0){
                    user=usuarioObjeto.obtenerDatos;
                }
            }else
            return undefined;
        });
    }
    catch(err){
        console.log("Error al obtener usuario"+err);
    }
    return user;
}

module.exports={
    mostrarUsuarios,
    buscarporID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario,
    login
}
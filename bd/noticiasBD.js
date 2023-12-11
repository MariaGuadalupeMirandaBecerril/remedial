var conexionN=require("./conexion").conexionN;
var Noticia=require("../modelos/Noticia");
//const { compile } = require("ejs");

async function mostrarNoticias(){
    console.log("Hola mundo");
    var notices=[];
    try{
        var noticias=await conexionN.get();
        noticias.forEach((noticia)=>{
            var noticia1=new Noticia(noticia.id, noticia.data());
            if(noticia1.bandera==0){
                notices.push(noticia1.obtenerNoticia);
            }
        });
    }
    catch(err){
        console.log("Error al obtener las noticias "+err);
    }
    return notices;
}

async function buscarNotID(id){
    var notice;
    try{
        var noticiabd=await conexionN.doc(id).get();
        var noticiaObjeto=new Noticia(noticiabd.id,noticiabd.data());
        if(noticiaObjeto.bandera==0){
            notice=noticiaObjeto.obtenerNoticia;
        }
    }
    catch(err){
        console.log("Error al buscar la noticia "+err);
        notice=null;
    }
    return notice;
}

async function nuevaNoticia(datos){
    var noticia=new Noticia(null,datos);
    var error=1;
    if(noticia.bandera==0){
        try{
            await conexionN.doc().set(noticia.obtenerNoticia);
            console.log("Noticia registrada correctamente");
            error=0;
        } 
        catch(err){
            console.log("Error al registrar la noticia "+err);
        }
    }
    return error;
}

async function modificarNoticia(datos){
    var noticia=new Noticia(datos.id, datos);
    var error=1;
    if(noticia.bandera==0){
        try{
            await conexionN.doc(noticia.id).set(noticia.obtenerNoticia);
            console.log("Noticia actualizada correctamente");
            error=0;
        }
        catch(err){
            console.log("Error al modificar la noticia "+err);
        }
    }
    else{
        console.log("Los datos no son correctos");
    }
    return error;
}

async function borrarNoticia(id){
    var error=1;
    try{
        await conexionN.doc(id).delete();
        console.log("Noticia Borrada");
        error=0;
    }
    catch(err){
        console.log("Error al borrar la noticia "+err);
    }
    return error;
}

/*async function mostrarNoticiaPorID(id){
    try{
        // Validar que noticiaId sea una cadena no vacía
        if (!id || typeof id !== 'string') {
        console.error("ID de noticia no válido:", id);
        return;
        }

        var noticiabd = await conexionN.doc(id).get();
        var noticiaObjeto = new Noticia(noticiabd.id, noticiabd.data());
        if(noticiaObjeto.bandera === 0){
            // Aquí puedes hacer algo con la noticia, como mostrarla directamente
            console.log("Noticia encontrada:", noticiaObjeto.obtenerNoticia);
        } else {
            console.log("Noticia no encontrada o marcada como eliminada.");
        }

    } catch(err){
        console.log("Error al buscar o mostrar la noticia:", err);
    }
}*/

module.exports={
    mostrarNoticias,
    buscarNotID,
    nuevaNoticia,
    modificarNoticia,
    borrarNoticia
    //mostrarNoticiaPorID
}
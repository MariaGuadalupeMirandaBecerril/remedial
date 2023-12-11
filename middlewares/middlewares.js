var multer=require("multer");
var fs = require("fs");

//Usuarios

function subirArchivo(){
    var storage=multer.diskStorage({
        destination: './web/images',
        filename: (req,file,cb)=>{
            console.log(file.originalname);
            var archivo= Date.now()+file.originalname;
            cb(null,archivo);
        }
    });
    return multer({storage}).single('foto');
}

function eliminarArchivos(archivo){
    return async (req, res, next) => {
        try{
            fs.unlinkSync(`./web/images/${archivo}`);
            next();
        } catch (err){
            console.error("Error al eliminar el archivo: " + err);
            res.status(500).send("Error al eliminar el archivo.");
        }
    }
}

//Productos

function subirArchivoProd(){
    var storage= multer.diskStorage({
        destination: './web/imagesProd',
        filename: (req,file,cb)=>{
            console.log(file.originalname);
            var archivoProd = file.originalname;
            cb(null,archivoProd);
        }
    });
    return multer({storage}).single('foto');
}

function eliminarArchivoProd(archivo) {
    return async (req, res, next) => {
      try {
        fs.unlinkSync(`./web/imagesProd/${archivo}`);
        next();
      } catch (err) {
        console.error("Error al eliminar el archivo de Producto: " + err);
        res.status(500).send("Error al eliminar el archivo de Producto");
      }
    };
}

//Noticias

function subirArchivoNot(){
    var storage= multer.diskStorage({
        destination: './web/imagesNot',
        filename: (req,file,cb)=>{
            console.log(file.originalname);
            var archivoNot = Date.now()+file.originalname;
            cb(null,archivoNot);
        }
    });
    return multer({storage}).single('foto');
}

function eliminarArchivoNot(archivo) {
    return async (req, res, next) => {
      try {
        fs.unlinkSync(`./web/imagesNot/${archivo}`);
        next();
      } catch (err) {
        console.error("Error al eliminar el archivo de Noticia: " + err);
        res.status(500).send("Error al eliminar el archivo de Noticia");
      }
    };
}

module.exports={
    subirArchivo,
    eliminarArchivos,
    subirArchivoProd,
    eliminarArchivoProd,
    subirArchivoNot,
    eliminarArchivoNot
}
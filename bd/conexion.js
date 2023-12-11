var admin=require("firebase-admin")
var keys = require("../ejemplo1-f5fc5-firebase-adminsdk-fxboc-a4fa34263e.json")

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var db=admin.firestore();
var bdpd=admin.firestore();
var bdn=admin.firestore();

var conexionu=db.collection("miejemploBD");
//console.log(conexion.get());
var conexionP=bdpd.collection("ProductosBD");
var conexionN=bdn.collection("NoticiasBD")

module.exports={
    conexionu, 
    conexionP,
    conexionN
};
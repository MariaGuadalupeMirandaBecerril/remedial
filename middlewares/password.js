var crypto = require("crypto");
const Productos = require("../modelos/Producto");

function generarPassword(password){
	 var salt=crypto.randomBytes(32).toString("hex");
	var hash=crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString("hex");
	return{
	salt,
	hash	
	}
}

function validarPassword(password, hash, salt){
	var hasValidar=crypto.scriptSync(password, salt, 100000, 64, 'sha512').toString("hex");
	return hashValidar===hash
}

function autorizado(req,res,siguiente){
	console.log("usuario autorizado");
	if(req.session.usuario || req.session.admin){
		siguiente();
	}
	else{
		res.redirect("/login");
	}
}

function admin(req,res,siguiente){
	console.log("Administrador autorizado");
	if(req.session.admin){	
		siguiente();
	}
	else{
		if(req.session.usuario){
			res.redirect("/");
		}
		else{
			res.redirect("/login");
		}
	}
}

/*
//004
function admin(req,res,siguiente){
    console.log("administrador autorizado");
    if(req.session.admin){
        siguiente();
    }else{
        if(req.session.usuario){
            res.redirect("/");
        }else{
            res.redirect("/login");
        }
    } 
}*/

/*function admin(req, res, siguiente) {
    console.log("Administrador autorizado");
    if (req.session.admin) {
        res.render("productos/nuevo");
    } else if (req.session.usuario) {
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
}*/


/*var {salt, hash}=generarPassword("abc");
console.log(salt);
console.log(hash);
console.log(validarPassword("abc", hash, salt);*/

module.exports={
	generarPassword,
	validarPassword,
	autorizado,
	admin
}
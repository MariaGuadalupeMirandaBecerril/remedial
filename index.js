var express=require("express");
var path=require("path");
var cors=require("cors");
var session=require("cookie-session");
var usuariosRutas=require("./rutas/usuariosRutas");
var productoRutas=require("./rutas/productosRutas");
var noticiasRutas=require("./rutas/noticiasRutas");
var rutasUsuariosApis=require("./rutas/usuariosRutasApi");
var rutasProductosApis=require("./rutas/productosRutasApi");
var rutasNoticiasApis=require("./rutas/noticiasRutasApi");
var noticiaN=require("./rutas/noticiasRutas");
require("dotenv").config();
const cookieSession = require('cookie-session');

var app=express();
app.set("view engine","ejs");
app.use(cors());
app.use(session({
    name:"session",
    keys:["comacomacoma"],
    maxAge:24*60*60*1000
}));
app.use(express.urlencoded({extended:true}));
app.use("/", express.static(path.join(__dirname,"/web")));
app.use("/", usuariosRutas);
app.use("/",productoRutas);
app.use("/", noticiasRutas);
app.use("/", rutasUsuariosApis);
app.use("/", rutasProductosApis);
app.use("/", rutasNoticiasApis);
app.use("/", noticiaN);

app.use(session({
    secret:process.env.SESSION_SECRETO,
    resave:true,
    saveUninitialized:true
}));

var port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
});
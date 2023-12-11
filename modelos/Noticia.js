class Noticias{
    
    constructor(id, data){
        this.bandera=0;
        this.id=id;
        this.titulo=data.titulo;
        this.fecha=data.fecha;
        this.contenido=data.contenido;
        this.foto=data.foto;
    }
    set id(id){
        if(id!=null)
        id.length>0?this._id=id:this.bandera=1;
    }
    set titulo(titulo){
        titulo.length>0?this._titulo=titulo:this.bandera=1;
    }
    set fecha(fecha){
        fecha.length>0?this._fecha=fecha:this.bandera=1;
    }
    set contenido(contenido){
        contenido.length>0?this._contenido=contenido:this.bandera=1;
    }
    set foto(foto){
        foto.length>0?this._foto=foto:this.bandera=1;
    }

    get id(){
        return this._id;
    }

    get titulo(){
        return this._titulo;
    }

    get fecha(){
        return this._fecha;
    }

    get contenido(){
        return this._contenido;
    }

    get foto(){
        return this._foto;
    }

    get obtenerNoticia(){
        if(this._id==null){
            return {
                titulo:this.titulo,
                fecha:this.fecha,
                contenido:this.contenido,
                foto:this.foto
            }
        }
        else{
            return {
                id:this.id,
                titulo:this.titulo,
                fecha:this.fecha,
                contenido:this.contenido,
                foto:this.foto
            }
        }

    }
}

module.exports=Noticias;
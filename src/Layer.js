var gk = (function(gk){

    function Layer(args){
        this.color = args.color;
        this.locked = args.locked || false;
        this.visible = args.visible || ;
        this.items = args.collection || new Collection();
    }
    
    this.prototype.draw = function(options){
        this.ctx = options.ctx;
        this.items.draw(this);   
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});

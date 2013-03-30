var gk = (function(gk){

    function Layer(args){
        args = args || {
            locked: false
            ,visible: true
        };
        this.color = args.color;
        this.locked = args.locked;
        this.visible = args.visible;
        this.items = args.collection || new gk.Collection({});
    }
    
    Layer.prototype.draw = function(options){
        this.ctx = options.ctx;
        this.items.draw(this);   
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});

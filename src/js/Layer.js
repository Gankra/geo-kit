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
    
    Layer.prototype.insert = function(item){
        this.items.push(item);
    }
    
    Layer.prototype.getSelectionAt = function(mouse){
        if(!this.isSelectable()){
            for(var item in items){
                if(item.tryToSelect(mouse)){
                    return item;
                }
            }
        }
        return null;
    }
    
    Layer.prototype.isSelectable = function(){
        return !this.locked && this.visible;
    }
    
    Layer.prototype.draw = function(options){
        this.ctx = options.ctx;
        this.items.draw(this);   
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});

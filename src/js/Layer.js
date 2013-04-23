var gk = (function(gk){

    function Layer(args){
        args = args || {
            locked: false
            ,visible: true
        };
        this.color = args.color;
        this.locked = args.locked;
        this.visible = args.visible;
        this.items = args.collection || new gk.Collection();
    }
    
    Layer.prototype.insert = function(item){
        this.items.add(item);
    }
    
    Layer.prototype.getSelectionAt = function(mouse, options){
        if(this.isSelectable()){
            for(var i=0; i<this.items.length; ++i){
                var item = this.items.get(i);
                if(item.tryToSelect(mouse, options)){
                    return item;
                }
            }
        }
        return null;
    }
    
    Layer.prototype.tryToSnap = function(mouse, options){
        if(this.isSelectable()){
            for(var i=0; i<this.items.length; ++i){
                var item = this.items.get(i);
                if(!options.snapSelected && gk.isSelected(item)){
                    continue;
                }
                var snap = item.tryToSnap(mouse, options);
                if(snap){
                    return snap;
                }
            }
        }
        return null;
    }
    
    Layer.prototype.isSelectable = function(){
        return !this.locked && this.visible;
    }
    
    Layer.prototype.draw = function(options){
        if(this.visible){
            this.items.draw(_.defaults({}, options, this));
        }   
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});

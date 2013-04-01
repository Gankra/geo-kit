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
            for(var item in this.items){
                if(item.tryToSelect(mouse, options)){
                    return item;
                }
            }
        }
        return null;
    }
    
    Layer.prototype.tryToSnap = function(mouse, options){
        if(this.isSelectable()){
            for(var item in this.items){
                if(gk.isSelected(item)){
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
            this.ctx = options.ctx;
            this.items.draw(this);
        }   
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});

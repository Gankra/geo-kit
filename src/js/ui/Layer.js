var gk = (function(gk){
    var Set = gk.Set;

    var DEFAULT_COLORS = ["#000000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"];
    var defaultColorCounter = 0;
    var layerNumberCounter = 1;

    function Layer(args){
        args = args || {};
        args = _.defaults(args, {
            locked: false
          , visible: true
          , linked: false
        });
        this.color = args.color || DEFAULT_COLORS[(defaultColorCounter++)%DEFAULT_COLORS.length];
        this.locked = args.locked;
        this.visible = args.visible;
        this.linked = args.linked;
        this.id = layerNumberCounter++;
        this.name = (args.name || "Layer")+this.id;
        this.items = args.collection || new Set();
    }
    
    Layer.prototype.insert = function(item){
        this.items.add(item);
    }
    
    Layer.prototype.remove = function(item){
        this.items.remove(item);
    }
    
    Layer.prototype.getSelectionAt = function(mouse, options){
        if(this.isSelectable()){
            var it = this.items.iterator();
            while(it.hasNext()){
                var item = it.next();
                if(item.tryToSelect(mouse, options)){
                    return item;
                }
            }
        }
        return null;
    }

    Layer.prototype.getSelectionInBox = function(box, options){
        var set = new Set();
        if(this.isSelectable()){
            var it = this.items.iterator();
            while(it.hasNext()){
                var item = it.next();
                if(item.tryToSelectFromBox(box, options)){
                    set.add(item);
                }
            }
        }
        return set;
    }
    
    Layer.prototype.tryToSnap = function(mouse, options){
        if(this.isSelectable()){
            var it = this.items.iterator();
            while(it.hasNext()){
                var item = it.next();
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

    Layer.prototype.toggleLock = function(){
        this.locked = !this.locked;
    }

    Layer.prototype.toggleVisible = function(){
        this.visible = !this.visible;
    }

    Layer.prototype.unlink = function(){
        this.items.forEach(function(item){
            item.unregisterMapping();
        });
    }
    
    gk.Layer = Layer;

    return gk;
})(gk || {});

var gk = (function(gk){

    function Collection(args){
        args = args || {};
        this.items = args.items || [];
        gk.Drawable.call(this);
    }
    
    Collection.prototype = new gk.Drawable();
    
    Collection.prototype.splice = function(){
        return this.items.splice.apply(this.items, arguments);
    }
    
    Collection.prototype.remove = function(item){
        this.items.splice(this.items.indexOf(item), 1);
    }
    
    Collection.prototype.clear = function(){
        this.items = [];
    }
    
    Collection.prototype.add = function(item){
        return this.items.push(item);
    }
    
    Collection.prototype.addAll = function(collection){
        for(var i=0; i<collection.length; ++i){
            this.add(collection.get(i));
        }    
    }
    
    Collection.prototype.clone = function(){
        var clone = new Collection();
        clone.addAll(this);
        return clone;
    }
    
    Collection.prototype.__defineGetter__("length", function(){
        return this.items.length;
    });
    
    Collection.prototype.get = function(index){
        return this.items[index];
    }
    
    Collection.prototype.draw = function(options){
        for(var i=0; i<this.length; ++i){
            this.get(i).draw(options);
        }
    }
    
    Collection.prototype.tryToSnap = function(mouse, options){
        for(var i=0; i<this.length; ++i){
            var snap = this.get(i).tryToSnap(mouse, options);
            if(snap){
                return snap;
            }
        }
        return null;
    }
    
    Collection.prototype.tryToSelect = function(mouse, options){
        if(this.parentCollection){
            return false;
        }
        for(var i=0; i<this.length; ++i){
            if(this.get(i).tryToSelect(mouse, options)){
                return true;
            }
        }
        return false;        
    }
    
    Collection.prototype.updateMouse = function(oldMouse, curMouse){
        for(var i=0; i<this.length; ++i){
            this.get(i).updateMouse(oldMouse, curMouse); 
        }
    }
    
    Collection.prototype.registerMapping = function(parentCollection, parentMap){
        this.parentCollection = parentCollection;
        this.parentMap = parentMap;
        gk.registerListener(this, parentCollection);
    }
    
    Collection.prototype.trigger = function(obj, data){
        if(this.parentCollection && this.parentMap){
            this.parentMap.manipulate(this.parentCollection, this, data);
        }
    }
    
    Collection.prototype.replaceItems = function(collection, src){
        this.items = collection.items;
        gk.emit(this, {
            event: gk.EVENT_REPLACED
        });
    }
    
    /* Can't use this outside firefox... sad... 
    Collection.prototype.__iterator__ = function(){
        for(var i=0; i<this.items.length; ++i){
            yield this.items[i];
        }
    }*/
    
    gk.Collection = Collection;

    return gk;
})(gk || {});

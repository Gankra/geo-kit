var gk = (function(gk){
    var abstract = function(){
        console.warn("Unimplemented abstract method of Collection");
    }

    function Collection(){}
    
    Collection.prototype = new gk.Drawable();

    Collection.prototype.add = abstract;
    Collection.prototype.remove = abstract;
    Collection.prototype.iterator = abstract;
    Collection.prototype.replaceItems = abstract;
    Collection.prototype.emptyInstance = abstract;
    Collection.prototype.clear = abstract;
    
    Collection.prototype.removeAll = function(items){
        var self = this;
        items.forEach(function(item){
            self.remove(item);
        });
    }

    Collection.prototype.addAll = function(items){
        var self = this;
        items.forEach(function(item){
            self.add(item);
        });
    }

    Collection.prototype.forEach = function(fn){
        var it = this.iterator();
        while(it.hasNext()){
            fn(it.next());
        }
    }  
    
    Collection.prototype.draw = function(options){
        this.forEach(function(item){
            item.draw(options);
        });
    }

    Collection.prototype.contains = function(item){
        var it = this.iterator();
        while(it.hasNext()){
            if(it.next(equals(item))){
                return true;
            }
        }
        return false;
    }

    Collection.prototype.clone = function(deep){
        var clone = this.emptyInstance();
        if(deep){
            this.forEach(function(item){
                clone.add(item.clone(deep));
            });
        }else{
            clone.addAll(this);    
        }
        return clone;
    }

    Collection.prototype.toArray = function(){
        var result = [];
        var it = this.iterator();
        while(it.hasNext()){
            result.push(it.next());
        }
        return result;
    }
    
    Collection.prototype.tryToSnap = function(mouse, options){
        var it = this.iterator();
        while(it.hasNext()){
            var item = it.next();
            var snap = item.tryToSnap(mouse, options);
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
        var it = this.iterator();
        while(it.hasNext()){
            var item = it.next();
            if(item.tryToSelect(mouse, options)){
                return true;
            }
        }
        return false;        
    }
    
    Collection.prototype.updateMouse = function(oldMouse, curMouse){
        this.forEach(function(item){
            item.updateMouse(oldMouse, curMouse); 
        });
    }
    
    Collection.prototype.registerMapping = function(parentCollection, parentMap){
        this.parentCollection = parentCollection;
        this.parentMap = parentMap;
        gk.registerListener(this, parentCollection);
    }
    
    Collection.prototype.handleEvent = function(obj, data){
        if(this.parentCollection && this.parentMap){
            this.parentMap.manipulate(this.parentCollection, this, data);
        }
    }

    gk.Collection = Collection;

    return gk;
})(gk || {});

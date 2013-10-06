var gk = (function(gk){
    var events = gk.events;
    var Drawable = gk.Drawable;

    var abstract = function(){
        console.warn("Unimplemented abstract method of Collection");
    }

    function Collection(){}
    
    Collection.prototype = new Drawable();

    Collection.prototype.add = abstract;
    Collection.prototype.remove = abstract;
    Collection.prototype.iterator = abstract;
    Collection.prototype.emptyInstance = abstract;
    Collection.prototype._replaceItems = abstract;
    Collection.prototype._clear = abstract;

    Collection.prototype._registerAddition = function(item){
        if(!this._handlingChildEvents) return;
        events.registerListener(this, item);
        events.emit(this, events.getDefaultEvent(events.EVENT_UPDATED));
    }

    Collection.prototype._registerRemoval = function(item){
        if(!this._handlingChildEvents) return;
        events.unregisterListener(this, item);
        events.emit(this, events.getDefaultEvent(events.EVENT_UPDATED));
    }
    
    Collection.prototype._registerAdditions = function(items){
        if(!this._handlingChildEvents) return;
        var self = this;
        items.forEach(function(item){
            events.registerListener(self, item);
        });
        events.emit(this, events.getDefaultEvent(events.EVENT_UPDATED));
    }

    Collection.prototype._registerRemovals = function(items){
        if(!this._handlingChildEvents) return;
        var self = this;
        items.forEach(function(item){
            events.unregisterListener(self, item);
        });
        events.emit(this, events.getDefaultEvent(events.EVENT_UPDATED));
    }

    Collection.prototype.replaceItems = function(collection, src){
        var items = this.toArray();
        this._replaceItems(collection);
        this._registerRemovals(items);
    }

    Collection.prototype.clear = function(){
        var items = this.toArray();
        this._clear();
        this._registerRemovals(items);
    }

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
        events.registerListener(this, parentCollection);
    }

    Collection.prototype.unregisterMapping = function(){
        if(!this.parentCollection) return;
        
        events.unregisterListener(this, this.parentCollection);
        delete this.parentCollection;
        delete this.parentMap;
    }
    
    Collection.prototype.handleEvent = function(obj, data){
        if(this.parentCollection && this.parentMap && obj==this.parentCollection){
            this.parentMap.manipulate(this.parentCollection, this, data);
        }else{
            events.emit(this, events.getDefaultEvent(events.EVENT_UPDATED));
        }
    }

    Collection.prototype.handleChildEvents = function(){
        if(this._handlingChildEvents) return;
        var self = this;
        this.forEach(function(item){
            events.registerListener(self, item);
        });
        this._handlingChildEvents = true;
    }

    Collection.prototype.ignoreChildEvents = function(){
        if(!this._handlingChildEvents) return;
        var self = this;
        this.forEach(function(item){
            events.unregisterListener(self, item);
        });
        this._handlingChildEvents = false;
    }

    gk.Collection = Collection;

    return gk;
})(gk || {});

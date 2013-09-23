var gk = (function(gk){

    function Set(collection){
        this.items = {};

        if(collection){
            this.addAll(collection);
        }
    }
    
    Set.prototype = new gk.Collection();

    Set.prototype.keyName = "uid";
    
    Set.prototype.emptyInstance = function(){
        return new Set();
    }

    Set.prototype.remove = function(item){
        delete this.items[item[this.keyName]];
        gk.emit(this, gk.getDefaultEvent(gk.EVENT_UPDATED));
    }
    
    Set.prototype.add = function(item){
        this.items[item[this.keyName]] = item;
        gk.emit(this, gk.getDefaultEvent(gk.EVENT_UPDATED));
    }

    Set.prototype.clear = function(){
        this.items = {};
        gk.emit(this, gk.getDefaultEvent(gk.EVENT_UPDATED));
    }
    
    Set.prototype.contains = function(item){
        return !!this.items[item[this.keyName]];
    }

    Set.prototype.__defineGetter__("length", function(){
        return Object.keys(this.items).length;
    });
    
    Set.prototype.replaceItems = function(collection, src){
        this.items = collection.items;
        gk.emit(this, gk.getDefaultEvent(gk.EVENT_REPLACED));
    }

    Set.prototype.iterator = function(_index, _keys){
        var index = _index || 0;
        var self = this;
        var keys = _keys || Object.keys(this.items);
        return {
            next: function(){
                return self.items[keys[index++]];
            }
          , hasNext: function(){
                return index<keys.length;
            }
          , prev: function(){
                return self.item[keys[index--]];
            }
          , hasPrev: function(){
                return index>0;
            }
          , clone: function(){
                return self.iterator(index, keys);
            }
        }
    }
    
    gk.Set = Set;


    /**
     * StrictSet uses hashCode instead of uid
     */

    function StrictSet(collection){
        Set.call(this, collection);
    }

    StrictSet.prototype = new Set();

    StrictSet.prototype.keyName = "hashCode"

    StrictSet.prototype.getMatch = function(item){
        return this.items[item[this.keyName]];
    }

    gk.StrictSet = StrictSet;

    return gk;
})(gk || {});

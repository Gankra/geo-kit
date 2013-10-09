var gk = (function(gk){
    var LinkedList = gk.LinkedList;

    function LinkedHashSet(collection){
        this._items = {};
        this._list = new LinkedList();

        if(collection){
            this.addAll(collection);
        }
    }
    
    LinkedHashSet.prototype = new gk.Collection();

    LinkedHashSet.prototype.displayName = "LinkedHashSet";
    LinkedHashSet.prototype.keyName = "uid";

    LinkedHashSet.prototype._getHash = function(item){
        return item[this.keyName];
    }
    
    LinkedHashSet.prototype.emptyInstance = function(){
        return new LinkedHashSet();
    }

    LinkedHashSet.prototype.remove = function(item){
        if(!this.contains(item)) return;

        var node = this._items[this._getHash(item)];
        this._list._remove(node);
        delete this._items[this._getHash(item)];
        this._registerRemoval(item);
    }
    
    LinkedHashSet.prototype.add = function(item){
        if(this.contains(item)) return;

        this._list.add(item);
        this._items[this._getHash(item)] = this._list._lastNode();
        this._registerAddition(item);
    }

    LinkedHashSet.prototype._clear = function(){
        this._items = {};
        this._list.clear();
    }
    
    LinkedHashSet.prototype.contains = function(item){
        return !!this._items[this._getHash(item)];
    }

    LinkedHashSet.prototype.__defineGetter__("length", function(){
        return this._list.length;
    });
    
    LinkedHashSet.prototype._replaceItems = function(collection){
        this._items = collection._items;
        this._list.replaceItems(collection._list);
    }

    LinkedHashSet.prototype.iterator = function(_it){
        var it = _it || this._list.iterator();
        var self = this;
        return {
            next: function(){
                return it.next();
            }
          , hasNext: function(){
                return it.hasNext();
            }
          , prev: function(){
                return it.prev();
            }
          , hasPrev: function(){
                return it.hasPrev();
            }
          , clone: function(){
                return self.iterator(it.clone());
            }
        }
    }
    
    gk.LinkedHashSet = LinkedHashSet;

    /**
     * StrictLinkedHashSet uses hashCode instead of uid
     */

    function StrictLinkedHashSet(collection){
        LinkedHashSet.call(this, collection);
    }

    StrictLinkedHashSet.prototype = new LinkedHashSet();

    StrictLinkedHashSet.prototype.keyName = "hashCode"

    StrictLinkedHashSet.prototype.getMatch = function(item){
        return this._items[this._getHash(item)];
    }

    gk.StrictLinkedHashSet = StrictLinkedHashSet;

    return gk;
})(gk || {});

var gk = (function(gk){

    function List(collection){
        this._dummy = {};
        this._dummy.next = this._dummy;
        this._dummy.prev = this._dummy;
        this.length = 0;

        if(collection){
            this.addAll(collection);
        }
    }
    
    List.prototype = new gk.Collection();

    List.prototype.emptyInstance = function(){
        return new List();
    }
    
    List.prototype.remove = function(item){
        var curNode = this._dummy;
        while(curNode.next != this._dummy){
            if(curNode.item.equals(item)){
                this._remove(node);
                return;
            }
        }
    }

    List.prototype._remove = function(curNode){
        curNode.next.prev = curNode.prev.next;
        curNode.prev.next = curNode.next.prev;
        --this.length;
        this._registerRemoval(curNode.item);
    }
    
    List.prototype.add = function(item){
        var curNode = this._dummy;
        var newNode = {};
        newNode.item = item;
        this._add(curNode, newNode);
    }

    List.prototype._add = function(curNode, newNode){
        newNode.prev = curNode.prev;
        curNode.prev.next = newNode;
        newNode.next = curNode;
        curNode.prev = newNode;
        ++this.length;
        this._registerAddition(curNode.item);
    }

    List.prototype.push = List.prototype.add;

    List.prototype.pop = function(){
        if(this.length == 0) return;
        this._dummy.prev = this._dummy.prev.prev;
        this._dummy.prev.next = this._dummy;
        --this.length;
    }

    List.prototype._lastNode = function(){
        if(this.length == 0) return null;
        return this._dummy.prev;
    }

    List.prototype._clear = function(){
        this._dummy.next = this._dummy.prev = this._dummy;
        this.length = 0;
    }
    
    List.prototype._replaceItems = function(collection, src){
        this._dummy = collection.dummy;
        this.length = collection.length;
    }

    List.prototype.iterator = function(_curNode){
        var curNode = _curNode || this._dummy;
        var self = this;
        return {
            next: function(){
                curNode = curNode.next;
                return curNode.item;
            }
          , hasNext: function(){
                return curNode.next != self._dummy;
            }
          , prev: function(){
                curNode = curNode.prev;
                return curNode.item;
            }
          , hasPrev: function(){
                return curNode.prev != self._dummy;
            }
          , remove: function(){
                self._remove(curNode);
            }
          , add: function(item){
                var newNode = {};
                newNode.item = item;
                self._add(curNode, newNode);
            }
          , clone: function(){
                return self.iterator(curNode);
            }
        }
    }
    
    gk.List = List;
    gk.LinkedList = List;

    return gk;
})(gk || {});

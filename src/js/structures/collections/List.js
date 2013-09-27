var gk = (function(gk){

    function List(collection){
        this.dummy = {};
        this.dummy.next = this.dummy;
        this.dummy.prev = this.dummy;
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
        var curNode = this.dummy;
        while(curNode.next != this.dummy){
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
        this.registerRemoval(curNode.item);
    }
    
    List.prototype.add = function(item){
        var curNode = this.dummy;
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
        this.registerAddition(curNode.item);
    }

    List.prototype._clear = function(){
        this.dummy.next = this.dummy.prev = this.dummy;
        this.length = 0;
    }
    
    List.prototype._replaceItems = function(collection, src){
        this.dummy = collection.dummy;
        this.length = collection.length;
    }

    List.prototype.iterator = function(_curNode){
        var curNode = _curNode || this.dummy;
        var self = this;
        return {
            next: function(){
                curNode = curNode.next;
                return curNode.item;
            }
          , hasNext: function(){
                curNode.next != this.dummy;
            }
          , prev: function(){
                curNode = curNode.prev;
                return curNode.item;
            }
          , hasPrev: function(){
                curNode.prev != this.dummy;
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

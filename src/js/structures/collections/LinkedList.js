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

    List.prototype.displayName = "LinkedList";

    List.prototype.emptyInstance = function(){
        return new List();
    }

    List.prototype.pushBack = function(item){
        var curNode = this._dummy;
        var newNode = {};
        newNode.item = item;
        this._add(curNode, newNode);
    }

    List.prototype.pushFront = function(item){
        var curNode = this._dummy.next;
        var newNode = {};
        newNode.item = item;
        this._add(curNode, newNode);
    }

    List.prototype.add = List.prototype.pushBack;

    List.prototype._add = function(curNode, newNode){
        newNode.prev = curNode.prev;
        curNode.prev.next = newNode;
        newNode.next = curNode;
        curNode.prev = newNode;
        ++this.length;
        this._registerAddition(curNode.item);
    }

    List.prototype.popBack = function(){
        return this._remove(this._dummy.prev);
    }

    List.prototype.popFront = function(){
        return this._remove(this._dummy.prev);
    }
    
    List.prototype.remove = function(item){
        var curNode = this._dummy;
        while(curNode.next != this._dummy){
            if(curNode.item.equals(item)){
                this._remove(node);
                return item;
            }
        }
    }

    List.prototype._remove = function(curNode){
        if(curNode == this._dummy) return null;
        curNode.next.prev = curNode.prev.next;
        curNode.prev.next = curNode.next.prev;
        --this.length;
        this._registerRemoval(curNode.item);
        return curNode.item;
    }

    List.prototype.front = function(){
        if(this.length == 0) return null;
        return this._dummy.next.item;
    }

    List.prototype.back = function(){
        if(this.length == 0) return null;
        return this._dummy.prev.item;
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



    // Stack is a functional subset of Deque
    var Stack = function(collection){
        List.call(this, collection);
    }

    Stack.prototype = new List();

    Stack.prototype.displayName = "Stack";
    Stack.prototype.push = List.prototype.pushBack;
    Stack.prototype.pop = List.prototype.popBack;
    Stack.prototype.peek = List.prototype.back;
    Stack.prototype.add = Stack.prototype.push;



    //Queue is a functional subset of Deque
    var Queue = function(collection){
        List.call(this, collection);
    }

    Queue.prototype = new List();

    Queue.prototype.displayName = "Queue";
    Queue.prototype.push = List.prototype.pushFront;
    Queue.prototype.pop = List.prototype.popBack;
    Queue.prototype.peek = List.prototype.back;
    Queue.prototype.add = Queue.prototype.push;

    gk.List = List;
    gk.LinkedList = List;
    gk.Deque = List;
    gk.Stack = Stack;
    gk.Queue = Queue;

    return gk;
})(gk || {});

var gk = (function (gk){
    var Collection = gk.Collection;

    function Subcollection(collection){
        this.collection = collection.emptyInstance();
        this.parentCollection = collection;
    }

    Subcollection.prototype = new Collection();

    Subcollection.displayName = "Subcollection";

    Subcollection.prototype.add = function(item){
        return this.collection.add(item);
    }

    Subcollection.prototype.remove = function(item){
        return this.collection.remove(item);
    }

    Subcollection.prototype.iterator = function(){
        return this.collection.iterator();
    }

    Subcollection.prototype.emptyInstance = function(){
        return new Subcollection(this.parentCollection);
    }

    Subcollection.prototype._replaceItems = function(collection){
        this.collection = collection.collection;
    }
    Subcollection.prototype._clear = function(){
        this.collection.clear();
    }

    return gk;
})(gk || {});
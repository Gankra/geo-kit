var gk = (function (gk){
    var Collection = gk.Collection;

    function Supercollection(collection){
        this.collection = collection.emptyInstance();
        this.parentCollection = collection;
    }

    Supercollection.prototype = new Collection();

    Supercollection.displayName = "Supercollection";

    Supercollection.prototype.add = function(item){
        return this.collection.add(item);
    }

    Supercollection.prototype.remove = function(item){
        return this.collection.remove(item);
    }

    Supercollection.prototype.iterator = function(){
        return this.collection.iterator();
    }

    Supercollection.prototype.emptyInstance = function(){
        return new Supercollection(this.parentCollection);
    }

    Supercollection.prototype._replaceItems = function(collection){
        this.collection = collection.collection;
    }
    Supercollection.prototype._clear = function(){
        this.collection.clear();
    }

    return gk;
})(gk || {});
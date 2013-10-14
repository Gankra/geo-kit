//Subcollection contains a subset of some other collection
//it will update itself accordingly if the superset ever
//removes an item the subset contains

//This class exists to unify internal interfaces of GeoKit, in particular
//it simplifies serialization and selection behaviours

//Subcollection is a transient Collection. This means that it is intended
//to potentially exist only temporarily, and in one place. Anything that
//has a Subcollection has the right to assume it is the only subscriber
//and maintainer of the Subcollection
var gk = (function (gk){
    var Collection = gk.Collection;
    var events = gk.events;

    function Subcollection(collection){
        if(this.collection){
            this.collection = collection.emptyInstance();
            this.parentCollection = collection;
            events.registerListener(this, collection);
        }
        this.transient = true;
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
        this.parentCollection = collection.parentCollection;
        events.unregisterListener(this, this.parentCollection);
        events.registerListener(this, this.parentCollection);
    }

    Subcollection.prototype._clear = function(){
        this.collection.clear();
    }

    Subcollection.prototype.handleEvent = function(obj, data){
        if(obj != this.parentCollection) return;
        var selfIter = this.iterator();
        var toRemove = [];
        
        //Is there a better way?
        while(selfIter.hasNext()){
            var current = selfIter.next();
            if(!parentCollection.contains(current)){
                toRemove.push(current);
            }
        }
        this.removeAll(toRemove);

        events.emit(this, data);
    }

    Subcollection.prototype.serialize = function(){
        var result = {
            type: Subcollection.displayName
          , parentCollection: this.parentCollection.uid
          , collection: this.collection.toArray()
        }

        //We're an abstraction over some other collection, so just store references
        for(var i=0; i<result.collection; ++i){
            result.collection[i] = result.collection[i].uid;
        }

        return result;
    }

    gk.serialization.registerDeserializer(Subcollection.displayName, function(obj){
        var result = new Subcollection();

        gk.serialization.registerLoadListener(obj.parentCollection, function(parentCollection){
            var newResult = new Subcollecton(parentCollection);
            result._replaceItems(newResult);
            var it = parentCollection.iterator();
            while(it.hasNext()){
                var next = it.next();
                if(obj.collection.indexOf(next.uid)>-1){
                    result.add(next);
                }
            }
        });

        return result;
    });

    gk.Subcollection = Subcollection;

    return gk;
})(gk || {});
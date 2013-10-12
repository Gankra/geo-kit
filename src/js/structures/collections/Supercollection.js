//Supercollection is a collection of collections, 
//which when read from appears to contain all of the items of its children

//This class exists to unify internal interfaces of GeoKit, in particular
//it simplifies serialization and selection behaviours

//Supercollection is a transient Collection. This means that it is intended
//to potentially exist only temporarily, and in one place. Anything that
//has a Supercollection has the right to assume it is the only subscriber
//and maintainer of the Supercollection. In addition, transient collections
//are assumed to not be the owners of any of their contents.
var gk = (function (gk){
    var Collection = gk.Collection;
    var Set = gk.Set;
    var events = gk.events;

    function Supercollection(collection){
        this.collection = new Set();
        if(collection){
            this.addAll(collection);
        }
        this.transient = true;
    }

    Supercollection.prototype = new Collection();

    Supercollection.displayName = "Supercollection";

    Supercollection.prototype.add = function(collection){
        this.collection.add(collection);
        events.registerListener(this, collection);
    }

    Supercollection.prototype.remove = function(collection){
        this.collection.remove(collection);
        events.unregisterListener(this, collection);
    }

    Supercollection.prototype.iterator = function(){
        var collections = this.collection.iterator();
        var current = null;
        var next = collections.hasNext() && collections.next().iterator();
        return {
            hasNext: function(){
                return (current && current.hasNext()) || (next && next.hasNext());
            }
          , next: function(){
                if(!current || !current.hasNext()){
                    current = next;
                    next = collections.hasNext() && collections.next().iterator();
                }
                return current.next();
            }
        }
    }

    Supercollection.prototype.handleEvent = function(obj, data){
        events.emit(this, data);
    }

    Supercollection.prototype.emptyInstance = function(){
        return new Supercollection();
    }

    Supercollection.prototype._replaceItems = function(collection){
        this.collection = collection.collection;
    }

    Supercollection.prototype._clear = function(){
        this.collection.clear();
    }

    Supercollection.prototype.serialize = function(){
        var result = {
            type: Supercollection.displayName
          , collection: this.collection.toArray()
        };

        for(var i=0; i<result.collection.length; ++i){
            result.collection[i] = result.collection[i].uid;
        }

        return result;
    }

    gk.serialization.registerDeserializer(Supercollection.displayName, function(obj){
        var result = new Supercollection();

        for(var i=0; i<obj.collection.length; ++i){
            gk.serialization.registerLoadListener(obj.collection[i], function(collection){
                result.add(collection);
            });
        }

        return result;
    });

    gk.Supercollection = Supercollection;

    return gk;
})(gk || {});
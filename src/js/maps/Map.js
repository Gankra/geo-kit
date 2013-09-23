var gk = (function(gk){

    /**
    * A Map is an abstract class that represents some algorithm that takes 
    * a collection of geometric objects and returns a new collection 
    * of geometric objects that results from the mapping
    */

    function Map(displayName, description){
        this.displayName = displayName;
        this.description = description;
    }
    
    /**
    * map performs the mapping in question, and registers relevant metadata
    *
    * returns the resulting Collection
    */
    Map.prototype.map = function(collection){
        var result = this.doMap(collection);
        result.registerMapping(collection, this);
        return result;
    }
    
    /**
    * (abstract) (protected) doMap performs the mapping in question
    * 
    * returns the resulting Collection
    */
    Map.prototype.doMap = function(collection){
        throw "Unimplemented method: Map.doMap";
    }
    
    /**
    * (protected) canMap determines whether this map can be performed on the given collection
    * By default the result is always "true"
    *
    * returns whether this map can be performed on the given collection
    */
    Map.prototype.canMap = function(collection){
        return true;
    }
    
    /**
    * manipulate takes the input and output of
    * a map and the changes made to the input, and tries to change the output to
    * reflect this. By default this is done by re-generating the the output via
    * Map.map.
    * Should be overridden if something better can be done.
    * 
    * returns void
    */
    Map.prototype.manipulate = function(input, output, inputData){
        output.replaceItems(this.doMap(input), this);
    }
    
    gk.Map = Map;
    
    gk.maps = [];
    
    gk.registerMap = function(map){
        gk.maps.push(map);        
    }

    gk.getMap = function(mapName){
        for(var i=0; i<gk.maps.length; ++i){
            var map = gk.maps[i];
            if(map.displayName == mapName){
                return map;
            }
        }
        return null;
    }

    return gk;
})(gk || {});
